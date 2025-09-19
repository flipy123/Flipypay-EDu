import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: "Thank you for your message! We'll get back to you soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contactData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    contactMutation.mutate(contactData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="contact-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6" data-testid="contact-title">Contact Us</h1>
              <p className="text-xl text-muted-foreground" data-testid="contact-subtitle">
                Get in touch with our team for support, partnerships, or any questions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6" data-testid="send-message-title">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        required
                        data-testid="contact-firstname-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        required
                        data-testid="contact-lastname-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      data-testid="contact-phone-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" required>
                      <SelectTrigger data-testid="contact-subject-select">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course-inquiry">Course Inquiry</SelectItem>
                        <SelectItem value="technical-support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      required
                      data-testid="contact-message-input"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={contactMutation.isPending}
                    data-testid="contact-submit-btn"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6" data-testid="get-in-touch-title">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4" data-testid="contact-email-info">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">support@eduplatform.com</p>
                      <p className="text-muted-foreground">sales@eduplatform.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4" data-testid="contact-phone-info">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-muted-foreground">Mon-Fri 9AM-6PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4" data-testid="contact-address-info">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        EduPlatform Pvt Ltd<br />
                        Plot No. 123, Tech Park<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4" data-testid="follow-us-title">Follow Us</h3>
                  <div className="flex space-x-4" data-testid="social-links">
                    <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors" data-testid="facebook-link">
                      <Facebook className="h-5 w-5 text-primary-foreground" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors" data-testid="twitter-link">
                      <Twitter className="h-5 w-5 text-primary-foreground" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors" data-testid="linkedin-link">
                      <Linkedin className="h-5 w-5 text-primary-foreground" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors" data-testid="instagram-link">
                      <Instagram className="h-5 w-5 text-primary-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
