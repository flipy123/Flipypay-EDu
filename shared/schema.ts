import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type").notNull(), // distributor, retailer, other
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const otps = pgTable("otps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  price: integer("price").notNull(), // in paisa
  originalPrice: integer("original_price").notNull(), // in paisa
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  duration: text("duration"),
  lessonsCount: integer("lessons_count"),
  studentsCount: integer("students_count").default(0),
  rating: integer("rating").default(48), // rating * 10 (4.8 = 48)
  curriculum: jsonb("curriculum"), // JSON array of modules/topics
  whatYouLearn: text("what_you_learn").array(),
  requirements: text("requirements").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  status: text("status").notNull().default("active"), // active, completed, cancelled
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  amount: integer("amount").notNull(), // in paisa
  gst: integer("gst").notNull(), // in paisa
  total: integer("total").notNull(), // in paisa
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  paymentDetails: jsonb("payment_details"),
  billingAddress: jsonb("billing_address"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, responded, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  orders: many(orders),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  orders: many(orders),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [orders.courseId],
    references: [courses.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertOtpSchema = createInsertSchema(otps).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Otp = typeof otps.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
