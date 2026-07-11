import mongoose from "mongoose";
import { MeetingSchema } from "../schema/meetingSchema.js";

export const Meeting = mongoose.model("meeting",MeetingSchema);