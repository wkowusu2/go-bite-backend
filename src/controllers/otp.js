import { config } from "dotenv";
import { deleteOtp, getOtp, getUserByPhone, saveOtp } from "../../utils/supabaseHelpers.js"
import { randomInt } from 'crypto';
import axios from 'axios'
import { supabaseAdmin } from "../config/supabaseAdmin.js"
import { supabaseClient } from "../config/supabaseClient.js";

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
    const {success, message} = await saveOtp(phone, otp)
    if(!success) throw new Error(message)
    //send otp to phone number via hubtel

    const clientId = process.env.HUBTEL_CLIENT_ID;
    const clientSecret = process.env.HUBTEL_CLIENT_SECRET;

    const url = `https://smsc.hubtel.com/v1/messages/send?clientid=${clientId}&clientsecret=${clientSecret}&from=GoBite&to=${phone}&content=Your+otp+from+GoBite+is+${otp}`;

    const resp = await axios.get(url);
    console.log("response from hubtel",resp)

    if(res.data.messageId) {
        const response = { message: "OTP sent", data: `${otp}` };
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
  const { phone, otp } = req.body;

  try {
    // Get OTP from DB
    const { data: otpData, message, success } = await getOtp(phone);
    if (!success) throw new Error(message);

    if (!otpData[0]?.otp || otpData[0].otp !== Number(otp)) {
      throw new Error('Invalid or expired OTP');
    }

    // Delete OTP
    const { success_delete, message_delete } = await deleteOtp(phone);
    if (!success_delete) throw new Error(message_delete);

    // Check if a user with this phone already exists
    const existingUser = await getUserByPhone(phone); // looks in user_metadata.phone
    let sessionUser;

    // Create or sign in anonymously
    const { data: anonData, error: anonError } = await supabaseClient.auth.signInAnonymously();
    if (anonError) throw new Error(anonError.message);

    sessionUser = anonData;

    //  Merge/update user_metadata with phone
    const updatedMetadata = existingUser
      ? { ...existingUser.user_metadata, phone }
      : { phone };

    const { data: updatedUser, error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(sessionUser.user.id, {
        user_metadata: updatedMetadata,
      });

    if (updateError) throw new Error(updateError.message);

    // Return session info
    return res.status(200).json({
      access_token: sessionUser.session.access_token,
      refresh_token: sessionUser.session.refresh_token,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

