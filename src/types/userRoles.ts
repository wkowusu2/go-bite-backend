import { roleEnum } from "../schema/enums.js";

export type UserRole = typeof roleEnum.enumValues[number];