import { pgTable, text, uuid, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    parentId: uuid("parent_id"),
  },
  (t) => [
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("set null"),
  ]
);

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().optional().nullable(),
});
export const selectCategorySchema = insertCategorySchema.extend({
  id: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "Invalid UUID format"
    ),
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = z.infer<typeof selectCategorySchema>;
