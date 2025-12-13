import { config } from "dotenv";
import { randomInt } from 'crypto';
import axios from 'axios'
import { createUser, customerHasProfile, deleteOtp, getOtp, getRefreshToken, getUserByPhone, revokeToken, riderHasProfile, saveOtp } from "../service/dbService.js";
import { generateTokens } from "../service/jwtService.js";
import { hashToken } from "../../utils/cryptoHelper.js";

config()
export const sendOtp = async (req, res) => {
    const {phone} = req.body
    try {
        //generate the otp
    let otp = '';
    let length = 6;
    for (let i = 0; i < length; i++) {
        otp += randomInt(0, 10); 
    }
    //save otp to db 
    const {success, error} = await saveOtp(phone, otp)
    if(!success) throw new Error(error)
    //send otp to phone number via hubtel

    const clientId = process.env.HUBTEL_CLIENT_ID;
    const clientSecret = process.env.HUBTEL_CLIENT_SECRET;

    const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${clientId}&clientsecret=${clientSecret}&from=GoBite&to=${phone}&content=Your+otp+from+GoBite+is+${otp}`;

    const resp = await axios.get(url);
    console.log(resp)
    const response = await resp.data

    if(response?.messageId) {
        const response = { message: "OTP sent" };
        res.status(200).json(response)
    }
    else{
        throw new Error("Failed to send OTP, please try again")
    }
    }catch (error) {
        const response = {success: false, message: error.message}
        return res.status(400).json(response)
    }
} 


export const verifyOtp = async (req, res) => {
  const response = {success: true, access: '', refresh: '', userDetails: {}, hasProfile: null};
  const { phone, otp, role } = req.body;
  const roles = ['CUSTOMER', 'ADMIN', 'VENDOR_ADMIN', 'RIDER']

  if(!roles.includes(role)) {
    return res.status(401).json({success: false, error: "You are not permitted to access the app"})
  }

  try {
    // Get OTP from DB
    const { success, error, savedOtp } = await getOtp(phone, otp);
    if (!success) throw new Error(error);

    if (savedOtp) {
      // throw new Error('Invalid or expired OTP');
      console.log("saved otp: ", savedOtp)
    }

    // Delete OTP
    const { success_delete, error_delete } = await deleteOtp(phone);
    if (!success_delete) throw new Error(error_delete);

    // Check if a user with this phone already exists
    const {_success, user, _error} = await getUserByPhone(phone);
    if(!_success) throw new Error(_error)

    if(!user){
      console.log("no user found")
      const {error, success,userDetails} = await createUser(phone, role)
      if(!success) throw new Error(error); 
      if(role == 'CUSTOMER'){
        const {error, success, hasProfile} = await customerHasProfile(userDetails.id);
        if(!success) throw new Error(error);
        response.hasProfile = hasProfile
      }
      else if(role == 'RIDER'){
        const {error, success, hasProfile} = await riderHasProfile(userDetails.id);
        if(!success) throw new Error(error);
        response.hasProfile = hasProfile
      }

      //create session data 
      const {_error, _data, _success} = await generateTokens(userDetails.id, userDetails.phone, role)
      if(!_success) throw new Error(_error);
      response.access = _data.access_token;
      response.refresh = _data.refresh_token
      response.userDetails = {userId: userDetails.id, userPhone: userDetails.phone, userRole: userDetails.role}
      return res.status(200).json(response);
    }

    console.log("user has account")
    const {_error: someError, _data, _success: someSuccess} = await generateTokens(user.id , user.phone, role)
      if(!someSuccess) throw new Error(someError);
      if(role == 'CUSTOMER'){
        const {error, success, hasProfile} = await customerHasProfile(user.id);
        if(!success) throw new Error(error);
        response.hasProfile = hasProfile
      }
      else if(role == 'RIDER'){
        const {error, success, hasProfile} = await riderHasProfile(user.id);
        if(!success) throw new Error(error);
        response.hasProfile = hasProfile
      }
      response.access = _data.access_token;
      response.refresh = _data.refresh_token
      response.userDetails = {userId: user.id, userPhone: user.phone, userRole: user.role}

    return res.status(200).json(response)
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const refreshingToken = async (req, res) => {
  const response = {success: true, access: '', refresh: '',};
   try {
    const {userId, refresh_token, phone, role} = req.body; 

   //hash the refresh token
   const hashedRefreshToken = hashToken(refresh_token)
   const {success, error, data} = await getRefreshToken(userId, hashedRefreshToken)
   if(!success) throw new Error(error)
    const now = new Date()
    const expired = now > data.expiresAt 
    if(expired) throw new Error("Refresh token is expired");
    if(data.revoked) throw new Error("Refresh token is revoked");

    //revoke the old token 
    const { success: revoke_success, error: revoke_error } = await revokeToken(data.refreshToken);
    if(!revoke_success) throw new Error(revoke_error)


    const {_error: someError, _data, _success: someSuccess} = await generateTokens(userId , phone, role)
      if(!someSuccess) throw new Error(someError);
      response.access = _data.access_token;
      response.refresh = _data.refresh_token;

      return res.status(200).json(response);
    //
   } catch (error) {
      console.log("error: ", error)
      return res.status(400).json({ success: false, error: error.message });
   }
}
