import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const categories = ["all", "Programming", "Data Science", "AI/ML", "Web Development", "Marketing", "Finance", "Mobile Development", "Design"];

  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="courses-page">
      <Navbar />
      
      <main>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6" data-testid="courses-title">All Courses</h1>
              <p className="text-xl text-muted-foreground" data-testid="courses-subtitle">
                Explore our comprehensive catalog of professional courses
              </p>
            </div>

            {/* Course Filters */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center" data-testid="course-filters">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  onClick={() => setSelectedCategory(category)}
                  className="font-semibold"
                  data-testid={`filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {category === "all" ? "All Courses" : category}
                </Button>
              ))}
            </div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="text-center py-12" data-testid="loading-state">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading courses...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="courses-grid">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid={`course-card-${course.id}`}>
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img 
                          src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          data-testid={`course-image-${course.id}`}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid={`course-title-${course.id}`}>
                          {course.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-3" data-testid={`course-description-${course.id}`}>
                          {course.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1" data-testid={`course-rating-${course.id}`}>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{(course.rating / 10).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1" data-testid={`course-duration-${course.id}`}>
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1" data-testid={`course-students-${course.id}`}>
                            <Users className="h-4 w-4" />
                            <span>{course.studentsCount?.toLocaleString() || 0}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1" data-testid={`course-lessons-${course.id}`}>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{course.lessonsCount} lessons</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary" data-testid={`course-price-${course.id}`}>
                              {formatCurrency(course.price / 100)}
                            </div>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <div className="text-sm text-muted-foreground line-through" data-testid={`course-original-price-${course.id}`}>
                                {formatCurrency(course.originalPrice / 100)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button asChild className="flex-1" data-testid={`enroll-btn-${course.id}`}>
                            <Link href={`/checkout/${course.id}`}>
                              Enroll Now
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="icon" data-testid={`view-details-btn-${course.id}`}>
                            <Link href={`/courses/${course.id}`}>
                              <BookOpen className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredCourses.length === 0 && (
              <div className="text-center py-12" data-testid="no-courses-state">
                <p className="text-muted-foreground text-lg">No courses found for the selected category.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
