CREATE TABLE "menu_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"restaurantId" uuid NOT NULL,
	"order_index" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2),
	"restaurant_id" uuid NOT NULL,
	"menu_category_id" uuid NOT NULL,
	"is_available" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"menuItemId" uuid NOT NULL,
	"name_snaphot" text,
	"price_snapshot" numeric(10, 2),
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" text NOT NULL,
	"changed_by_user_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customerId" uuid NOT NULL,
	"restaurantId" uuid NOT NULL,
	"restaurantLocationId" uuid NOT NULL,
	"status" text NOT NULL,
	"delivery_city" text NOT NULL,
	"delivery_location" "geography(Point, 4326)" NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"delivery_fee" numeric(10, 2),
	"total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"cancelled_at" timestamp,
	"delivered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "restaurant_location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"location" "geography(Point, 4326)" NOT NULL,
	"city" text
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"isOpen" boolean DEFAULT false,
	"image" text,
	"rating" numeric(2, 1),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "restaurants_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_category_id_menu_categories_id_fk" FOREIGN KEY ("menu_category_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menuItemId_menu_items_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "public"."menu_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_users_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_restaurants_id_fk" FOREIGN KEY ("restaurantId") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantLocationId_restaurant_location_id_fk" FOREIGN KEY ("restaurantLocationId") REFERENCES "public"."restaurant_location"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_location" ADD CONSTRAINT "restaurant_location_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE cascade;