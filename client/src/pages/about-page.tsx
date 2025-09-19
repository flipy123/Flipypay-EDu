import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Heart, Users, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="page-transition" data-testid="about-page">
      
      <main>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6" data-testid="about-title">About EduPlatform</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="about-subtitle">
                Empowering learners worldwide with quality education and professional development opportunities.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-6" data-testid="story-title">Our Story</h2>
                <p className="text-muted-foreground mb-6" data-testid="story-paragraph-1">
                  Founded in 2020, EduPlatform emerged from a simple belief: everyone deserves access to quality education. We started with a mission to bridge the gap between traditional learning and the demands of the modern digital economy.
                </p>
                <p className="text-muted-foreground mb-6" data-testid="story-paragraph-2">
                  Today, we've helped over 50,000 students across India and beyond acquire new skills, advance their careers, and achieve their professional goals through our comprehensive online courses.
                </p>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="text-center" data-testid="stat-students">
                    <div className="text-3xl font-bold text-primary">50K+</div>
                    <div className="text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center" data-testid="stat-courses">
                    <div className="text-3xl font-bold text-primary">100+</div>
                    <div className="text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center" data-testid="stat-success">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Team of diverse professionals collaborating in a modern workspace"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  data-testid="team-image"
                />
              </div>
            </div>

            <Card className="bg-card rounded-2xl p-8 lg:p-12" data-testid="values-section">
              <h2 className="text-3xl font-bold mb-8 text-center" data-testid="values-title">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center" data-testid="value-innovation">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground text-sm">Continuously improving our platform and content</p>
                </div>
                <div className="text-center" data-testid="value-passion">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Passion</h3>
                  <p className="text-muted-foreground text-sm">Passionate about education and student success</p>
                </div>
                <div className="text-center" data-testid="value-community">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground text-sm">Building a supportive learning community</p>
                </div>
                <div className="text-center" data-testid="value-excellence">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Excellence</h3>
                  <p className="text-muted-foreground text-sm">Committed to delivering the highest quality</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
