CREATE TABLE "rider_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullname" text,
	"email" varchar(255),
	"avatar_url" text,
	"push_token" text,
	"approval_status" boolean DEFAULT false,
	"online_status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"userId" uuid NOT NULL,
	CONSTRAINT "rider_profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "rider_profiles" ADD CONSTRAINT "rider_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;