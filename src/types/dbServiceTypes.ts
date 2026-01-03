import { InferInsertModel } from "drizzle-orm"
import { refreshToken } from "../schema/refreshToken.js"

export type CreateUserType = {
    userId: string,
    fullName: string,
    email: string
}

export type refreshTokenDetailType = InferInsertModel<typeof refreshToken>

export type ProfileType = {
    fullName?: string, 
    email?: string,
    avatarUrl?: string,
    pushToken?: string,
    userId: string
}