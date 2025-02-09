import { Schema } from "mongoose";
import { Mechanic } from "../interface/Mechanic";

export const mechanicSchema = new Schema<Mechanic>({
    id: String,
    full_name: String,
    qualification_level: Number,
    bonus: Number
});