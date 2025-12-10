CREATE TABLE "contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_html" text NOT NULL,
	"content_json" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
