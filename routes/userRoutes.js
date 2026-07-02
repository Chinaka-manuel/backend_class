import express from "express"
import auth from "../middlewares/auth.js"
import { addUser, loginUser,  profile, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js"
import admin from "../middlewares/adminMiddleware.js"

const Router = express.Router()

// Router.route('/')
// .get(getAllUsers)

Router.route('/users')
.get(auth, admin, getAllUsers)

Router.route('/register')
.post(addUser)

Router.route('/login')
.post(loginUser)

Router.route('/profile')
.get(auth, profile)

Router.route('/:email')
.patch(auth, updateUser)
.delete(auth, deleteUser )





export default Router