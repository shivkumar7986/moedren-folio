import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { MediaItem } from "@portfolio/types";

// ─── PROJECTS TABLE ───────────────────────────────────────────────
export const projects = pgTable("projects", {
  id:           uuid("id").defaultRandom().primaryKey(),
  slug:         text("slug").notNull().unique(),
  title:        text("title").notNull(),
  client:       text("client"),
  year:         integer("year").notNull(),
  tags:         text("tags").array().notNull().default(sql`'{}'::text[]`),
  summary:      text("summary"),
  description:  text("description"),
  coverImage:   text("cover_image"),
  coverVideo:   text("cover_video"),
  images:       jsonb("images").$type<MediaItem[]>().default([]),
  featured:     boolean("featured").default(false),
  published:    boolean("published").default(false),
  order:        integer("order").default(0),
  seoTitle:     text("seo_title"),
  seoDesc:      text("seo_description"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    projectsPublishedIdx: index("projects_published_idx").on(table.published, table.order),
  };
});

// ─── BLOG POSTS TABLE ─────────────────────────────────────────────
export const posts = pgTable("posts", {
  id:           uuid("id").defaultRandom().primaryKey(),
  slug:         text("slug").notNull().unique(),
  title:        text("title").notNull(),
  excerpt:      text("excerpt"),
  content:      text("content").notNull(),
  coverImage:   text("cover_image"),
  tags:         text("tags").array().notNull().default(sql`'{}'::text[]`),
  published:    boolean("published").default(false),
  publishedAt:  timestamp("published_at"),
  seoTitle:     text("seo_title"),
  seoDesc:      text("seo_description"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    postsPublishedIdx: index("posts_published_idx").on(table.published, table.publishedAt),
  };
});

// ─── CONTACT SUBMISSIONS ──────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id:           uuid("id").defaultRandom().primaryKey(),
  name:         text("name").notNull(),
  email:        text("email").notNull(),
  message:      text("message").notNull(),
  ip:           text("ip"),
  read:         boolean("read").default(false),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

// ─── SITE SETTINGS (key/value) ────────────────────────────────────
export const settings = pgTable("settings", {
  key:   text("key").primaryKey(),
  value: jsonb("value"),
});

// Export typings
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
