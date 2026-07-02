import jwt from 'jsonwebtoken'
import { User } from '../models/userSchema.js';

const auth = async (req, res, next) =>{
    // create a tiken from the request headers
  const token = req.headers.authorization.split(" ")[1];

//   return an error response if token does not exist 
if(!token){
    return res.status(403).json({
        status: "failed",
        message: "authorization token not found "
    })
}

// verify the token using jwt
const verified = jwt.verify(token, process.env.JWT_SECRET)

// find the verified user
const user = await User.findById(verified.id)

// check if verified user with the token exist, retuen an error if not 
if(!user){
    return res.status(404).json({
        status: "failed",
        message: "unauthorized"
    })
}

// make the requested user to be qual to the verified user 

req.user = user;

next()


}

export default auth;