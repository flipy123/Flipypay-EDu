import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <div className="page-transition min-h-screen bg-background text-foreground" data-testid="terms-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild data-testid="terms-back-button">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <h1 className="text-4xl font-bold mb-8" data-testid="terms-title">Terms & Conditions</h1>
            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground mb-6" data-testid="terms-updated">Last updated: January 2024</p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-acceptance-title">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground" data-testid="terms-acceptance-content">
                    By accessing and using EduPlatform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-course-access-title">2. Course Access and Usage</h2>
                  <p className="text-muted-foreground mb-4" data-testid="terms-course-access-content">
                    Upon successful enrollment and payment, you will receive lifetime access to the course materials. You agree that you will not:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Redistribute, share, or resell the course content</li>
                    <li>Download course videos for offline distribution</li>
                    <li>Share your login credentials with others</li>
                    <li>Use the content for commercial purposes without permission</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-payment-title">3. Payment and Refunds</h2>
                  <p className="text-muted-foreground" data-testid="terms-payment-content">
                    All payments must be made in Indian Rupees (INR). We accept various payment methods including credit cards, debit cards, UPI, and digital wallets. We offer a 30-day money-back guarantee from the date of purchase, subject to our refund policy terms.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-user-conduct-title">4. User Conduct</h2>
                  <p className="text-muted-foreground" data-testid="terms-user-conduct-content">
                    Users must not engage in any activity that disrupts or interferes with the platform or other users' learning experience. This includes but is not limited to harassment, spam, or uploading malicious content.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-ip-title">5. Intellectual Property</h2>
                  <p className="text-muted-foreground" data-testid="terms-ip-content">
                    All course content, including videos, texts, images, and materials, are the intellectual property of EduPlatform and its instructors. You may not reproduce, distribute, or create derivative works from this content without explicit written permission.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-privacy-title">6. Privacy Policy</h2>
                  <p className="text-muted-foreground" data-testid="terms-privacy-content">
                    Your privacy is important to us. We collect and process personal information in accordance with our Privacy Policy. By using our services, you consent to the collection and use of information as outlined in our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-limitation-title">7. Limitation of Liability</h2>
                  <p className="text-muted-foreground" data-testid="terms-limitation-content">
                    EduPlatform shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-governing-law-title">8. Governing Law</h2>
                  <p className="text-muted-foreground" data-testid="terms-governing-law-content">
                    These Terms shall be interpreted and governed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="terms-contact-title">9. Contact Information</h2>
                  <p className="text-muted-foreground" data-testid="terms-contact-content">
                    If you have any questions about these Terms & Conditions, please contact us at legal@eduplatform.com or write to us at our registered office address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
