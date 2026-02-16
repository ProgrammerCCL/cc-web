ALTER TABLE "transaction" ADD COLUMN "http_status" integer;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "is_error" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "erp_messege" text;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "erp_detail" text;