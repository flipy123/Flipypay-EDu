import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, Users, BookOpen, Check, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

export default function CourseDetailPage() {
  const { id } = useParams();

  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id,
  });

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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="course-detail-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Course Header */}
                <div className="space-y-6">
                  <img
                    src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-2xl"
                    data-testid="course-hero-image"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" data-testid="course-category">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1" data-testid="course-rating">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{((course.rating || 0) / 10).toFixed(1)}</span>
                          <span>({course.studentsCount?.toLocaleString()} students)</span>
                        </div>
                        <div className="flex items-center gap-1" data-testid="course-duration">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1" data-testid="course-lessons">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lessonsCount} lessons</span>
                        </div>
                      </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold" data-testid="course-title">
                      {course.title}
                    </h1>
                    
                    <p className="text-lg text-muted-foreground" data-testid="course-description">
                      {course.longDescription || course.description}
                    </p>
                  </div>
                </div>

                {/* What You'll Learn */}
                {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                  <Card data-testid="what-youll-learn-section">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">What you'll learn</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.whatYouLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-3" data-testid={`learn-item-${index}`}>
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Requirements */}
                {course.requirements && course.requirements.length > 0 && (
                  <Card data-testid="requirements-section">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold mb-6">Requirements</h2>
                      <ul className="space-y-2">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3" data-testid={`requirement-${index}`}>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <Card className="sticky top-24" data-testid="course-purchase-card">
                  <CardContent className="p-6 space-y-6">
                    <div className="text-center">
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-primary" data-testid="course-price">
                          {formatCurrency(course.price / 100)}
                        </div>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <div className="text-lg text-muted-foreground line-through" data-testid="course-original-price">
                            {formatCurrency(course.originalPrice / 100)}
                          </div>
                        )}
                        {course.originalPrice && course.originalPrice > course.price && (
                          <div className="text-sm text-green-600 font-semibold" data-testid="course-savings">
                            Save {formatCurrency((course.originalPrice - course.price) / 100)}!
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Lessons:</span>
                        <span className="font-medium">{course.lessonsCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.studentsCount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Access:</span>
                        <span className="font-medium">Lifetime</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Certificate:</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Button asChild size="lg" className="w-full" data-testid="enroll-now-btn">
                        <Link href={`/checkout/${course.id}`}>
                          Enroll Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
