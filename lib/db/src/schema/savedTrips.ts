import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedTripsTable = pgTable("saved_trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originId: text("origin_id").notNull(),
  destinationId: text("destination_id").notNull(),
  originName: text("origin_name").notNull(),
  destinationName: text("destination_name").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const insertSavedTripSchema = createInsertSchema(savedTripsTable).omit({ id: true, savedAt: true });
export type InsertSavedTrip = z.infer<typeof insertSavedTripSchema>;
export type SavedTrip = typeof savedTripsTable.$inferSelect;
