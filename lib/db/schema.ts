import {
  pgTable,
  text,
  boolean,
  integer,
  numeric,
  date,
  timestamp,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  asOfDate: date("as_of_date"),
  licenseNote: text("license_note"),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }),
});

export const municipalities = pgTable("municipalities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  geoid: text("geoid"),
  isOrganized: boolean("is_organized").notNull().default(true),
  // geom: geometry handled via raw SQL in Phase B
  sourceId: text("source_id").references(() => sources.id),
});

export const places = pgTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameNormalized: text("name_normalized").notNull(),
  placeType: text("place_type").notNull(), // municipality | water | populated_place | landmark
  municipalityId: text("municipality_id").references(() => municipalities.id),
  rank: integer("rank").notNull().default(0),
  sourceId: text("source_id").references(() => sources.id),
});

export const parcels = pgTable("parcels", {
  id: text("id").primaryKey(),
  sourceParcelId: text("source_parcel_id"),
  municipalityId: text("municipality_id").references(() => municipalities.id),
  ownerName: text("owner_name"),
  ownerNameNormalized: text("owner_name_normalized"),
  situsAddress: text("situs_address"),
  mailAddress: text("mail_address"),
  assessedLandValue: numeric("assessed_land_value"),
  assessedBuildingValue: numeric("assessed_building_value"),
  assessedTotalValue: numeric("assessed_total_value"),
  taxYear: integer("tax_year"),
  acreage: numeric("acreage"),
  landUse: text("land_use"),
  sourceId: text("source_id").references(() => sources.id),
  attrsRaw: jsonb("attrs_raw"),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const coverage = pgTable("coverage", {
  municipalityId: text("municipality_id")
    .primaryKey()
    .references(() => municipalities.id),
  hasParcelGeometry: boolean("has_parcel_geometry").notNull().default(false),
  hasOwnership: boolean("has_ownership").notNull().default(false),
  hasTaxAssessment: boolean("has_tax_assessment").notNull().default(false),
  parcelCount: integer("parcel_count").notNull().default(0),
  taxParseRate: real("tax_parse_rate"),
  notes: text("notes"),
  sourceId: text("source_id").references(() => sources.id),
});

export const taxIngestBatches = pgTable("tax_ingest_batches", {
  id: text("id").primaryKey(),
  territoryType: text("territory_type").notNull(), // ut | organized
  municipalityId: text("municipality_id").references(() => municipalities.id),
  sourceId: text("source_id").references(() => sources.id),
  parserId: text("parser_id").notNull(),
  asOfDate: date("as_of_date"),
  filePaths: jsonb("file_paths"),
  stats: jsonb("stats"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const taxRecords = pgTable("tax_records", {
  id: text("id").primaryKey(),
  batchId: text("batch_id")
    .notNull()
    .references(() => taxIngestBatches.id),
  externalKey: text("external_key"),
  ownerName: text("owner_name"),
  mapLot: text("map_lot"),
  situsAddress: text("situs_address"),
  assessedLandValue: numeric("assessed_land_value"),
  assessedBuildingValue: numeric("assessed_building_value"),
  assessedTotalValue: numeric("assessed_total_value"),
  taxYear: integer("tax_year"),
  attrsRaw: jsonb("attrs_raw"),
  parseConfidence: real("parse_confidence"),
  geomParcelId: text("geom_parcel_id").references(() => parcels.id),
});
