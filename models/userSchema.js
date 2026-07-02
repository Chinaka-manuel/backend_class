import mongoose from "mongoose"

// create a variable that will hold the schema
let userSchema = new mongoose.Schema({
    image: {
        type: String,
        default: "efuhwudfhowdfsd9ufsdihfdu"
    },
    userName: {
        type: String,
        required: [true, "user name field is required"],
       
    },
    email: {
        type: String,
        required: [true, "Email field is required"],
        trim: true,
        unique: true
    },
      role:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    password: {
        type: String,
        minLength: 6
    }

  

})


// create a model from the schema
// it is a convention to use capital letters for the variable name of the model

export const User = mongoose.model("User", userSchema)