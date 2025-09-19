import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="refund-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-8" data-testid="refund-title">Refund Policy</h1>
            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground mb-6" data-testid="refund-updated">Last updated: January 2024</p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-guarantee-title">30-Day Money-Back Guarantee</h2>
                  <p className="text-muted-foreground" data-testid="refund-guarantee-content">
                    We stand behind the quality of our courses. If you're not completely satisfied with your purchase, we offer a full refund within 30 days of course enrollment, no questions asked.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-conditions-title">Refund Conditions</h2>
                  <p className="text-muted-foreground mb-4" data-testid="refund-conditions-intro">
                    To be eligible for a refund, the following conditions must be met:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Refund requests must be made within 30 days of enrollment</li>
                    <li>Course completion must be less than 30% of total content</li>
                    <li>No violations of our terms of service</li>
                    <li>Account must be in good standing</li>
                    <li>Original payment method should be available for refund processing</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-process-title">Refund Process</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2" data-testid="refund-how-to-request-title">How to Request a Refund</h3>
                      <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Contact our support team at refunds@eduplatform.com</li>
                        <li>Include your order details and reason for refund</li>
                        <li>Our team will review your request within 2 business days</li>
                        <li>Upon approval, refund will be processed within 5-7 business days</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2" data-testid="refund-processing-time-title">Processing Time</h3>
                      <p className="text-muted-foreground" data-testid="refund-processing-time-content">
                        Refunds are typically processed within 5-7 business days after approval. The refund will be credited to your original payment method. For UPI and digital wallet payments, processing may take up to 10 business days.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-non-refundable-title">Non-Refundable Items</h2>
                  <p className="text-muted-foreground mb-4" data-testid="refund-non-refundable-content">
                    The following items are not eligible for refunds:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Courses completed more than 30% or after 30 days</li>
                    <li>Certificates that have already been issued</li>
                    <li>Downloadable materials accessed after the 30-day period</li>
                    <li>Subscription services (monthly/yearly plans)</li>
                    <li>Promotional or discounted courses purchased during special offers</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-partial-title">Partial Refunds</h2>
                  <p className="text-muted-foreground" data-testid="refund-partial-content">
                    In certain circumstances, partial refunds may be offered at our discretion. This typically applies to technical issues that prevented access to course materials for an extended period or other exceptional circumstances.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-disputes-title">Payment Disputes</h2>
                  <p className="text-muted-foreground" data-testid="refund-disputes-content">
                    If you initiate a chargeback or payment dispute through your bank or payment provider, we reserve the right to suspend your account and access to all courses until the matter is resolved. We encourage you to contact us directly before initiating any disputes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-4" data-testid="refund-contact-title">Contact for Refunds</h2>
                  <p className="text-muted-foreground" data-testid="refund-contact-content">
                    For refund requests or questions about our refund policy, please contact:
                  </p>
                  <div className="bg-card p-4 rounded-lg mt-4">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> refunds@eduplatform.com<br />
                      <strong>Phone:</strong> +91 98765 43210<br />
                      <strong>Business Hours:</strong> Mon-Fri, 9AM-6PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
