import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CreditCard, Star, Clock, Users } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import type { Course } from "@shared/schema";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function CheckoutPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPaymentPending, setShowPaymentPending] = useState(false);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      setShowPaymentPending(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!course) return;

    const formData = new FormData(e.currentTarget);
    const gst = Math.round(course.price * 0.18);
    const total = course.price + gst;

    const orderData = {
      courseId: course.id,
      amount: course.price,
      gst,
      total,
      billingAddress: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
      },
    };

    createOrderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Alert className="max-w-md">
            <AlertDescription>Course not found.</AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPaymentPending) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Gateway Integration Pending</h3>
              <p className="text-muted-foreground mb-6">
                We're currently working on integrating our payment gateway. Your course enrollment has been recorded and you'll be notified once payment processing is available.
              </p>
              <Button onClick={() => setShowPaymentPending(false)}>
                Understood
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const gst = Math.round(course.price * 0.18);
  const total = course.price + gst;

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="checkout-page">
      <Navbar />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" data-testid="checkout-title">Checkout</h1>
            <p className="text-muted-foreground">Complete your course enrollment</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card data-testid="billing-form">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={user?.firstName || ""}
                          required
                          data-testid="checkout-firstname-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={user?.lastName || ""}
                          required
                          data-testid="checkout-lastname-input"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user?.email || ""}
                        required
                        data-testid="checkout-email-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        defaultValue={user?.phone || ""}
                        required
                        data-testid="checkout-phone-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="House No., Street, Area"
                        defaultValue={user?.address || ""}
                        required
                        data-testid="checkout-address-input"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          defaultValue={user?.city || ""}
                          required
                          data-testid="checkout-city-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select name="state" defaultValue={user?.state || ""} required>
                          <SelectTrigger data-testid="checkout-state-select">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          pattern="[0-9]{6}"
                          placeholder="560001"
                          defaultValue={user?.pincode || ""}
                          required
                          data-testid="checkout-pincode-input"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={createOrderMutation.isPending}
                      data-testid="proceed-payment-btn"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      {createOrderMutation.isPending ? "Processing..." : "Proceed to Payment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24" data-testid="order-summary">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4" data-testid="course-info">
                    <img
                      src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold line-clamp-2" data-testid="course-title">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating ? (course.rating / 10).toFixed(1) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{course.studentsCount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between" data-testid="course-price">
                      <span>Course Price:</span>
                      <span>{formatCurrency(course.price / 100)}</span>
                    </div>
                    <div className="flex justify-between" data-testid="gst-amount">
                      <span>GST (18%):</span>
                      <span>{formatCurrency(gst / 100)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-3" data-testid="total-amount">
                      <span>Total:</span>
                      <span className="text-primary">{formatCurrency(total / 100)}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Secure payment with 256-bit SSL encryption
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
