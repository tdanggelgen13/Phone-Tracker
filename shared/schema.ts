import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Phone location schema for our application
export const phoneLocations = pgTable("phone_locations", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  carrier: text("carrier"),
  timezone: text("timezone"),
  lookupTime: text("lookup_time"),
  formattedAddress: text("formatted_address"), // Alamat lengkap yang diformat
});

export const insertPhoneLocationSchema = createInsertSchema(phoneLocations).pick({
  phoneNumber: true,
  city: true,
  region: true,
  country: true,
  latitude: true,
  longitude: true,
  carrier: true,
  timezone: true,
  lookupTime: true,
  formattedAddress: true,
});

export const phoneLocationRequestSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type InsertPhoneLocation = z.infer<typeof insertPhoneLocationSchema>;
export type PhoneLocation = typeof phoneLocations.$inferSelect;
export type PhoneLocationRequest = z.infer<typeof phoneLocationRequestSchema>;
