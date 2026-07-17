import mongoose from "mongoose";
import pkg from "passport-local-mongoose";
const passportLocalMongoose = pkg.default;

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique: true,
    }
})

UserSchema.plugin(passportLocalMongoose);

export default UserSchema;