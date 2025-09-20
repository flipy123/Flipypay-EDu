import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut } from "lucide-react";
import logoUrl from "@assets/icon with white_1758278761666.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0); // ✅ mobile menu close ayyaka top ki vellipotundi
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0); // ✅ desktop navigation kosam scroll-to-top
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={handleNavClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity" 
            data-testid="navbar-logo"
          >
            <img 
              src={logoUrl} 
              alt="FlipyEdu Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-foreground">FlipyEdu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              onClick={handleNavClick}
              className={`transition-colors ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary"}`}
              data-testid="navbar-home-link"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={handleNavClick}
              className={`transition-colors ${isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"}`}
              data-testid="navbar-about-link"
            >
              About Us
            </Link>
            <Link 
              href="/courses" 
              onClick={handleNavClick}
              className={`transition-colors ${isActive("/courses") ? "text-primary" : "text-foreground hover:text-primary"}`}
              data-testid="navbar-courses-link"
            >
              Courses
            </Link>
            <Link 
              href="/contact" 
              onClick={handleNavClick}
              className={`transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground hover:text-primary"}`}
              data-testid="navbar-contact-link"
            >
              Contact Us
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="navbar-user-menu">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.firstName || user.email.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" data-testid="navbar-user-dropdown">
                  <DropdownMenuItem disabled className="font-medium" data-testid="navbar-user-info">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="navbar-logout-btn">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild data-testid="navbar-login-btn">
                <Link href="/auth" onClick={handleNavClick}>Login</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              data-testid="navbar-mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border" data-testid="navbar-mobile-menu">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              className={`block py-2 transition-colors ${isActive("/") ? "text-primary" : "text-foreground hover:text-primary"}`}
              onClick={closeMobileMenu}
              data-testid="navbar-mobile-home-link"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block py-2 transition-colors ${isActive("/about") ? "text-primary" : "text-foreground hover:text-primary"}`}
              onClick={closeMobileMenu}
              data-testid="navbar-mobile-about-link"
            >
              About Us
            </Link>
            <Link 
              href="/courses" 
              className={`block py-2 transition-colors ${isActive("/courses") ? "text-primary" : "text-foreground hover:text-primary"}`}
              onClick={closeMobileMenu}
              data-testid="navbar-mobile-courses-link"
            >
              Courses
            </Link>
            <Link 
              href="/contact" 
              className={`block py-2 transition-colors ${isActive("/contact") ? "text-primary" : "text-foreground hover:text-primary"}`}
              onClick={closeMobileMenu}
              data-testid="navbar-mobile-contact-link"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
