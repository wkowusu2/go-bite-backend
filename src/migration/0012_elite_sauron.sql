ALTER TABLE "restaurant_location" ADD COLUMN "latitude" numeric(9, 6) NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_location" ADD COLUMN "longitude" numeric(9, 6) NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_location" DROP COLUMN "location";