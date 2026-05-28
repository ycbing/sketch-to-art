import { pgTable, text, integer, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";

// =====================
// Users
// =====================
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    credits: integer("credits").default(50).notNull(),
    lastDailyBonusAt: timestamp("last_daily_bonus_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
  ]
);

// Separate passwords table for credential auth
export const userPasswords = pgTable(
  "user_passwords",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("user_passwords_email_idx").on(table.email),
  ]
);

// =====================
// Styles
// NOTE: Currently only STYLE_PRESETS (lib/styles.ts) is used at runtime.
// This table is kept for future dynamic style management but is not actively queried.
// =====================
export const styles = pgTable("styles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  icon: text("icon").notNull(),
  prompt: text("prompt").notNull(),
  previewColor: text("preview_color").notNull(),
  isBuiltIn: boolean("is_builtin").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// =====================
// Artworks
// =====================
export const artworks = pgTable(
  "artworks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    styleId: text("style_id")
      .references(() => styles.id, { onDelete: "set null" }),
    title: text("title"),
    prompt: text("prompt"),
    sketchUrl: text("sketch_url"),         // COS URL of the sketch
    resultUrl: text("result_url"),          // COS URL of the generated image
    resultUrls: text("result_urls"),        // JSON array of COS URLs (batch mode)
    isPublic: boolean("is_public").default(false).notNull(),
    likes: integer("likes").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("artworks_user_id_idx").on(table.userId),
    index("artworks_created_at_idx").on(table.createdAt),
  ]
);

// =====================
// Credits Usage Log
// =====================
export const creditsUsage = pgTable(
  "credits_usage",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),        // "generate_single", "generate_batch"
    amount: integer("amount").notNull(),      // credits consumed (positive = spent)
    artworkId: text("artwork_id")
      .references(() => artworks.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("credits_usage_user_id_idx").on(table.userId),
    index("credits_usage_created_at_idx").on(table.createdAt),
  ]
);
