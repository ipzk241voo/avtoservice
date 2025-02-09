import { Schema } from "mongoose";
import { Order } from "../interface/IOrder";

export const orderSchema = new Schema<Order>({
    id: { type: String, required: true },
    issue_date: { type: Date, required: true },
    planned_completion_date: { type: Date, required: true },
    actual_completion_date: { type: Date, required: true },
    work_category: { type: String, required: true },
    car_id: { type: String, required: true },
    mechanic_id: { type: String, required: true },
})