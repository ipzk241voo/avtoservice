import { Schema } from "mongoose";
import { Mechanic } from "../interface/Mechanic";

export const mechanicSchema = new Schema<Mechanic>({
    id: { type: String, required: true },
    full_name: { type: String, required: true },
    qualification_level: { type: Number, required: true },
    bonus: { type: Number, required: true }
});