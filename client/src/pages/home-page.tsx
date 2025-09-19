import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Clock, Award, Users, Star, ArrowRight, Play, BookOpen, Target } from "lucide-react";
import CourseCarousel from "@/components/course-carousel";
import { formatCurrency } from "@/lib/currency";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

export default function HomePage() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const featuredCourses = courses.slice(0, 8);

  return (
    <div data-testid="home-page">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden" data-testid="hero-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-in slide-in-from-left duration-700">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6" data-testid="hero-title">
                  Learn & Grow with
                  <span className="text-primary block">Expert Courses</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8" data-testid="hero-description">
                  Master new skills with our comprehensive online courses. From programming to business, we have everything you need to advance your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="text-lg px-8 py-6" data-testid="explore-courses-btn">
                    <Link href="/courses">
                      <Play className="mr-2 h-5 w-5" />
                      Explore Courses
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6" data-testid="learn-more-btn">
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="animate-in slide-in-from-right duration-700">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                    alt="Students learning together in a modern classroom setting"
                    className="rounded-2xl shadow-2xl w-full h-auto"
                    data-testid="hero-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us - Our Mission Section */}
        <section className="py-20 bg-card" data-testid="mission-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" data-testid="mission-title">
                About Us — Our Mission
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="mission-description">
                We believe that quality education should be accessible to everyone, everywhere. Our mission is to democratize learning by providing world-class educational content at affordable prices.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center" data-testid="feature-expert-instructors">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
                  <p className="text-muted-foreground">Learn from industry professionals with years of real-world experience.</p>
                </CardContent>
              </Card>
              
              <Card className="text-center" data-testid="feature-flexible-learning">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Flexible Learning</h3>
                  <p className="text-muted-foreground">Study at your own pace with lifetime access to course materials.</p>
                </CardContent>
              </Card>
              
              <Card className="text-center" data-testid="feature-certification">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Certification</h3>
                  <p className="text-muted-foreground">Earn industry-recognized certificates upon course completion.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Courses Section */}
        <section className="py-20" data-testid="courses-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-4" data-testid="courses-title">Our Courses</h2>
                <p className="text-xl text-muted-foreground">Discover our comprehensive range of professional courses</p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/80" data-testid="see-all-courses-btn">
                <Link href="/courses">
                  See All Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading courses...</p>
              </div>
            ) : (
              <CourseCarousel courses={featuredCourses} />
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-card" data-testid="faq-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" data-testid="faq-title">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Get answers to common questions about our courses and platform</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
              <AccordionItem value="access" className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-access-trigger">
                  How do I access my courses after enrollment?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-access-content">
                  After successful enrollment, you'll receive an email with login credentials. You can access your courses through the student dashboard with lifetime access to all course materials.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment" className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-payment-trigger">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-payment-content">
                  We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment gateway.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="certificates" className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-certificates-trigger">
                  Do you provide certificates?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-certificates-content">
                  Yes, you'll receive a verified certificate upon successful completion of any course. Our certificates are industry-recognized and can be shared on LinkedIn and other professional platforms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund" className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline" data-testid="faq-refund-trigger">
                  What is your refund policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid="faq-refund-content">
                  We offer a 30-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within 30 days of enrollment.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
    </div>
  );
}
