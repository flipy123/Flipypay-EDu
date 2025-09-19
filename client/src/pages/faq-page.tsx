import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="faq-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-6" data-testid="faq-title">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground" data-testid="faq-subtitle">
                Find answers to common questions about our courses and platform
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
              <AccordionItem value="enrollment" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-enrollment-trigger">
                  How do I enroll in a course?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-enrollment-content">
                  To enroll in a course, simply browse our course catalog, select the course you want, and click "Enroll Now". If you don't have an account, you'll be prompted to create one. After completing the payment process, you'll have immediate access to the course materials.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-payment-trigger">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-payment-content">
                  We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI payments, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay. All payments are processed securely through our encrypted payment gateway.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="access" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-access-trigger">
                  How long do I have access to a course?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-access-content">
                  Once enrolled, you have lifetime access to all course materials, including videos, resources, and any future updates to the course content. You can learn at your own pace and revisit the materials anytime you want.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mobile" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-mobile-trigger">
                  Can I access courses on mobile devices?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-mobile-content">
                  Yes! Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, laptops, and desktops. You can continue your learning journey anywhere, anytime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="certificates" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-certificates-trigger">
                  Do I get a certificate after completion?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-certificates-content">
                  Yes, you'll receive a verified certificate of completion for each course you finish. Our certificates are industry-recognized and can be shared on LinkedIn, added to your resume, or used for professional development purposes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prerequisites" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-prerequisites-trigger">
                  Are there any prerequisites for the courses?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-prerequisites-content">
                  Prerequisites vary by course and are clearly mentioned in each course description. Most beginner-level courses don't require prior experience, while advanced courses may require foundational knowledge in the subject area.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="job-placement" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-job-placement-trigger">
                  Do you provide job placement assistance?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-job-placement-content">
                  While we don't guarantee job placement, we provide career guidance, portfolio reviews, interview preparation, and have partnerships with companies for placement opportunities. We also offer resume building assistance and networking opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-refund-trigger">
                  What is your refund policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-refund-content">
                  We offer a 30-day money-back guarantee on all courses. If you're not satisfied with your purchase within 30 days of enrollment and have completed less than 30% of the course, you can request a full refund. Please see our detailed refund policy for more information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-support-trigger">
                  How can I get help if I'm stuck?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-support-content">
                  We offer multiple support channels including email support (support@eduplatform.com), live chat during business hours, community forums where you can interact with other students and instructors, and comprehensive documentation for technical issues.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="updates" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-updates-trigger">
                  Do you update course content regularly?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-updates-content">
                  Yes, we regularly update our courses to reflect the latest industry trends, technologies, and best practices. All enrolled students automatically get access to updated content at no additional cost, ensuring you're always learning the most current information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-discounts" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-group-discounts-trigger">
                  Do you offer group discounts for organizations?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-group-discounts-content">
                  Yes, we offer special pricing for bulk enrollments and corporate training programs. For groups of 10 or more, please contact our sales team at sales@eduplatform.com to discuss custom pricing and enterprise features like progress tracking and reporting.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="download" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-download-trigger">
                  Can I download course videos for offline viewing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-download-content">
                  Currently, our courses are designed for online streaming to ensure the best quality and security. However, we're working on a mobile app that will allow offline viewing of course materials. You can access courses from any device with an internet connection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-12 text-center bg-card p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4" data-testid="faq-still-questions-title">Still have questions?</h3>
              <p className="text-muted-foreground mb-6" data-testid="faq-still-questions-content">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@eduplatform.com" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="faq-email-support-btn"
                >
                  Email Support
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                  data-testid="faq-phone-support-btn"
                >
                  Call Us: +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
