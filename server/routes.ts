import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertContactSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Initialize sample courses
  await initializeSampleCourses();

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ error: "Failed to submit contact form" });
    }
  });

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  // Get single course
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const orderData = {
        ...req.body,
        userId: req.user.id,
      };

      const validatedOrder = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validatedOrder);
      
      // Create enrollment after successful order creation
      await storage.createEnrollment({
        userId: req.user.id,
        courseId: validatedOrder.courseId,
        status: "active"
      });
      
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const orders = await storage.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get user enrollments
  app.get("/api/enrollments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const enrollments = await storage.getUserEnrollments(req.user.id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  // Check enrollment status
  app.get("/api/enrollments/:courseId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const isEnrolled = await storage.isUserEnrolled(req.user.id, req.params.courseId);
      res.json({ enrolled: isEnrolled });
    } catch (error) {
      console.error("Error checking enrollment:", error);
      res.status(500).json({ error: "Failed to check enrollment" });
    }
  });

  // Send OTP
  app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await storage.createOtp({
        email,
        otp: otpCode,
        expiresAt,
      });

      // Send OTP via Brevo API
      const brevoApiKey = process.env.BREVO_API_KEY || "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";
      const senderEmail = process.env.BREVO_SENDER || "noreply@flipypay.com";

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: senderEmail },
          to: [{ email }],
          subject: "FlipyEdu - Email Verification OTP",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: #62bf00; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                  <span style="color: #000000; font-weight: bold; font-size: 24px;">E</span>
                </div>
                <h1 style="color: #62bf00; margin: 0;">FlipyEdu</h1>
              </div>
              
              <h2 style="color: #ffffff; text-align: center;">Email Verification</h2>
              
              <p style="color: #ffffff; font-size: 16px;">Thank you for signing up with FlipyEdu!</p>
              
              <p style="color: #ffffff; font-size: 16px;">Your verification code is:</p>
              
              <div style="background: #62bf00; color: #000000; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 8px; letter-spacing: 4px;">
                ${otpCode}
              </div>
              
              <p style="color: #ffffff; font-size: 14px;">This code will expire in 10 minutes.</p>
              
              <p style="color: #ffffff; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                <p style="color: #888888; font-size: 12px;">Best regards,<br>FlipyEdu Team</p>
              </div>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP email");
      }

      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("OTP sending error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Verify OTP
  app.post("/api/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
      const validOtp = await storage.getValidOtp(email, otp);
      
      if (!validOtp) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      await storage.markOtpAsUsed(validOtp.id);
      res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Forgot Password - Send OTP
  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found with this email address" });
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await storage.createOtp({
        email,
        otp: otpCode,
        expiresAt,
      });

      // Send OTP via Brevo API
      const brevoApiKey = process.env.BREVO_API_KEY || "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";
      const senderEmail = process.env.BREVO_SENDER || "noreply@flipypay.com";

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: senderEmail },
          to: [{ email }],
          subject: "FlipyEdu - Password Reset OTP",
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 20px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: #62bf00; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                  <span style="color: #000000; font-weight: bold; font-size: 24px;">F</span>
                </div>
                <h1 style="color: #62bf00; margin: 0;">FlipyEdu</h1>
              </div>
              
              <h2 style="color: #ffffff; text-align: center;">Password Reset</h2>
              
              <p style="color: #ffffff; font-size: 16px;">You requested to reset your password for your FlipyEdu account.</p>
              
              <p style="color: #ffffff; font-size: 16px;">Your password reset code is:</p>
              
              <div style="background: #62bf00; color: #000000; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 8px; letter-spacing: 4px;">
                ${otpCode}
              </div>
              
              <p style="color: #ffffff; font-size: 14px;">This code will expire in 10 minutes.</p>
              
              <p style="color: #ffffff; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                <p style="color: #888888; font-size: 12px;">Best regards,<br>FlipyEdu Team</p>
              </div>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send password reset email");
      }

      res.json({ success: true, message: "Password reset OTP sent successfully" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to send password reset OTP" });
    }
  });

  // Verify Reset OTP
  app.post("/api/verify-reset-otp", async (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
      const validOtp = await storage.getValidOtp(email, otp);
      
      if (!validOtp) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Don't mark as used yet - we'll do that when password is actually reset
      res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Reset Password
  app.post("/api/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
      // Verify OTP one more time
      const validOtp = await storage.getValidOtp(email, otp);
      
      if (!validOtp) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Reset password
      await storage.resetUserPassword(email, newPassword);
      
      // Mark OTP as used
      await storage.markOtpAsUsed(validOtp.id);
      
      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeSampleCourses() {
  try {
    const existingCourses = await storage.getAllCourses();
    if (existingCourses.length > 0) {
      return; // Courses already exist
    }

    const sampleCourses = [
      {
        title: "Complete Python Programming",
        description: "Master Python from basics to advanced concepts. Perfect for beginners and experienced developers.",
        longDescription: "This comprehensive Python course covers everything from basic syntax to advanced topics like web development, data analysis, and machine learning. You'll build real-world projects and gain practical experience.",
        price: 299900, // ₹2,999
        originalPrice: 499900, // ₹4,999
        imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Programming",
        duration: "40 hours",
        lessonsCount: 120,
        studentsCount: 15420,
        rating: 48, // 4.8
        whatYouLearn: [
          "Python fundamentals and syntax",
          "Object-oriented programming",
          "Data structures and algorithms",
          "Web development with Django/Flask",
          "Data analysis with pandas",
          "API development and integration"
        ],
        requirements: [
          "Basic computer knowledge",
          "No prior programming experience required",
          "Computer with internet connection"
        ]
      },
      {
        title: "Data Science Mastery",
        description: "Learn data analysis, machine learning, and visualization with real-world projects.",
        longDescription: "Comprehensive data science course covering statistics, Python libraries, machine learning algorithms, and data visualization. Build a complete portfolio of data science projects.",
        price: 399900, // ₹3,999
        originalPrice: 599900, // ₹5,999
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Data Science",
        duration: "60 hours",
        lessonsCount: 180,
        studentsCount: 12340,
        rating: 49, // 4.9
        whatYouLearn: [
          "Statistical analysis and probability",
          "Python for data science (pandas, numpy)",
          "Machine learning algorithms",
          "Data visualization with matplotlib/seaborn",
          "Real-world project development",
          "Deployment of ML models"
        ],
        requirements: [
          "Basic Python knowledge",
          "High school mathematics",
          "Computer with Python installed"
        ]
      },
      {
        title: "AI & Machine Learning",
        description: "Build intelligent systems and understand the future of technology with AI/ML.",
        longDescription: "Advanced course in artificial intelligence and machine learning. Learn to build neural networks, deep learning models, and AI applications that solve real-world problems.",
        price: 699900, // ₹6,999
        originalPrice: 999900, // ₹9,999
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "AI/ML",
        duration: "80 hours",
        lessonsCount: 220,
        studentsCount: 9850,
        rating: 47, // 4.7
        whatYouLearn: [
          "Neural networks and deep learning",
          "Computer vision and image processing",
          "Natural language processing",
          "Reinforcement learning",
          "TensorFlow and PyTorch",
          "AI model deployment"
        ],
        requirements: [
          "Python programming experience",
          "Basic mathematics and statistics",
          "Understanding of machine learning basics"
        ]
      },
      {
        title: "Full Stack Web Development",
        description: "Create modern web applications with HTML, CSS, JavaScript, and popular frameworks.",
        longDescription: "Complete full-stack development course covering frontend technologies, backend development, databases, and deployment. Build and deploy real-world web applications.",
        price: 399900, // ₹3,999
        originalPrice: 599900, // ₹5,999
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Web Development",
        duration: "50 hours",
        lessonsCount: 150,
        studentsCount: 18920,
        rating: 48, // 4.8
        whatYouLearn: [
          "HTML5, CSS3, and JavaScript",
          "React.js for frontend development",
          "Node.js and Express for backend",
          "Database design and management",
          "RESTful API development",
          "Deployment and hosting"
        ],
        requirements: [
          "Basic computer skills",
          "No prior programming experience required",
          "Computer with internet connection"
        ]
      },
      {
        title: "Digital Marketing Mastery",
        description: "Master SEO, social media marketing, and online advertising strategies.",
        longDescription: "Comprehensive digital marketing course covering all aspects of online marketing including SEO, social media, content marketing, and paid advertising strategies.",
        price: 249900, // ₹2,499
        originalPrice: 399900, // ₹3,999
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Marketing",
        duration: "30 hours",
        lessonsCount: 90,
        studentsCount: 22150,
        rating: 46, // 4.6
        whatYouLearn: [
          "Search engine optimization (SEO)",
          "Social media marketing strategies",
          "Google Ads and Facebook Ads",
          "Content marketing and copywriting",
          "Email marketing campaigns",
          "Analytics and performance tracking"
        ],
        requirements: [
          "Basic internet navigation skills",
          "No prior marketing experience required",
          "Computer with internet access"
        ]
      },
      {
        title: "Financial Analysis & Trading",
        description: "Learn investment strategies, financial modeling, and market analysis techniques.",
        longDescription: "Professional course in financial analysis covering fundamental and technical analysis, portfolio management, risk assessment, and trading strategies for Indian and global markets.",
        price: 349900, // ₹3,499
        originalPrice: 499900, // ₹4,999
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Finance",
        duration: "45 hours",
        lessonsCount: 135,
        studentsCount: 11280,
        rating: 47, // 4.7
        whatYouLearn: [
          "Fundamental and technical analysis",
          "Portfolio management strategies",
          "Risk assessment and management",
          "Indian stock market operations",
          "Trading psychology and discipline",
          "Financial modeling in Excel"
        ],
        requirements: [
          "Basic mathematics skills",
          "Interest in financial markets",
          "Computer with Excel/Google Sheets"
        ]
      },
      {
        title: "Mobile App Development",
        description: "Build native and cross-platform mobile applications for iOS and Android.",
        longDescription: "Complete mobile app development course covering React Native, Flutter, and native development. Learn to build, test, and deploy mobile applications for both iOS and Android platforms.",
        price: 449900, // ₹4,499
        originalPrice: 699900, // ₹6,999
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Mobile Development",
        duration: "55 hours",
        lessonsCount: 165,
        studentsCount: 8760,
        rating: 45, // 4.5
        whatYouLearn: [
          "React Native development",
          "Flutter framework basics",
          "Native iOS and Android development",
          "App store deployment process",
          "Mobile UI/UX best practices",
          "Performance optimization"
        ],
        requirements: [
          "Basic programming knowledge",
          "JavaScript fundamentals",
          "Computer with development tools"
        ]
      },
      {
        title: "Graphic Design Fundamentals",
        description: "Master visual communication with industry-standard design tools and techniques.",
        longDescription: "Professional graphic design course covering design principles, color theory, typography, and hands-on experience with Adobe Creative Suite and other design tools.",
        price: 279900, // ₹2,799
        originalPrice: 429900, // ₹4,299
        imageUrl: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        category: "Design",
        duration: "35 hours",
        lessonsCount: 105,
        studentsCount: 14630,
        rating: 46, // 4.6
        whatYouLearn: [
          "Design principles and color theory",
          "Adobe Photoshop and Illustrator",
          "Typography and layout design",
          "Brand identity creation",
          "Print and digital design",
          "Portfolio development"
        ],
        requirements: [
          "Basic computer skills",
          "Creative mindset",
          "Computer with graphics capability"
        ]
      }
    ];

    for (const courseData of sampleCourses) {
      await storage.createCourse(courseData);
    }

    console.log("Sample courses initialized successfully");
  } catch (error) {
    console.error("Error initializing sample courses:", error);
  }
}
