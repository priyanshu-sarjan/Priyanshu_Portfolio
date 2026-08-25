import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const skillCategoryEnum = pgEnum("skill_category", ["language", "web", "web3", "dsa", "other"]);
export const competitionTypeEnum = pgEnum("competition_type", ["competition", "workshop", "hackathon", "seminar"]);
export const eventTypeEnum = pgEnum("event_type", ["meetup", "deadline", "task", "workshop", "other"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experiencesTable = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").default("Present"),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull().default([]),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assetsTable = pgTable("assets", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const statusTable = pgTable("status", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull().default([]),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date").notNull(),
  credentialUrl: text("credential_url"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: skillCategoryEnum("category").notNull(),
  proficiency: integer("proficiency").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const competitionsTable = pgTable("competitions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organizer: text("organizer").notNull(),
  type: competitionTypeEnum("type").notNull(),
  date: text("date").notNull(),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  type: eventTypeEnum("type").notNull(),
  completed: boolean("completed").notNull().default(false),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  eventName: text("event_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const insertExperienceSchema = createInsertSchema(experiencesTable).omit({ id: true, createdAt: true });
export const insertAssetSchema = createInsertSchema(assetsTable).omit({ id: true, createdAt: true });
export const insertStatusSchema = createInsertSchema(statusTable).omit({ id: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export const insertCertificationSchema = createInsertSchema(certificationsTable).omit({ id: true, createdAt: true });
export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true, createdAt: true });
export const insertCompetitionSchema = createInsertSchema(competitionsTable).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true });
export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, createdAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Experience = typeof experiencesTable.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Asset = typeof assetsTable.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Status = typeof statusTable.$inferSelect;
export type InsertStatus = z.infer<typeof insertStatusSchema>;
export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Certification = typeof certificationsTable.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Skill = typeof skillsTable.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Competition = typeof competitionsTable.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;
export type Event = typeof eventsTable.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type GalleryImage = typeof galleryTable.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGallerySchema>;

