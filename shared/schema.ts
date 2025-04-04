import { pgTable, text, serial, integer, boolean, real, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  phoneNumber: text("phone_number").notNull(),
  role: text("role").notNull().default("farmer"), // farmer or buyer
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  location: true,
  phoneNumber: true,
  role: true,
});

// Crop types
export const cropTypes = pgTable("crop_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const insertCropTypeSchema = createInsertSchema(cropTypes).pick({
  name: true,
});

// Crop listings
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cropTypeId: integer("crop_type_id").notNull(),
  quantity: real("quantity").notNull(),
  price: real("price").notNull(),
  quality: text("quality").notNull(), // A, B, C
  description: text("description").notNull(),
  location: text("location").notNull(),
  harvestedDate: timestamp("harvested_date").notNull(),
  deliveryAvailable: boolean("delivery_available").notNull().default(false),
  deliveryRadius: integer("delivery_radius"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  imageUrl: text("image_url"),
});

export const insertListingSchema = createInsertSchema(listings)
  .omit({ id: true, createdAt: true })
  .extend({
    cropTypeName: z.string().optional(),
    // Transform the harvestedDate string to a proper date
    harvestedDate: z.string().transform(val => {
      try {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date");
        }
        return date;
      } catch (e) {
        throw new Error("Invalid date format");
      }
    }),
  });

// Bids on listings
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
});

export const insertBidSchema = createInsertSchema(bids)
  .omit({ id: true, createdAt: true, status: true });

// Barter offers
export const barterOffers = pgTable("barter_offers", {
  id: serial("id").primaryKey(),
  offerUserId: integer("offer_user_id").notNull(), // user offering the exchange
  receiverUserId: integer("receiver_user_id").notNull(), // user receiving the offer
  offerCropTypeId: integer("offer_crop_type_id").notNull(),
  offerQuantity: real("offer_quantity").notNull(),
  receiverCropTypeId: integer("receiver_crop_type_id").notNull(),
  receiverQuantity: real("receiver_quantity").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBarterOfferSchema = createInsertSchema(barterOffers)
  .omit({ id: true, createdAt: true, status: true });

// Price history for AI predictions
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  cropTypeId: integer("crop_type_id").notNull(),
  location: text("location").notNull(),
  price: real("price").notNull(),
  quality: text("quality").notNull(), // A, B, C
  recordedDate: timestamp("recorded_date").notNull().defaultNow(),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory)
  .omit({ id: true, recordedDate: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CropType = typeof cropTypes.$inferSelect;
export type InsertCropType = z.infer<typeof insertCropTypeSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type BarterOffer = typeof barterOffers.$inferSelect;
export type InsertBarterOffer = z.infer<typeof insertBarterOfferSchema>;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
