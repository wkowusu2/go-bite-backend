import { createCustomerProfile, findCustomerProfileWithId } from "../service/dbService.js";

export async function createProfile(req, res) {
    const {fullName, email, userId} = req.body; 
    const profileDetails = {userId: userId, fullName: fullName, email: email};
    
    try {
        //check to see if there's a profile with the id
        const {success, error, data} = await findCustomerProfileWithId(userId);
        //a network error occurred or something similar to that 
        if(error && error != "Profile does not exit") throw new Error(error);
        if(success) throw new Error("Profile already exists, consider updating"); 

        const {success: profileSuccess, error:profileError , userDetails} = await createCustomerProfile(profileDetails); 
        if(!profileSuccess) throw new Error(profileError);

        return res.status(200).json({success: true, data: userDetails})
        
    } catch (error) {
        console.log("Error from createProfile: ", error);
        return res.status(400).json({success: false, error: error.message})
    }

}

export async function getProfile(req, res) {
    console.log("req,user: ", req.user)
    const {sub} = req.user;
    try {
        //check if profile exits 
        const {error, success, data} = await findCustomerProfileWithId(sub);
        if(!success) throw new Error(error); 
        return res.status(200).json({success: true, error: null, data: data});

    } catch (error) {
        console.log("Error from getting profile")
        return res.status(404).json({success: false, error: error.message})
    }
}