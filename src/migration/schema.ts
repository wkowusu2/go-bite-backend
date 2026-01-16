import { pgTable, index, uniqueIndex, foreignKey, uuid, text, boolean, timestamp, unique, integer, varchar, numeric, check, jsonb, pgView, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const roleEnum = pgEnum("role_enum", ['CUSTOMER', 'ADMIN', 'VENDOR_ADMIN', 'RIDER'])


export const restaurantCredentials = pgTable("restaurant_credentials", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	email: text().notNull(),
	secretCodeHash: text("secret_code_hash").notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`).notNull(),
}, (table) => [
	index("idx_restaurant_credentials_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_restaurant_credentials_restaurant_id").using("btree", table.restaurantId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("idx_unique_active_credential").using("btree", table.restaurantId.asc().nullsLast().op("uuid_ops")).where(sql`(is_active = true)`),
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "restaurant_credentials_restaurant_id_fkey"
		}).onDelete("cascade"),
]);

export const vendorCategories = pgTable("vendor_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	name: text().notNull(),
	description: text(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_vendor_categories_restaurant_id").using("btree", table.restaurantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "vendor_categories_restaurant_id_fkey"
		}).onDelete("cascade"),
	unique("vendor_categories_restaurant_id_name_key").on(table.restaurantId, table.name),
]);

export const otpTable = pgTable("otp_table", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
	otp: varchar({ length: 6 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
	role: roleEnum().default('CUSTOMER'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastLogin: timestamp("last_login", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_phone_number_unique").on(table.phoneNumber),
]);

export const customerProfile = pgTable("customer_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullname: text(),
	email: varchar({ length: 255 }),
	avatarUrl: text("avatar_url"),
	pushToken: text("push_token"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "customer_profile_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("customer_profile_email_unique").on(table.email),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	refreshToken: text("refresh_token").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	revoked: boolean().default(false),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const riderProfiles = pgTable("rider_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullname: text(),
	email: varchar({ length: 255 }),
	avatarUrl: text("avatar_url"),
	pushToken: text("push_token"),
	approvalStatus: boolean("approval_status").default(false),
	onlineStatus: boolean("online_status").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "rider_profiles_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("rider_profiles_email_unique").on(table.email),
]);

export const riderProfile = pgTable("rider_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fullName: text("full_name"),
	email: text(),
	phoneNumber: text("phone_number"),
	vehicleType: text("vehicle_type"),
	licenseNumber: text("license_number"),
	rating: numeric({ precision: 3, scale:  2 }).default('0'),
	totalDeliveries: integer("total_deliveries").default(0),
	online: boolean().default(false),
	approvalStatus: boolean("approval_status").default(false),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_rider_profile_approval_status").using("btree", table.approvalStatus.asc().nullsLast().op("bool_ops")),
	index("idx_rider_profile_online").using("btree", table.online.asc().nullsLast().op("bool_ops")),
]);

export const restaurants = pgTable("restaurants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	isOpen: boolean().default(false),
	logoUrl: text("logo_url"),
	rating: numeric({ precision: 2, scale:  1 }).default('0.00'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	owner: uuid(),
	email: text(),
	phone: text(),
	vendorId: uuid("vendor_id"),
	image: text(),
	isActive: boolean("is_active").default(true),
	password: text(),
}, (table) => [
	index("idx_restaurants_password").using("btree", table.password.asc().nullsLast().op("text_ops")),
	unique("restaurants_name_unique").on(table.name),
]);

export const spatialRefSys = pgTable("spatial_ref_sys", {
	srid: integer().notNull(),
	authName: varchar("auth_name", { length: 256 }),
	authSrid: integer("auth_srid"),
	srtext: varchar({ length: 2048 }),
	proj4Text: varchar({ length: 2048 }),
}, (table) => [
	check("spatial_ref_sys_srid_check", sql`(srid > 0) AND (srid <= 998999)`),
]);

export const menuItems = pgTable("menu_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	price: numeric({ precision: 10, scale:  2 }),
	restaurantId: uuid("restaurant_id").notNull(),
	menuCategoryId: uuid("menu_category_id").notNull(),
	isAvailable: boolean("is_available").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	category: text(),
	imageUrl: text("image_url"),
	isPopular: boolean("is_popular").default(false),
	customizationOptions: jsonb("customization_options").default([]),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_menu_items_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_menu_items_restaurant_id").using("btree", table.restaurantId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "menu_items_restaurant_id_restaurants_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.menuCategoryId],
			foreignColumns: [menuCategories.id],
			name: "menu_items_menu_category_id_menu_categories_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	customerId: uuid("customer_id").notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	restaurantLocationId: uuid("restaurant_location_id").notNull(),
	status: text().notNull(),
	deliveryCity: text("delivery_city").notNull(),
	// TODO: failed to parse database type 'geography'
	deliveryLocation: unknown("delivery_location").notNull(),
	subtotal: numeric({ precision: 10, scale:  2 }).notNull(),
	deliveryFee: numeric("delivery_fee", { precision: 10, scale:  2 }),
	total: numeric({ precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	cancelledAt: timestamp("cancelled_at", { mode: 'string' }),
	deliveredAt: timestamp("delivered_at", { mode: 'string' }),
	orderNumber: text("order_number"),
	userId: uuid("user_id"),
	userName: text("user_name"),
	userEmail: text("user_email"),
	userPhone: text("user_phone"),
	deliveryAddress: text("delivery_address"),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }),
	prepTime: integer("prep_time"),
	orderAcceptedByRider: boolean("order_accepted_by_rider").default(false),
	riderId: uuid("rider_id"),
	assignedToRiderAt: timestamp("assigned_to_rider_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_orders_rider_id").using("btree", table.riderId.asc().nullsLast().op("uuid_ops")),
	index("idx_orders_rider_status").using("btree", table.riderId.asc().nullsLast().op("text_ops"), table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [users.id],
			name: "orders_customer_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "orders_restaurant_id_restaurants_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.restaurantLocationId],
			foreignColumns: [restaurantLocation.id],
			name: "orders_restaurant_location_id_restaurant_location_id_fk"
		}).onDelete("restrict"),
]);

export const menuCategories = pgTable("menu_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	orderIndex: integer("order_index").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "menu_categories_restaurant_id_restaurants_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const restaurantLocation = pgTable("restaurant_location", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	restaurantId: uuid("restaurant_id").notNull(),
	// TODO: failed to parse database type 'geography'
	location: unknown("location").notNull(),
	city: text(),
}, (table) => [
	index("idx_restaurant_location").using("gist", table.location.asc().nullsLast().op("gist_geography_ops")),
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "restaurant_location_restaurant_id_restaurants_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const orderItems = pgTable("order_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	menuItemId: uuid("menuItem_id").notNull(),
	nameSnaphot: text("name_snaphot"),
	priceSnapshot: numeric("price_snapshot", { precision: 10, scale:  2 }),
	quantity: integer().notNull(),
	orderId: uuid("order_id"),
	menuItemId: uuid("menu_item_id"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [orders.id],
			name: "order_items_user_id_orders_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.menuItemId],
			foreignColumns: [menuItems.id],
			name: "order_items_menuItem_id_menu_items_id_fk"
		}).onDelete("restrict"),
]);

export const isUserGuest = pgTable("is_user_guest", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	isGuest: boolean("is_guest").default(false),
	createAt: timestamp("create_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "is_user_guest_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("is_user_guest_user_id_unique").on(table.userId),
]);

export const orderStatusHistory = pgTable("order_status_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	status: text().notNull(),
	changedByUserId: uuid("changed_by_user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_status_history_order_id_orders_id_fk"
		}),
	foreignKey({
			columns: [table.changedByUserId],
			foreignColumns: [users.id],
			name: "order_status_history_changed_by_user_id_users_id_fk"
		}),
]);
export const ordersWithRiderInfo = pgView("orders_with_rider_info", {	id: uuid(),
	userId: uuid("user_id"),
	restaurantId: uuid("restaurant_id"),
	status: text(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }),
	deliveryAddress: text("delivery_address"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	riderId: uuid("rider_id"),
	assignedToRiderAt: timestamp("assigned_to_rider_at", { withTimezone: true, mode: 'string' }),
	customerName: text("customer_name"),
	riderName: text("rider_name"),
}).as(sql`SELECT o.id, o.user_id, o.restaurant_id, o.status, o.total_amount, o.delivery_address, o.created_at, o.rider_id, o.assigned_to_rider_at, NULL::text AS customer_name, rp.full_name AS rider_name FROM orders o LEFT JOIN rider_profile rp ON o.rider_id = rp.id`);

export const geographyColumns = pgView("geography_columns", {	// TODO: failed to parse database type 'name'
	fTableCatalog: unknown("f_table_catalog"),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: unknown("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeographyColumn: unknown("f_geography_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: text(),
}).as(sql`SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);

export const geometryColumns = pgView("geometry_columns", {	fTableCatalog: varchar("f_table_catalog", { length: 256 }),
	// TODO: failed to parse database type 'name'
	fTableSchema: unknown("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: unknown("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeometryColumn: unknown("f_geometry_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: varchar({ length: 30 }),
}).as(sql`SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ''''::text, 2), ')'::text, ''::text) AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%geometrytype(% = %'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text)::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%ndims(% = %'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, replace(replace(split_part(s.consrc, ' = '::text, 2), ')'::text, ''::text), '('::text, ''::text)::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~~* '%srid(% = %'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);