import { supabaseClient } from "../src/config/supabaseClient"


export const saveOtp = async (phone_number, otp) => {
  try {
    const { error } = await supabaseClient
      .from('otp')
      .insert({ phone: phone_number, otp: otp });

    if (error) {
      throw new Error(error.message); // use the actual error message
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

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { success: false, message: 'No OTP found for this phone number' };
    }

    return { success: true, message: 'OTP retrieved successfully', data: data };
  } catch (error) {
    return { success: false, message: `Failed to get OTP: ${error.message}` , data: null};
  }
};

export const deleteOtp = async (phone) => {
    try {
        const {error} = await supabaseClient.from('otp').delete().eq('phone', phone)
        if(error) throw new error.message
        return {success: true, message: 'Otp deleted successfully'}
    } catch (error) {
        return {success_delete: false, message_delete: `Failed to get OTP: ${error.message}`}
    }
}
