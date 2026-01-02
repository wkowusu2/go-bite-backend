import { JwtPayload } from "jsonwebtoken";

export type JwtPayloadType = JwtPayload & {
    phone: string,
    role: string,
}