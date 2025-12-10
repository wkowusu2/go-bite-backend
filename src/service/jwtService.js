import jwtPkg from 'jsonwebtoken'
import { generateRefreshToken } from '../../utils/cryptoHelper.js';
import { insertRefreshToken } from './dbService.js';

const {sign, verify} = jwtPkg;

export async function generateTokens(userId, phone,) {
 try {
    const secret = process.env.JWT_SECRET;
    const userDetails = {sub: userId, phone: phone};
    const access_expiry = 15 * 60 * 60 * 1000;
    const access_token = sign(userDetails,secret, {expiresIn: access_expiry});
    const refresh_token = generateRefreshToken();
    const refresh_expiry = new Date(Date.now() + 7 * 24 * 60 * 60);
    const refreshTokenDetail = {userId: userId, refreshToken: refresh_token, refreshExpiry: refresh_expiry}
    const response = await insertRefreshToken(refreshTokenDetail); 
    if(!response.success) throw new Error(response.error);
    const data = {access_token: access_token, refresh_token: refresh_token};
    return {_success: true,_error: null, _data: data};
 } catch (error) {
    console.log("Error from creating tokens")
    return {_success: false, _error: error.message}
 }
}