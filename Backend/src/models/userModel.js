import mongoose from "mongoose";
import UserSchema from "../schema/userSchema.js";

const User = mongoose.model("user",UserSchema);
export default User;
