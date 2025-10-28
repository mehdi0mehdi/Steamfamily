import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table - user information with admin flag
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").notNull().default(false),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tools table - gaming tools/utilities
export const tools = pgTable("tools", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  downloadUrl: text("download_url").notNull(),
  mirrorUrl: text("mirror_url"),
  donateUrl: text("donate_url"),
  telegramUrl: text("telegram_url"),
  version: text("version").notNull(),
  downloads: integer("downloads").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Reviews table - user reviews with ratings
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  toolId: uuid("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Downloads log table - track downloads for analytics
export const downloadsLog = pgTable("downloads_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  toolId: uuid("tool_id").notNull().references(() => tools.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
  body: z.string().min(10).max(2000),
});

export const insertDownloadLogSchema = createInsertSchema(downloadsLog).omit({
  id: true,
  createdAt: true,
});

// Supabase returns data in snake_case, so we define types that match the actual API responses
export type Profile = {
  id: string;
  email: string;
  is_admin: boolean;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Tool = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  images: string[];
  tags: string[];
  download_url: string;
  mirror_url: string | null;
  donate_url: string | null;
  telegram_url: string | null;
  version: string;
  downloads: number;
  visible: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  tool_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
};

export type DownloadLog = {
  id: string;
  tool_id: string;
  user_id: string | null;
  ip_hash: string | null;
  created_at: string;
};

// Drizzle insert types (still use the Zod schemas for validation)
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertDownloadLog = z.infer<typeof insertDownloadLogSchema>;

// Review with user info for display
export type ReviewWithUser = Review & {
  user: Pick<Profile, 'display_name' | 'avatar_url' | 'email'>;
};

// Tool with stats for display
export type ToolWithStats = Tool & {
  averageRating?: number;
  reviewCount?: number;
};
