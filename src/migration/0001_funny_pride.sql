CREATE TABLE "refresh_toke" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_used_at" timestamp,
	"revoked" boolean DEFAULT false,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" varchar(10) NOT NULL,
	"role" "role_enum" DEFAULT 'CUSTOMER',
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp DEFAULT now(),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "customer_profile" DROP CONSTRAINT "customer_profile_phone_number_unique";--> statement-breakpoint
ALTER TABLE "customer_profile" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_toke" ADD CONSTRAINT "refresh_toke_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer_profile" ADD CONSTRAINT "customer_profile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "customer_profile" DROP COLUMN "phone_number";--> statement-breakpoint
ALTER TABLE "customer_profile" DROP COLUMN "role";