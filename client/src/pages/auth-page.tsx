import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOtpSent, setForgotPasswordOtpSent] = useState(false);
  const [forgotPasswordOtpVerified, setForgotPasswordOtpVerified] = useState(false);
  const [sendingForgotPasswordOtp, setSendingForgotPasswordOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  if (user) {
    setLocation(redirectTo);
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = loginSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      await loginMutation.mutateAsync(data);
      setLocation(redirectTo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = registerSchema.parse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        userType: formData.get("userType"),
        phone: formData.get("phone"),
        otp: formData.get("otp"),
      });

      if (!otpVerified) {
        toast({
          title: "OTP Required",
          description: "Please verify your email with OTP first",
          variant: "destructive",
        });
        return;
      }

      const { confirmPassword, otp, ...registerData } = data;
      await registerMutation.mutateAsync({
        ...registerData,
        isEmailVerified: true,
      });
      
      setLocation(redirectTo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      }
    }
  };

  const sendOTP = async () => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setSendingOtp(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code",
        });
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    
    if (!email || !otp || otp.length !== 6) return;

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setOtpVerified(true);
        toast({
          title: "OTP Verified",
          description: "Email verification successful",
        });
      } else {
        setOtpVerified(false);
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      setOtpVerified(false);
      toast({
        title: "Verification Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendForgotPasswordOTP = async () => {
    if (!forgotPasswordEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setSendingForgotPasswordOtp(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setForgotPasswordOtpSent(true);
        setForgotPasswordStep(2);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the password reset code",
        });
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingForgotPasswordOtp(false);
    }
  };

  const verifyForgotPasswordOTP = async (otp: string) => {
    if (!forgotPasswordEmail || !otp || otp.length !== 6) return;

    try {
      const response = await fetch("/api/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail, otp }),
      });

      if (response.ok) {
        setForgotPasswordOtpVerified(true);
        setForgotPasswordStep(3);
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      } else {
        setForgotPasswordOtpVerified(false);
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      setForgotPasswordOtpVerified(false);
      toast({
        title: "Verification Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const data = forgotPasswordSchema.parse({
        email: forgotPasswordEmail,
        otp: formData.get("resetOtp"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmNewPassword"),
      });

      setResettingPassword(true);
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. You can now login with your new password.",
        });
        // Reset forgot password state
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setForgotPasswordEmail("");
        setForgotPasswordOtpSent(false);
        setForgotPasswordOtpVerified(false);
      } else {
        const error = await response.text();
        toast({
          title: "Reset Failed",
          description: error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        });
      }
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="page-transition flex items-center justify-center p-4" data-testid="auth-page">
      <div className="w-full max-w-6xl relative">
        {/* Back Button */}
        <div className="absolute top-0 left-0 mb-6">
          <Button variant="ghost" size="sm" asChild data-testid="auth-back-button">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center mt-12">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/@assets/icon with white_1758278761666.png" 
                alt="FlipyEdu Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">FlipyEdu</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Master Your Skills,<br />
              <span className="text-primary">Build Your Future</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of students learning cutting-edge skills from industry experts. Start your journey to success today.
            </p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
            alt="Students learning together"
            className="rounded-2xl shadow-2xl w-full"
          />
        </div>

        {/* Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full" data-testid="auth-tabs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" data-testid="login-form">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                          data-testid="login-email-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                          data-testid="login-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-password-visibility"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="login-submit-btn"
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setShowForgotPassword(true)}
                        data-testid="forgot-password-link"
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" data-testid="register-form">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="First name"
                            className="pl-10"
                            required
                            data-testid="register-firstname-input"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Last name"
                          required
                          data-testid="register-lastname-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          required
                          data-testid="register-email-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-10"
                          data-testid="register-phone-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <Select name="userType" required>
                        <SelectTrigger data-testid="register-usertype-select">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distributor">Distributor</SelectItem>
                          <SelectItem value="retailer">Retailer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          required
                          data-testid="register-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-register-password-visibility"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          required
                          data-testid="register-confirm-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          data-testid="toggle-confirm-password-visibility"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Email Verification</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="otp"
                          name="otp"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className={`flex-1 ${otpVerified ? 'border-green-500 bg-green-50' : ''}`}
                          onChange={(e) => {
                            if (e.target.value.length === 6) {
                              verifyOTP(e.target.value);
                            }
                          }}
                          data-testid="register-otp-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendOTP}
                          disabled={sendingOtp || otpSent}
                          data-testid="send-otp-btn"
                        >
                          {sendingOtp ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
                        </Button>
                      </div>
                      {otpVerified && (
                        <p className="text-sm text-green-600" data-testid="otp-verified-message">
                          ✓ Email verified successfully
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending || !otpVerified}
                      data-testid="register-submit-btn"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Forgot Password Dialog */}
        <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md" data-testid="forgot-password-dialog">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {forgotPasswordStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      data-testid="forgot-password-email-input"
                    />
                  </div>
                </div>
                <Button
                  onClick={sendForgotPasswordOTP}
                  disabled={sendingForgotPasswordOtp || !forgotPasswordEmail}
                  className="w-full"
                  data-testid="send-reset-otp-btn"
                >
                  {sendingForgotPasswordOtp ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            )}

            {forgotPasswordStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to {forgotPasswordEmail}. Please enter the code below.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-otp">Verification Code</Label>
                  <Input
                    id="forgot-otp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`text-center ${forgotPasswordOtpVerified ? 'border-green-500 bg-green-50' : ''}`}
                    onChange={(e) => {
                      if (e.target.value.length === 6) {
                        verifyForgotPasswordOTP(e.target.value);
                      }
                    }}
                    data-testid="forgot-password-otp-input"
                  />
                </div>
                {forgotPasswordOtpVerified && (
                  <p className="text-sm text-green-600" data-testid="forgot-otp-verified-message">
                    ✓ Code verified successfully
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setForgotPasswordStep(1)}
                    className="flex-1"
                    data-testid="forgot-password-back-btn"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={sendForgotPasswordOTP}
                    variant="outline"
                    disabled={sendingForgotPasswordOtp}
                    className="flex-1"
                    data-testid="resend-reset-otp-btn"
                  >
                    {sendingForgotPasswordOtp ? "Sending..." : "Resend Code"}
                  </Button>
                </div>
              </div>
            )}

            {forgotPasswordStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your new password below.
                </p>
                <input type="hidden" name="resetOtp" value="verified" />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                      required
                      data-testid="new-password-input"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="toggle-new-password-visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10"
                      required
                      data-testid="confirm-new-password-input"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="toggle-confirm-new-password-visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setForgotPasswordStep(2)}
                    className="flex-1"
                    data-testid="reset-password-back-btn"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={resettingPassword}
                    className="flex-1"
                    data-testid="reset-password-submit-btn"
                  >
                    {resettingPassword ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
        </Dialog>
        </div>
      </div>
    </div>
  );
}
