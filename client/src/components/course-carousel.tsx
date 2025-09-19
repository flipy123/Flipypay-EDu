import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

interface CourseCarouselProps {
  courses: Course[];
}

export default function CourseCarousel({ courses }: CourseCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let isHovered = false;

    const startAutoScroll = () => {
      const scroll = () => {
        if (!isHovered && carousel) {
          carousel.scrollBy({ left: 1, behavior: 'auto' });
          
          // Reset to beginning if we've scrolled to the end
          if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
            carousel.scrollTo({ left: 0, behavior: 'auto' });
          }
        }
        animationId = requestAnimationFrame(scroll);
      };
      scroll();
    };

    const stopAutoScroll = () => {
      cancelAnimationFrame(animationId);
    };

    // Mouse events
    carousel.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    carousel.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Start auto-scroll
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [courses]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Duplicate courses for seamless loop
  const duplicatedCourses = [...courses, ...courses];

  return (
    <div className="relative" data-testid="course-carousel">
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border-border hover:bg-secondary"
        onClick={scrollLeft}
        data-testid="carousel-prev-btn"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border-border hover:bg-secondary"
        onClick={scrollRight}
        data-testid="carousel-next-btn"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-testid="carousel-container"
      >
        {duplicatedCourses.map((course, index) => (
          <Card 
            key={`${course.id}-${index}`} 
            className="group min-w-[320px] flex-shrink-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            data-testid={`carousel-course-card-${index}`}
          >
            <CardContent className="p-0">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-testid={`carousel-course-image-${index}`}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {course.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid={`carousel-course-title-${index}`}>
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm line-clamp-3" data-testid={`carousel-course-description-${index}`}>
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1" data-testid={`carousel-course-rating-${index}`}>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{((course.rating || 0) / 10).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1" data-testid={`carousel-course-duration-${index}`}>
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1" data-testid={`carousel-course-students-${index}`}>
                    <Users className="h-4 w-4" />
                    <span>{course.studentsCount?.toLocaleString() || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary" data-testid={`carousel-course-price-${index}`}>
                      {formatCurrency(course.price / 100)}
                    </div>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <div className="text-sm text-muted-foreground line-through" data-testid={`carousel-course-original-price-${index}`}>
                        {formatCurrency(course.originalPrice / 100)}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button asChild className="w-full" data-testid={`carousel-enroll-btn-${index}`}>
                  <Link href={`/checkout/${course.id}`}>
                    Enroll Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
