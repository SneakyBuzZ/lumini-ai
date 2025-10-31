import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";
import cuid from "cuid";
import { labsTable } from "@/_lab/models/lab-table";

export const shapesTable = pgTable("shapes", {
  id: varchar("id", { length: 36 })
    .$defaultFn(() => cuid())
    .primaryKey(),

  labId: varchar("lab_id", { length: 36 })
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull(),

  // Geometry
  type: varchar("type", { length: 32 }).notNull(),
  x: doublePrecision("x").notNull(),
  y: doublePrecision("y").notNull(),
  width: doublePrecision("width").notNull(),
  height: doublePrecision("height").notNull(),
  rotation: doublePrecision("rotation").default(0),

  // Style
  strokeType: varchar("stroke_type", { length: 16 }).default("solid"),
  strokeColor: varchar("stroke_color", { length: 32 }).default("#d6d6d6"),
  fillColor: varchar("fill_color", { length: 32 }).default("#ffffff00"),
  strokeWidth: doublePrecision("stroke_width").default(0.5),
  opacity: doublePrecision("opacity").default(1),

  // Text
  text: varchar("text", { length: 256 }),
  textColor: varchar("text_color", { length: 32 }).default("#ebebeb"),
  fontSize: integer("font_size").default(16),
  fontFamily: varchar("font_family", { length: 64 }).default("sans-serif"),
  fontWeight: varchar("font_weight", { length: 32 }).default("normal"),
  textAlign: varchar("text_align", { length: 16 }).default("center"),

  // Flags
  isLocked: boolean("is_locked").default(false),
  isHidden: boolean("is_hidden").default(false),

  // Sync metadata
  version: integer("version").default(1),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // CRDT-ready field
  crdtData: jsonb("crdt_data").$type<Record<string, any>>().default({}),
});
