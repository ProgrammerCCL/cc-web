ALTER TABLE "transaction" ALTER COLUMN "create_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "fee" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "remarks" text DEFAULT '';