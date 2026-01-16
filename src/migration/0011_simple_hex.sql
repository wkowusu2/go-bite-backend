ALTER TABLE "restaurants" ADD COLUMN "owner" uuid;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "phone" varchar(10);--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "vendor_id" uuid;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "is_active" boolean DEFAULT false;