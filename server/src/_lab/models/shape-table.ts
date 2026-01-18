import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import cuid from "cuid";
import { labsTable } from "@/_lab/models/lab-table";
import { usersTable } from "@/_user/models/user-model";

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
  rotation: doublePrecision("rotation").default(0).notNull(),

  // Style
  strokeType: varchar("stroke_type", { length: 16 }).default("solid").notNull(),
  strokeColor: varchar("stroke_color", { length: 32 })
    .default("#d6d6d6")
    .notNull(),
  fillColor: varchar("fill_color", { length: 32 })
    .default("#ffffff00")
    .notNull(),
  strokeWidth: doublePrecision("stroke_width").default(0.5).notNull(),
  opacity: doublePrecision("opacity").default(1).notNull(),
  // Text
  text: varchar("text", { length: 256 }).default("").notNull(),
  textColor: varchar("text_color", { length: 32 }).default("#ebebeb").notNull(),
  fontSize: integer("font_size").default(16).notNull(),
  fontFamily: varchar("font_family", { length: 64 })
    .default("sans-serif")
    .notNull(),
  fontWeight: varchar("font_weight", { length: 32 })
    .default("normal")
    .notNull(),
  textAlign: varchar("text_align", { length: 16 }).default("center").notNull(),

  // Layering
  zIndex: integer("z_index").default(0).notNull(),

  // Flags
  isLocked: boolean("is_locked").default(false).notNull(),
  isHidden: boolean("is_hidden").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),

  // Sync metadata
  version: integer("version").default(1).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const snapshotsTable = pgTable("shape_snapshots", {
  labId: varchar("lab_id", { length: 36 })
    .references(() => labsTable.id, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),

  data: jsonb("data").notNull().$type<{ shapes: Record<string, any> }>(),

  version: integer("version").notNull().default(1),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const viewTable = pgTable(
  "views",
  {
    labId: varchar("lab_id", { length: 36 })
      .references(() => labsTable.id, { onDelete: "cascade" })
      .notNull(),

    userId: varchar("user_id", { length: 36 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),

    scale: doublePrecision("scale").notNull().default(1),
    offsetX: doublePrecision("offset_x").notNull().default(0),
    offsetY: doublePrecision("offset_y").notNull().default(0),

    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.labId, table.userId] }),
  }),
);
