import mongoose from "mongoose";

export const MeetingSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    meetingCode :{
        trype:String,
        required:true,
        unique:true
    },
    data:{
        type:Date,
        default:Date.now,
        required:true
    }
})