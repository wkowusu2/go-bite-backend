import jwtPkg from 'jsonwebtoken'
import { generateRefreshToken } from '../utils/cryptoHelper.js';
import { insertRefreshToken } from './dbService.js';

const {sign} = jwtPkg;

export async function generateTokens(userId: string, phone: string, role: string): Promise<{_success: boolean, _error: string | null, _data?: {access_token: string, refresh_token: string }} >{
 try {
     if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    } 
    const secret = process.env.JWT_SECRET;
    const userDetails = {sub: userId, phone: phone, role: role};

    const access_expiry = 15 * 60 ;
    const access_token = sign(userDetails,secret, {expiresIn: access_expiry});

    const {actulToken, hashedToken} = generateRefreshToken();

    const refresh_expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshTokenDetail = {userId: userId, refreshToken: hashedToken, refreshExpiry: refresh_expiry}
    const response = await insertRefreshToken(refreshTokenDetail); 

    if(!response.success) throw new Error(response.error);

    const data = {access_token: access_token, refresh_token: actulToken};
    return {_success: true,_error: null, _data: data};
 } catch (error: any) {
    console.log("Error from creating tokens")
    return {_success: false, _error: error.message}
 }
}