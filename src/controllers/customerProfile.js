import { createCustomerProfile, createIsGuest, findCustomerProfileWithId, getUserIsGuest, updateCustomerProfile, updateCustomersAvatar, updateCustomersPushToken, updateIsGuest } from "../service/dbService.js";

export async function createProfile(req, res) {
    const {fullName, email} = req.body; 
    const {sub} = req.user;
    const profileDetails = {userId: sub, fullName: fullName, email: email};
    
    try {
        //check to see if there's a profile with the id
        const {success, error, data} = await findCustomerProfileWithId(sub);
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

export async function updateProfile(req,res) {
    try {
        const {fullName, email} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {fullName: fullName, email: email, userId: sub}

        const {success, error, data} = await updateCustomerProfile(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating profile");
        return res.status(404).json({success: false, error: error.message})
    }
} 

export async function updateCutomerAvatar(req, res) {
    try {
        const {avatarUrl} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {avatarUrl: avatarUrl, userId: sub}

        const {success, error, data} = await updateCustomersAvatar(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating rider avatar");
        return res.status(404).json({success: false, error: error.message})
    }
} 

export async function updateCustomerPushToken(req, res) {
    try {
        const {pushToken} = req.body;
        const {sub} = req.user;
        console.log("userId: ", sub)

        const profileDetails = {pushToken: pushToken, userId: sub}

        const {success, error, data} = await updateCustomersPushToken(profileDetails);
        if(!success) throw new Error(error);

        return res.status(200).json({success: true, error: null, data: data})
    } catch (error) {
        console.log("Error from updating rider avatar");
        return res.status(404).json({success: false, error: error.message})
    }
}

export async function creatingIsGuest(req, res) {
    try {
        const {status} = req.body; 
        const {sub} = req.user;

        const {data, error, success} = await createIsGuest(sub, status); 
        console.log("Data from creating user is guest ", data)
        if(!success) throw new Error(error);

        const response = {success: true, error: null, data: "Insert successful"}; 
        return res.status(200).json(response);

    } catch (error) {
        console.log("Error from creating isGuest: ", error)
        const response = {success: false, error: error.message, data: null};
        return res.status(400).json(response);
    }
}

export async function updatingIsGuest(req, res) {
    try {
        const {status} = req.body; 
        const {sub} = req.user;

        const {data, error, success} = await updateIsGuest(sub, status); 
        console.log("Data from update is guest ", data)
        if(!success) throw new Error(error);

        const response = {success: true, error: null, data: "Update successful"}; 
        return res.status(200).json(response);

    } catch (error) {
        console.log("Error from updating isGuest: ", error)
        const response = {success: false, error: error.message, data: null};
        return res.status(400).json(response);
    }
}

export async function gettingIsguest(req, res) {
    try {
        const {sub} = req.user;

        const {data, error, success} = await getUserIsGuest(sub);
        if(!success) throw new Error(error);

        const response = {success: true, error: null, data: data}; 
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error from getting isGuest: ', error);
        const response = {success: false, error: error.message, data: null};
        return res.status(400).json(response);
    }
}