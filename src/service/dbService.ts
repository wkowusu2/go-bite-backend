import { and, eq } from 'drizzle-orm';
import {getDb} from '../config/db.config.js';
import {otpTable} from '../schema/otp.js'
import { customerProfileTable } from '../schema/customerProfile.js';
import { refreshToken } from '../schema/refreshToken.js';
import { users } from '../schema/users.js';
import { riderProfiles } from '../schema/riderProfile.js';
import { isUserGuest } from '../schema/isGuest.js';
import { UserRole } from '../types/userRoles.js';
import { CreateUserType, ProfileType, refreshTokenDetailType } from '../types/dbServiceTypes.js';

const db = getDb(); 
export async function saveOtp(phone: string, otp: string){
    try {
        const [savedOtp] = await db.insert(otpTable).values({phoneNumber: phone, otp: otp}).returning(); 
        if(!savedOtp) throw new Error("Otp was not saved"); 
        return {success: true, error: null}
    } catch (error: any) {
        console.log("Error when saving the token: ", error)
        return {success: false, error: error.message}
    }
}

export async function getOtp(phone: string, otp: string) {
    try {
        const [row] = await db.select().from(otpTable).where(and(eq(otpTable.phoneNumber, phone), eq(otpTable.otp, otp))); 
        if(!row) throw new Error("Otp not found");
        return {success: true, error: null, savedOtp: row}
    } catch (error: any) {
        console.log("Error from retriving otp: ", error);
        return {success: false, error: error.message}
    }
}

export async function deleteOtp(phone: string) {
    try{
        await db.delete(otpTable).where(eq(otpTable.phoneNumber, phone));
        return {success_delete: true, error_delete: null}
    } catch(error: any){
        console.log("Error fromm delete otp");
        return {success_delete: false, error_delete: error.message}
    }
}

export async function createCustomerProfile(profileDetail: CreateUserType) {
    try {
        const [savedCustomer] = await db.insert(customerProfileTable).values({userId: profileDetail.userId, fullName: profileDetail.fullName, email: profileDetail.email}).returning();
        if(!savedCustomer) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedCustomer}
    } catch (error: any) {
        console.log("Error from createProfile: ", error)
        return {success: false, error: error.message}
    }
}

