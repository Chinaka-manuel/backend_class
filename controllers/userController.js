import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { User } from "../models/userSchema.js";
import { sendVerificationEmail } from "../config/email.js";
import token from "../utils/jwt.js";

export const addUser = async (req, res) => {
    try {

        // get all the properties to be added from the request body 
        const { image, userName, email, role, password, confirmPassword } = req.body

        // check if password and confirm password are thesame 
        if (password !== confirmPassword) {
            return res.status(403).json({
                status: "Failed",
                message: "password and confirmPassword must be the same"
            })
        }

        // find user by email
        const findUser = await User.findOne({ email: email.toLowerCase() })

        // check if user exist in the database
        if (findUser) {
            return res.status(401).json({
                status: "Failed",
                message: "user already exists"
            })
        }

        //create a new user in the database 
        const user = await User.create({
            image,
            userName,
            email: email.toLowerCase(),
            role,
            password
        })

        // create a variable that will hold the verification token 
        const verificationToken = token({ id: user._id, email: user.email })
        //generate a verification link from the client url
        const verificationLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${verificationToken}`


        // find user by id and update the verification token
        await User.findByIdAndUpdate(user._id, { verificationToken })

        // send a verification email
        await sendVerificationEmail(user, verificationLink)

        // create an authentication token that will be returned to the user as verification token
        const authToken = token({ id: user._id })


        // return a success response
        res.status(201).json({
            status: "success",
            token: authToken,
            message: "user registered successfully. Check your email to verify your account.",
            data: user
        })
    } catch (err) {
        res.status(501).json({
            status: "failed",
            message: `unable to register user error: ${err}`
        })
    }
}

// login User
export const loginUser = async (req, res) => {
    try {

        // get email and password from the request body
        const { email, password } = req.body;
        //check if email exist in the database 
        const user = await User.findOne({ email: email.toLowerCase() })


        // return an error response if user doies not exist 
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "invalid email or password"
            })
        }

        // return error if user is not verified
        if (!user.isVerified) {
            return res.status(403).json({
                status: "failed",
                message: "please verify your email before logging in"
            })
        }

        // compare the password in the database(hashed password and the password the user inputed)
        const comparePassword = await bcrypt.compare(password, user.password)

        // return an error if the passwords does  not match 
        if (!comparePassword) {
            return res.status(403).json({
                status: "failed",
                message: "invalid email or password"
            })
        }

        // generate a login token for authorization 
        const logToken = token({ id: user._id })


        // return a success response if user logged in successfully
        res.status(200).json({
            status: "success",
            message: "login successful",
            token: logToken,
            data: user
        })
    } catch (err) {
        res.status(501).json({
            status: "failed",
            message: `Unable to login error: ${err}`
        })
    }
}

// profile controller
export const profile = (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "welcome to the profile page"
        })
    } catch (err) {
        res.status(403).json({
            status: "failed",
            message: `Unauthorized error: ${err}`
        })
    }
}

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const user = await User.find({}).select("-password")

        res.status(200).json({
            status: "success",
            message: "all users retrieved",
            data: user
        })
    } catch (err) {
        res.status(404).json({
            status: "failed",
            message: `unable to get users ${err}`
        })
    }
}

// updating a user using by email
export const updateUser = async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            updateData,
            { new: true }
        ).select("-password")

        if (!user) {
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
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: `internal server error : ${err}`
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOneAndDelete({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: `user with the email: ${email} not found`
            })
        }

        res.status(200).json({
            status: "success",
            message: `user with the ${email} deleted`
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: `internal server error ${err}`
        })
    }
}


// email verification controller
export const verifyEmail = async (req, res) => {
    try {
        // get the request token from req.params
        const { token: verificationToken } = req.params;
        // decode the token(encrypted server token and client token)
        const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);

        // make the id of the user to be the decorded id 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login`);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token."
        });
    }
};