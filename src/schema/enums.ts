import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role_enum',['CUSTOMER', 'ADMIN', 'VENDOR_ADMIN', 'RIDER']);