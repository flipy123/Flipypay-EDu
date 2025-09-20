import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6" data-testid="footer-logo">
              <img 
                src="/favicon.png"   // ✅ public folder icon
                alt="FlipyEdu Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">FlipyEdu</span>
            </div>
            <p className="text-muted-foreground mb-6" data-testid="footer-description">
              Empowering learners worldwide with quality education and professional development opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6" data-testid="footer-quick-links-title">Quick Links</h3>
            <div className="space-y-3">
              <Link 
                href="/" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-home-link"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-about-link"
              >
                About Us
              </Link>
              <Link 
                href="/courses" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-courses-link"
              >
                Courses
              </Link>
              <Link 
                href="/contact" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-contact-link"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="font-semibold mb-6" data-testid="footer-courses-title">Popular Courses</h3>
            <div className="space-y-3">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Python Programming
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Data Science
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Web Development
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Digital Marketing
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-6" data-testid="footer-legal-title">Legal</h3>
            <div className="space-y-3">
              <Link 
                href="/terms" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-terms-link"
              >
                Terms & Conditions
              </Link>
              <Link 
                href="/refund" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-refund-link"
              >
                Refund Policy
              </Link>
              <Link 
                href="/faq" 
                onClick={() => window.scrollTo(0, 0)}
                className="block text-muted-foreground hover:text-primary transition-colors"
                data-testid="footer-faq-link"
              >
                FAQ
              </Link>
              
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
              © 2024 FlipyEdu. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-4 md:mt-0" data-testid="footer-made-in-india">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
