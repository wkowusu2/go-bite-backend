import { relations } from "drizzle-orm/relations";
import { restaurants, restaurantCredentials, vendorCategories, users, customerProfile, refreshTokens, riderProfiles, menuItems, menuCategories, orders, restaurantLocation, orderItems, isUserGuest, orderStatusHistory } from "./schema";

export const restaurantCredentialsRelations = relations(restaurantCredentials, ({one}) => ({
	restaurant: one(restaurants, {
		fields: [restaurantCredentials.restaurantId],
		references: [restaurants.id]
	}),
}));

export const restaurantsRelations = relations(restaurants, ({many}) => ({
	restaurantCredentials: many(restaurantCredentials),
	vendorCategories: many(vendorCategories),
	menuItems: many(menuItems),
	orders: many(orders),
	menuCategories: many(menuCategories),
	restaurantLocations: many(restaurantLocation),
}));

export const vendorCategoriesRelations = relations(vendorCategories, ({one}) => ({
	restaurant: one(restaurants, {
		fields: [vendorCategories.restaurantId],
		references: [restaurants.id]
	}),
}));

export const customerProfileRelations = relations(customerProfile, ({one}) => ({
	user: one(users, {
		fields: [customerProfile.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	customerProfiles: many(customerProfile),
	refreshTokens: many(refreshTokens),
	riderProfiles: many(riderProfiles),
	orders: many(orders),
	isUserGuests: many(isUserGuest),
	orderStatusHistories: many(orderStatusHistory),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one}) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));

export const riderProfilesRelations = relations(riderProfiles, ({one}) => ({
	user: one(users, {
		fields: [riderProfiles.userId],
		references: [users.id]
	}),
}));

export const menuItemsRelations = relations(menuItems, ({one, many}) => ({
	restaurant: one(restaurants, {
		fields: [menuItems.restaurantId],
		references: [restaurants.id]
	}),
	menuCategory: one(menuCategories, {
		fields: [menuItems.menuCategoryId],
		references: [menuCategories.id]
	}),
	orderItems: many(orderItems),
}));

export const menuCategoriesRelations = relations(menuCategories, ({one, many}) => ({
	menuItems: many(menuItems),
	restaurant: one(restaurants, {
		fields: [menuCategories.restaurantId],
		references: [restaurants.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.customerId],
		references: [users.id]
	}),
	restaurant: one(restaurants, {
		fields: [orders.restaurantId],
		references: [restaurants.id]
	}),
	restaurantLocation: one(restaurantLocation, {
		fields: [orders.restaurantLocationId],
		references: [restaurantLocation.id]
	}),
	orderItems: many(orderItems),
	orderStatusHistories: many(orderStatusHistory),
}));

export const restaurantLocationRelations = relations(restaurantLocation, ({one, many}) => ({
	orders: many(orders),
	restaurant: one(restaurants, {
		fields: [restaurantLocation.restaurantId],
		references: [restaurants.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.userId],
		references: [orders.id]
	}),
	menuItem: one(menuItems, {
		fields: [orderItems.menuItemId],
		references: [menuItems.id]
	}),
}));

export const isUserGuestRelations = relations(isUserGuest, ({one}) => ({
	user: one(users, {
		fields: [isUserGuest.userId],
		references: [users.id]
	}),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({one}) => ({
	order: one(orders, {
		fields: [orderStatusHistory.orderId],
		references: [orders.id]
	}),
	user: one(users, {
		fields: [orderStatusHistory.changedByUserId],
		references: [users.id]
	}),
}));