import mongoose from "mongoose"
import validator from "validator"

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
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Please enter a valid email"
        }
    },
      role:{
        type: String,
        enum: ["admin", "user"],
        default: "user"
       
    },

    password: {
        type: String,
        minLength: 6,
         validate: {
            validator:function(value){
                return validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })
            },
            message: "Password must contain at least 6 characters, including uppercase, lowercase, number and symbol"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});


// create a model from the schema
// it is a convention to use capital letters for the variable name of the model

export const User = mongoose.model("User", userSchema)