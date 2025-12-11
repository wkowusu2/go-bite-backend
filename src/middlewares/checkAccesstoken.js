import { config } from 'dotenv';
import jwtPkg from 'jsonwebtoken';
config()
const {verify} = jwtPkg;

export async function checkAccessToken(req, res, next) {
    try {

    const secret = process.env.JWT_SECRET; 
    const header = req.headers.authorization
    if(!header) {
        return res.status(401).json({success: false, error: "Header not found in request"});
    }
    const [type, token] = header.split(" ");
    if(type != "Bearer" || !token) {
        return res.status(401).json("No token found")
    }
    const decodedToken = verify(token, secret);
    const now = Math.floor(Date.now()/1000);

    if(decodedToken.exp && decodedToken.exp < now){
        return res.status(401).json({success: false, error: "Token is expired"})
    }
    req.user = decodedToken

    next();
    
    } catch (error) {
        console.log("Error from verfying token: ", error)
        return res.status(401).json({success: false, error: error.message})
    }
}