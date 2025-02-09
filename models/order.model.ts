import { model } from "mongoose";
import { orderSchema } from "./order.schema";

export const orderModel = model("order", orderSchema);