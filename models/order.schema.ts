import { Schema } from "mongoose";
import { Order } from "../interface/IOrder";

export const orderSchema = new Schema<Order>({
    id: String,
    issue_date: Date,
    planned_completion_date: Date,
    actual_completion_date: Date,
    work_category: String,
    car_id: String,
    mechanic_id: String
})