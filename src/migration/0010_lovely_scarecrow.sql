ALTER TABLE "customer_profile" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "menu_categories" RENAME COLUMN "restaurantId" TO "restaurant_id";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "orderId" TO "user_id";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "menuItemId" TO "menuItem_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "customerId" TO "customer_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "restaurantId" TO "restaurant_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "restaurantLocationId" TO "restaurant_location_id";--> statement-breakpoint
ALTER TABLE "restaurants" RENAME COLUMN "image" TO "logo_url";--> statement-breakpoint
ALTER TABLE "rider_profiles" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "customer_profile" DROP CONSTRAINT "customer_profile_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "menu_categories" DROP CONSTRAINT "menu_categories_restaurantId_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_menuItemId_menu_items_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_restaurantId_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_restaurantLocationId_restaurant_location_id_fk";
--> statement-breakpoint
ALTER TABLE "rider_profiles" DROP CONSTRAINT "rider_profiles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "rating" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "customer_profile" ADD CONSTRAINT "customer_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_user_id_orders_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menuItem_id_menu_items_id_fk" FOREIGN KEY ("menuItem_id") REFERENCES "public"."menu_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_location_id_restaurant_location_id_fk" FOREIGN KEY ("restaurant_location_id") REFERENCES "public"."restaurant_location"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rider_profiles" ADD CONSTRAINT "rider_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;