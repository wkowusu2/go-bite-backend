import { eq } from 'drizzle-orm';
import {getDb} from '../config/db.config.js';
import {otpTable} from '../schema/otp.js'
import { customerProfileTable } from '../schema/customerProfile.js';
import { refreshToken } from '../schema/refreshToken.js';
import { users } from '../schema/users.js';

const db = getDb(); 
export async function saveOtp(phone, otp){
    try {
        const [savedOtp] = await db.insert(otpTable).values({phoneNumber: phone, otp: otp}).returning(); 
        if(!savedOtp) throw new Error("Otp was not saved"); 
        return {success: true, error: null}
    } catch (error) {
        console.log("Error when saving the token: ", error)
        return {success: false, error: error.message}
    }
}

export async function getOtp(phone) {
    try {
        const [row] = await db.select().from(otpTable).where(eq(otpTable.phoneNumber, phone)); 
        if(!row) throw new Error("Otp not found");
        return {success: true, error: null, savedOtp: row}
    } catch (error) {
        console.log("Error from retriving otp: ", error);
        return {success: false, error: error.message}
    }
}

export async function deleteOtp(phone) {
    try{
        await db.delete(otpTable).where(eq(otpTable.phoneNumber, phone));
        return {success_delete: true, error_delete: null}
    } catch(error){
        console.log("Error fromm delete otp");
        return {success_delete: false, error_delete: error.message}
    }
}

export async function createCustomerProfile(phone) {
    try {
        const [savedCustomer] = await db.insert(customerProfileTable).values({phoneNumber: phone}).returning();
        if(!savedCustomer) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedCustomer}
    } catch (error) {
        console.log("Error from createProfile: ", error)
        return {success: false, error: error.message}
    }
}

export async function createUser(phone) {
    try {
        const [savedUser] = await db.insert(users).values({phone: phone}).returning();
        if(!savedUser) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedUser}
    } catch (error) {
        console.log("Error from createProfile: ", error)
        return {success: false, error: error.message}
    }
}

export async function getUserByPhone(phone) {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.phone, phone))
        return {_success: true, _error: null, user: existingUser}
    } catch (error) {
        console.log("error from getUserFrom Phone:",error)
        return {_success: false, _error: error.message, user: null}
    }
}

export async function insertRefreshToken(refreshTokenDetail) {
    try {
        const [refresh] = await db.insert(refreshToken).values({userId: refreshTokenDetail.userId, refreshToken:refreshTokenDetail.refreshToken, expiresAt: refreshTokenDetail.refreshExpiry }).returning();
        if(!refresh) throw new Error('Token not added');
        return {success: true, error: null}
    } catch (error) {
        console.log("Error from inserting the refresh token: ", error)
        return {success: false, error: error.message}
    }
}

export async function getRefreshToken(userId, incomingrefreshToken) {
    try {
        const [savedRefresh] = await db.select().from(refreshToken).where( eq(refreshToken.refreshToken, incomingrefreshToken));

        if(!savedRefresh) throw new Error("Token not found");
        return {success: true, error: null, data: savedRefresh}
    } catch (error) {
        console.log("Error from refreshing the token: ", error)
        return {success: false, error: error.message}
    } 
}

export async function revokeToken(tokenToBeRevoke) {
    try {
        const [savedToken] = await db.update(refreshToken).set({lastUsedAt: new Date(), revoked: true}).where(eq(refreshToken.refreshToken, tokenToBeRevoke)).returning()
        if(!savedToken) throw new Error("Revoking token failed");
        return {success: true, error: null};
    } catch (error) {
        console.log("Error from revoking token: ", error);
        return {success: false, error: error.message};
    }
    
}

