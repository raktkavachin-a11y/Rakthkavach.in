import { createInsertSchema } from "drizzle-zod";
import {
  integer,
  jsonb,
  text,
  timestamp,
  uuid,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const facilitiesTable = pgTable("facilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const donorsTable = pgTable("donors", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorCode: text("donor_code").notNull().unique(),
  fullName: text("full_name").notNull(),
  bloodGroup: text("blood_group").notNull(),
  city: text("city").notNull(),
  phoneLast4: text("phone_last4"),
  eligibilityStatus: text("eligibility_status").notNull().default("unknown"),
  lastDonationAt: timestamp("last_donation_at", { withTimezone: true }),
  nextEligibleAt: timestamp("next_eligible_at", { withTimezone: true }),
  rewardTier: text("reward_tier"),
  bloodCredits: integer("blood_credits").notNull().default(0),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const donationHistoryTable = pgTable("donation_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorId: uuid("donor_id").notNull().references(() => donorsTable.id),
  donatedAt: timestamp("donated_at", { withTimezone: true }).notNull(),
  facilityName: text("facility_name").notNull(),
  units: integer("units").notNull(),
  bloodGroup: text("blood_group").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bloodUnitsTable = pgTable("blood_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  unitCode: text("unit_code").notNull().unique(),
  bloodGroup: text("blood_group").notNull(),
  component: text("component").notNull(),
  status: text("status").notNull().default("available"),
  facilityId: uuid("facility_id").notNull().references(() => facilitiesTable.id),
  collectedAt: timestamp("collected_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  verified: boolean("verified").notNull().default(false),
  qrToken: text("qr_token").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bloodRequestsTable = pgTable("blood_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestCode: text("request_code").notNull().unique(),
  bloodGroup: text("blood_group").notNull(),
  component: text("component").notNull(),
  units: integer("units").notNull(),
  urgency: text("urgency").notNull(),
  status: text("status").notNull().default("open"),
  facilityId: uuid("facility_id").notNull().references(() => facilitiesTable.id),
  patientReference: text("patient_reference"),
  neededBy: timestamp("needed_by", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const emergenciesTable = pgTable("emergencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseCode: text("case_code").notNull().unique(),
  bloodGroup: text("blood_group").notNull(),
  units: integer("units").notNull(),
  urgency: text("urgency").notNull(),
  status: text("status").notNull().default("active"),
  city: text("city").notNull(),
  hospitalName: text("hospital_name"),
  coordinatorPhoneLast4: text("coordinator_phone_last4"),
  responseEtaMinutes: integer("response_eta_minutes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: text("action").notNull(),
  actorType: text("actor_type").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFacilitySchema = createInsertSchema(facilitiesTable).omit({ id: true, createdAt: true });
export const insertDonorSchema = createInsertSchema(donorsTable).omit({ id: true, createdAt: true });
export const insertDonationHistorySchema = createInsertSchema(donationHistoryTable).omit({ id: true, createdAt: true });
export const insertBloodUnitSchema = createInsertSchema(bloodUnitsTable).omit({ id: true, createdAt: true });
export const insertBloodRequestSchema = createInsertSchema(bloodRequestsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmergencySchema = createInsertSchema(emergenciesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({ id: true, occurredAt: true });

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilitiesTable.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = typeof donorsTable.$inferSelect;
export type BloodUnit = typeof bloodUnitsTable.$inferSelect;
export type BloodRequest = typeof bloodRequestsTable.$inferSelect;
export type Emergency = typeof emergenciesTable.$inferSelect;