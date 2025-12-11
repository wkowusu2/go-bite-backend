import { createRiderProfiles, findRiderProfileWithId, updateRidersAvatar, updateRidersOnlineStatus, updateRidersProfile, updateRidersPushToken } from "../service/dbService.js";

export async function createRiderProfile(req, res) {
    const {fullName, email} = req.body; 
    const {sub} = req.user
    const profileDetails = {userId: sub, fullName: fullName, email: email};
    
    try {
        //check to see if there's a profile with the id
        const {success, error, data} = await findRiderProfileWithId(sub);
        //a network error occurred or something similar to that 
        if(error && error != "Profile does not exit") throw new Error(error);
        if(success) throw new Error("Profile already exists, consider updating"); 

        const {success: profileSuccess, error:profileError , userDetails} = await createRiderProfiles(profileDetails); 
        if(!profileSuccess) throw new Error(profileError);

        return res.status(200).json({success: true, data: userDetails})
        
    } catch (error) {
        console.log("Error from creating rider Profile: ", error);
        return res.status(400).json({success: false, error: error.message})
    }

}

export async function getRiderProfile(req, res) {
    console.log("req,user: ", req.user)
    const {sub} = req.user;
    try {
        //check if profile exits 
        const {error, success, data} = await findRiderProfileWithId(sub);
        if(!success) throw new Error(error); 
        return res.status(200).json({success: true, error: null, data: data});

    } catch (error) {
        console.log("Error from getting profile")
        return res.status(404).json({success: false, error: error.message})
    }
}

export async function updateRiderProfile(req,res) {
    try {
        const {fullName, email} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {fullName: fullName, email: email, userId: sub}

        const {success, error, data} = await updateRidersProfile(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating profile");
        return res.status(404).json({success: false, error: error.message})
    }
}

export async function updateRiderAvatar(req, res) {
    try {
        const {avatarUrl} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {avatarUrl: avatarUrl, userId: sub}

        const {success, error, data} = await updateRidersAvatar(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating rider avatar");
        return res.status(404).json({success: false, error: error.message})
    }
} 

export async function updateRiderPushToken(req, res) {
    try {
        const {pushToken} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {pushToken: pushToken, userId: sub}

        const {success, error, data} = await updateRidersPushToken(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating rider avatar");
        return res.status(404).json({success: false, error: error.message})
    }
}

export async function updateRiderOnlineStatus(req, res) {
    try {
        const {onlineStatus} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {onlineStatus: onlineStatus, userId: sub}

        const {success, error, data} = await updateRidersOnlineStatus(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating rider avatar");
        return res.status(404).json({success: false, error: error.message})
    }
}