export async function createRiderProfiles(profileDetail: ProfileType) {
    try {
        const [savedRider] = await db.insert(riderProfiles).values({userId: profileDetail.userId, fullName: profileDetail.fullName, email: profileDetail.email}).returning();
        if(!savedRider) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedRider}
    } catch (error: any) {
        console.log("Error from create rider Profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function createUser(phone: string, role: UserRole) {
    try {
        const [savedUser] = await db.insert(users).values({phone: phone, role: role}).returning();
        if(!savedUser) throw new Error("Saving user failed");
        return {success: true, error: null, userDetails: savedUser}
    } catch (error: any) {
        console.log("Error from createProfile: ", error)
        return {success: false, error: error.message}
    }
}

export async function getUserByPhone(phone: string) {
    try {
        const [existingUser] = await db.select().from(users).where(eq(users.phone, phone))
        return {_success: true, _error: null, user: existingUser}
    } catch (error: any) {
        console.log("error from getUserFrom Phone:",error)
        return {_success: false, _error: error.message, user: null}
    }
}

export async function insertRefreshToken(refreshTokenDetail: refreshTokenDetailType) {
    try {
        const [refresh] = await db.insert(refreshToken).values({userId: refreshTokenDetail.userId, refreshToken:refreshTokenDetail.refreshToken, expiresAt: refreshTokenDetail.expiresAt }).returning();
        if(!refresh) throw new Error('Token not added');
        return {success: true, error: null}
    } catch (error: any) {
        console.log("Error from inserting the refresh token: ", error)
        return {success: false, error: error.message}
    }
}

export async function getRefreshToken(userId: string, incomingrefreshToken: string) {
    try {
        const [savedRefresh] = await db.select().from(refreshToken).where( eq(refreshToken.refreshToken, incomingrefreshToken));

        if(!savedRefresh) throw new Error("Token not found");
        return {success: true, error: null, data: savedRefresh}
    } catch (error: any) {
        console.log("Error from refreshing the token: ", error)
        return {success: false, error: error.message}
    } 
}

export async function revokeToken(tokenToBeRevoke: string) {
    try {
        const [savedToken] = await db.update(refreshToken).set({lastUsedAt: new Date(), revoked: true}).where(eq(refreshToken.refreshToken, tokenToBeRevoke)).returning()
        if(!savedToken) throw new Error("Revoking token failed");
        return {success: true, error: null};
    } catch (error: any) {
        console.log("Error from revoking token: ", error);
        return {success: false, error: error.message};
    }
    
}

export async function findCustomerProfileWithId(userId: string) {
    try {
        const [savedProfile] = (await db.select().from(customerProfileTable).where(eq(customerProfileTable.userId, userId)));
    
        if(!savedProfile) throw new Error("Profile does not exit");
        return {success: true, error: null, data: savedProfile};
    } catch (error: any) {
        console.log("Error from find profile");
        return {success: false, error: error.message};
    }
}

export async function findRiderProfileWithId(userId: string) {
    try {
        const [savedProfile] = (await db.select().from(riderProfiles).where(eq(riderProfiles.userId, userId)));
    
        if(!savedProfile) throw new Error("Profile does not exit");
        return {success: true, error: null, data: savedProfile};
    } catch (error: any) {
        console.log("Error from find profile");
        return {success: false, error: error.message};
    }
}

export async function updateCustomerProfile(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({fullName: updateDetails.fullName, email: updateDetails.email, updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate customer profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersProfile(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({fullName: updateDetails.fullName, email: updateDetails.email, updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate rider profile: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateCustomersAvatar(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({ avatarUrl: updateDetails.avatarUrl ,updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate customer avatar: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersAvatar(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ avatarUrl: updateDetails.avatarUrl ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate rider avatar: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateCustomersPushToken(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(customerProfileTable).set({ pushToken: updateDetails.pushToken ,updatedAt: now}).where(eq(customerProfileTable.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate customer push: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersPushToken(updateDetails: ProfileType) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ pushToken: updateDetails.pushToken ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate rider push token: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRidersOnlineStatus(updateDetails: {onlineStatus: boolean, userId: string }) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ onlineStatus: updateDetails.onlineStatus ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null, data: record[0]}
    } catch (error: any) {
        console.log("Error from upate rider online status: ", error)
        return {success: false, error: error.message}
    }
}

export async function updateRiderApprovalStatus(updateDetails: {approvalStatus: boolean, userId: string } ) {
    console.log("update details: ", updateDetails)
    try {
    const now = new Date()
    const record = await db.update(riderProfiles).set({ approvalStatus: updateDetails.approvalStatus ,updatedAt: now}).where(eq(riderProfiles.userId,updateDetails.userId)).returning();

    if(record.length === 0) throw new Error('Profile not found');

    return {success: true, error: null}
    } catch (error: any) {
        console.log("Error from upate rider approval status: ", error)
        return {success: false, error: error.message}
    }
}

export async function customerHasProfile(userId: string) {
    try {
        console.log("userId: ", userId);
        const [profile] = await db.select({id: customerProfileTable.id }).from(customerProfileTable).where(eq(customerProfileTable.userId, userId)).limit(1);
        if(!profile) {
            return {success: true,hasProfile: false, error: null};
        }
        return {success: true,hasProfile: true, error: null};
    } catch (error: any) {
        console.log("Some error occurred while checking the profile: ", error);
        return {success: false, error: error.message};
    }
}

export async function riderHasProfile(userId: string) {
    try {
        console.log("userId: ", userId);
        const [profile] = await db.select({id: riderProfiles.id }).from(riderProfiles).where(eq(riderProfiles.userId, userId)).limit(1);
       
        if(!profile) {
            return {success: true,hasProfile: false, error: null};
        }
        return {success: true,hasProfile: false, error: null};
    } catch (error: any) {
        console.log("Some error occurred while checking the profile: ", error);
        return {success: false, error: error.message};
    }
}

export async function isGuest(userId: string) {
    try {
        const [guest] = await db.select({isGuest: isUserGuest.isGuest }).from(isUserGuest).where(eq(isUserGuest.userId, userId));
        if(!guest){
            return {success: true, data: null, error: null}
        } 
        return {success: true, error: null, data: guest}
    } catch (error: any) {
        console.log("Error from find user as guest ", error);
        return {success: false, error: error.message, data: null}
    }
}

export async function createIsGuest(userId: string, status: boolean) {
    try {
        //check if there's a record already with the 
        const [record] = await db.insert(isUserGuest).values({isGuest: status, userId: userId}).returning();
        return {success: true, error: null, data: record}
    } catch (error: any) {
        console.log("Error from inserting user as guest ", error.cause);
        if(error.cause == 'error: duplicate key value violates unique constraint "is_user_guest_user_id_unique"'){
            return {success: false, error: "Record already exists, update it rather", data: null};
        }
        return {success: false, error: error.message, data: null};
    }
}

export async function updateIsGuest(userId: string, reqStatus: boolean) {
    try {
        const now = new Date()
        const [status] = await db.update(isUserGuest).set({isGuest: reqStatus, updatedAt: now}).where(eq(isUserGuest.userId, userId)).returning();
        if(!status) throw new Error("User does not exist")
        return {success: true, error: null, data: status}
    } catch (error: any) {
        console.log("Error from find user as guest ", error);
        return {success: false, error: error.message, data: null}
    }
}

export async function getUserIsGuest(userId: string) {
    try {
        const [isGuest] = await db.select({isGuest: isUserGuest.isGuest}).from(isUserGuest).where(eq(isUserGuest.userId, userId)).limit(1);
        if(!isGuest) throw new Error("User does not exist");

        return {success: true, error: null, data: isGuest}
    } catch (error: any) {
        console.log("Error from getting user as guest ", error);
        return {success: false, error: error.message, data: null}
    }
}