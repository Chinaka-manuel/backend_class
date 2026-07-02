import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const addUser = async (req,res) =>{

    try{
    // get the userName, email, password and confirm password from the request body
    const {image, userName, email, role, password, confirmPassword } = req.body

    // check if password and confirmpassword are the same

    if(password !== confirmPassword){
        return res.status(403).json({
            status: "Failed",
            message: " password and confirmPaswword must be the same"
        })
    }

    // check if the user already exist in the database
    const findUser = await User.findOne({email})

    // if the user already exist, give an error response
    if(findUser){
        return res.status(401).json({
            status: "Failed",
            message: " user already exist"
        })
    }

    // console.log(password)
    
    // encrypt the password
    let salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // save the user data into the database
    let user = await User.create({
        image,
        userName, 
        email:email.toLowerCase(), 
        role,
        password: hashedPassword
    })

    // return a success response
    res.status(201).json({
        status: "success",
        message: " user registered successfully",
        data: user
    })

}catch(err){
    res.status(501).json({
        status: "failed",
        message: ` unable to register user error: ${err}`,
        
    })

}  

}

// login User
export const loginUser = async (req, res)=>{
    try{

        // distructure the email and password from the request body
        const {email, password} = req.body;

        // check if user exist in the database
        const user = await User.findOne({email})

        //return an error response if user does not exist in the database
        
        if(!user){
            return res.status(404).json({
                status: "failed",
                message: "invalid email or password"
            })
        }

        // compare the entered password with the password in the database

        let comparePassword = await bcrypt.compare(password, user.password)

        // if entered password and password in the database does not match, return an error 
        if(!comparePassword){
            return res.status(403).json({
                status: " Failed",
                message: "invalid email or password"
            })
        }

        // create a jwt token 
        // jwt token is made up of the header, payload and the signature(made up of header, payload and secret string) 

        let token = jwt.sign({id: user?._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

        res.status(200).json({
          status: "success",
            message: "login successful",
            token,
            data: user
        })

    }catch(err){
        res.status(501).json({
            status: "failed",
            message: `Unable to login error: ${err}`
        })
    }
}

// profile controller 
export const profile = (req,res)=>{
    try{
        res.status(200).json({
            status: "success",
            message: "welcome to the profile page"
        })
    }catch(err){
        res.status(403).json({
            status: "failed",
            message: `Unauthorized error: ${err}`
        })
    }
}

// get all users 

export const getAllUsers = async (req,res) =>{
    try{
    let user = await User.find({}).select("-password")

    res.status(200).json({
        status: "success",
        message: " all users retrived",
        data: user
    })
    }catch(err){
        res.status(404).json({
        status: "failed",
        message: `unable to get users ${err}`,
    
    })
    }
}

// updating a user using by email
export const updateUser = async (req, res) =>{
    try{
        // destructure the email to be updated from the request parameter 

        const {email} = req.params;

        // iniitalize a varibale that will hold the data in the request body
        const updateData = req.body
        // const {image: bodyImage, userName: bodyUserName, email: bodyEmail, role:bodyRole, password:bodyPassword} = req.body;

        const user = await User.findOneAndUpdate(
            // field to update
            {email: email.toLowerCase()},
                updateData,  // update from the request body or what to update
            {new : true}  // return the updated data
        ).select("-password") 

        if(!user){
            return res.status(404).json({
                status: "failed",
                message: `User with the email: ${email} not found`
            })
        }

        res.status(200).json({
            status: "success",
            message: `User with the email: ${email} updated successfully`,
            data: user
        })


    }catch(err){
         res.status(500).json({
            status: "failed",
            message: `internal server error : ${err}`,
         
        })
    }
}


export const deleteUser = async (req,res) =>{
    try{
        const {email} = req.params;

        const user = await User.findOneAndDelete({email: email.toLowerCase()});
        if(!user){
             res.status(404).json({
            status: "failed",
            message: `user with the email: ${email}not found`
        })

        }

        res.status(200).json({
            status: "success",
            message: `user with the ${email} deleted`
        })

    }catch(err){
         res.status(500).json({
            status: "failed",
            message: `intternal server error ${err}`
        })
    }
}