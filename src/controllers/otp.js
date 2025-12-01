import { deleteOtp, getOtp, saveOtp } from "../../utils/supabaseHelpers"
import { randomInt } from 'crypto';
import * as axios from 'axios'
import { supabaseAdmin } from "../config/supabaseAdmin";

export const sendOtp = async (phone) => {
    try {
        //generate the otp
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += randomInt(0, 10); 
    }
    //save otp to db 
    const {success, message} = await saveOtp(phone, otp)
    if(!success) throw new Error(message)
    //send otp to phone number via hubtel

    await axios.post("https://api.hubtel.com/v1/messages/send", {
    from: "GoBite",
    to: phone,
    content: `Your login code is ${otp}`
  }, {
    headers: {
      "Authorization": `Basic ${process.env.HUBTEL_API_KEY}`
    }
  });

  //return the message
  return { message: "OTP sent" };
}catch (error) {
        return {success: false, message: error.message}
    }
} 

export const verifyOtp = async (phone, otp) => {
    try {
        //get otp from db
        const {data,message,success} = await getOtp(phone)
        if(!success) throw new Error(message)

        //delete otp from db 
        const {success_delete,message_delete} = await deleteOtp(phone)

        if(!success_delete) throw new Error(message)
        
            // Check if user exists
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers({
            phone: phone
        });

        let userId = null;

        if (existingUser?.users?.length > 0) {
            userId = existingUser.users[0].id;
        }else {
        // Create new user with phone_confirmed = true
         const { data, error } = await supabaseAdmin.auth.admin.createUser({
        phone: phone,
        phone_confirm: true
        });
        if (error) throw new Error(error.message);
        userId = data.user.id;
        } 
        // Create a Supabase session for the user
        const { data: sessionData, error: sessionError } =
            await supabaseAdmin.auth.admin.generateToken(userId);

        if (sessionError) return { error: sessionError };

        return {
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
            user: sessionData.user
        };

    } catch(error) {
                return {success: false, message: error.message}
        }
} 
