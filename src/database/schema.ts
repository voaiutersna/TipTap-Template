// db/schema.ts
import { pgTable, text, timestamp, serial, jsonb } from "drizzle-orm/pg-core"

export const contents = pgTable("contents", {
    id: serial("id").primaryKey(),
    contentHtml: text("content_html").notNull(),
    contentJson: text("content_json").notNull(),
    contentJsonb: jsonb("content_jsonb"),
    createdAt: timestamp("created_at").defaultNow()
})