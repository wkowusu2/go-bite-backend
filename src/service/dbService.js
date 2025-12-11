import { and, eq } from 'drizzle-orm';
import {getDb} from '../config/db.config.js';
import {otpTable} from '../schema/otp.js'
import { customerProfileTable } from '../schema/customerProfile.js';
import { refreshToken } from '../schema/refreshToken.js';
import { users } from '../schema/users.js';
import { riderProfiles } from '../schema/riderProfile.js';

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

export async function getOtp(phone, otp) {
    try {
        const [row] = await db.select().from(otpTable).where(and(eq(otpTable.phoneNumber, phone), eq(otpTable.otp, otp))); 
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

export async function createCustomerProfile(profileDetail) {
    try {
        const [savedCustomer] = await db.insert(customerProfileTable).values({userId: profileDetail.userId, fullName: profileDetail.fullName, email: profileDetail.email}).returning();
        if(!savedCustomer) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedCustomer}
    } catch (error) {
        console.log("Error from createProfile: ", error)
        return {success: false, error: error.message}
    }
}

export async function createRiderProfiles(profileDetail) {
    try {
        const [savedRider] = await db.insert(riderProfiles).values({userId: profileDetail.userId, fullName: profileDetail.fullName, email: profileDetail.email}).returning();
        if(!savedRider) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedRider}
    } catch (error) {
        console.log("Error from create rider Profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function createUser(phone, role) {
    try {
        const [savedUser] = await db.insert(users).values({phone: phone, role: role}).returning();
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

export async function findCustomerProfileWithId(userId) {
    try {
        const [savedProfile] = (await db.select().from(customerProfileTable).where(eq(customerProfileTable.userId, userId)));
    
        if(!savedProfile) throw new Error("Profile does not exit");
        return {success: true, error: null, data: savedProfile};
    } catch (error) {
        console.log("Error from find profile");
        return {success: false, error: error.message};
    }
}

export async function findRiderProfileWithId(userId) {
    try {
        const [savedProfile] = (await db.select().from(riderProfiles).where(eq(riderProfiles.userId, userId)));
    
        if(!savedProfile) throw new Error("Profile does not exit");
        return {success: true, error: null, data: savedProfile};
    } catch (error) {
        console.log("Error from find profile");
        return {success: false, error: error.message};
    }
}

export async function updateCustomerProfile(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({fullName: updateDetails.fullName, email: updateDetails.email, updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate customer profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersProfile(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({fullName: updateDetails.fullName, email: updateDetails.email, updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate rider profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateCustomersAvatar(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({ avatarUrl: updateDetails.avatarUrl ,updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate customer avatar: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersAvatar(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ avatarUrl: updateDetails.avatarUrl ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate rider avatar: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateCustomersPushToken(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({ pushToken: updateDetails.pushToken ,updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate customer push: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersPushToken(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ pushToken: updateDetails.pushToken ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate rider push token: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersOnlineStatus(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ onlineStatus: updateDetails.onlineStatus ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error) {
        console.log("Error from upate rider online status: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRiderApprovalStatus(updateDetails) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ approvalStatus: updateDetails.approvalStatus ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null}
    } catch (error) {
        console.log("Error from upate rider approval status: ", error)
        return {success: false, error: error.message}
    }
}