import { model } from "mongoose";
import { mechanicSchema } from "./mechanic.schema";

export const mechanicModel = model("mechanic", mechanicSchema);