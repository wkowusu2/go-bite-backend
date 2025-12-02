import { supabaseAdmin } from "../src/config/supabaseAdmin.js";
import { supabaseClient } from "../src/config/supabaseClient.js"


export const saveOtp = async (phone_number, otp) => {
  try {
    const { error } = await supabaseClient
      .from('otp')
      .insert({ phone: phone_number, otp: otp });

    if (error) {
      throw new Error(error.message); 
    }

    return { success: true, message: 'OTP added successfully' };
  } catch (error) {
    return { success: false, message: `OTP was not saved: ${error.message}` };
  }
};

export const getOtp = async (phone) => {
  try {
    const { data, error } = await supabaseClient
      .from('otp')
      .select('otp')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error('No OTP found for this phone number')
    }

    return { success: true, message: 'OTP retrieved successfully', data: data };
  } catch (error) {
    return { success: false, message: error.message , data: null};
  }
};

export const deleteOtp = async (phone) => {
    try {
        const {error} = await supabaseClient.from('otp').delete().eq('phone', phone)
        if(error) throw new error.message
        return {success_delete: true, message_delete: 'Otp deleted successfully'}
    } catch (error) {
        return {success_delete: false, message_delete: `Failed to get OTP: ${error.message}`}
    }
}

export const getUserByPhone = async (phone) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;
    
    const usersArray = data.users;

    // find a user with the matching phone in metadata
    const user = usersArray.find(u => u.user_metadata && u.user_metadata.phone === phone);

    return user || null;
  } catch (err) {
    console.error('Error fetching user by phone:', err);
    return null;
  }
};


