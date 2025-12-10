CREATE TYPE "public"."role_enum" AS ENUM('CUSTOMER', 'ADMIN', 'VENDOR_ADMIN', 'RIDER');--> statement-breakpoint
CREATE TABLE "customer_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullname" text,
	"email" varchar(255),
	"avatar_url" text,
	"phone_number" varchar(10) NOT NULL,
	"push_token" text,
	"role" "role_enum" DEFAULT 'CUSTOMER',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "customer_profile_email_unique" UNIQUE("email"),
	CONSTRAINT "customer_profile_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "otp_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(10) NOT NULL,
	"otp" varchar(6) NOT NULL,
	CONSTRAINT "otp_table_phone_number_unique" UNIQUE("phone_number")
);
