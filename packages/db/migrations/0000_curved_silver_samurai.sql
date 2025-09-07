CREATE TABLE IF NOT EXISTS "earthquakes" (
	"id" serial PRIMARY KEY NOT NULL,
	"usgs_id" text NOT NULL,
	"title" text NOT NULL,
	"magnitude" real NOT NULL,
	"place" text,
	"time" timestamp with time zone NOT NULL,
	"updated" timestamp with time zone,
	"url" text,
	"detail" text,
	"felt" real,
	"cdi" real,
	"mmi" real,
	"alert" text,
	"status" text,
	"tsunami" real,
	"sig" real,
	"net" text,
	"code" text,
	"ids" text,
	"sources" text,
	"types" text,
	"nst" real,
	"dmin" real,
	"rms" real,
	"gap" real,
	"mag_type" text,
	"type" text,
	"longitude" real NOT NULL,
	"latitude" real NOT NULL,
	"properties" jsonb,
	"geometry" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "earthquakes_usgs_id_unique" UNIQUE("usgs_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usgs_id_idx" ON "earthquakes" ("usgs_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "magnitude_idx" ON "earthquakes" ("magnitude");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "time_idx" ON "earthquakes" ("time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_idx" ON "earthquakes" ("longitude","latitude");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "magnitude_time_idx" ON "earthquakes" ("magnitude","time");