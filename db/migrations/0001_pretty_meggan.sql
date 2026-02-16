DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('wip', 'finish', 'cancel', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."trans_type" AS ENUM('sale', 'refill', 'dispense', 'exchange', 'endofday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_name" text NOT NULL,
	"trans_type" "trans_type" NOT NULL,
	"cash_in" json NOT NULL,
	"cash_out" json NOT NULL,
	"status" "status" NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"create_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_ci" (
	"id" serial PRIMARY KEY NOT NULL,
	"trans_id" text,
	"ci_trans_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_user" ALTER COLUMN "username" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "app_user" ALTER COLUMN "pin" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "app_user" ADD COLUMN "permission" json DEFAULT '[]'::json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_app_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."app_user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_ci" ADD CONSTRAINT "transaction_ci_trans_id_transaction_id_fk" FOREIGN KEY ("trans_id") REFERENCES "public"."transaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
