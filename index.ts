import { connect, model, Schema } from "mongoose";

connect("mongodb://127.0.0.1:27017/avtoservice")
    .then(() => console.log("[Connect] MongoDB"));


interface Car {
    id: string;
    brand: string;
    year_of_manufacture: number;
    owner_name: string;
    price: number;
}

interface Mechanic {
    id: string;
    full_name: string;
    qualification_level: number;
    bonus: number;
}

interface Order {
    id: string;
    issue_date: Date;
    planned_completion_date: Date;
    actual_completion_date: Date;
    work_category: string;
    car_id: string;
    mechanic_id: string;
}

interface DelayedRepair {
    car_brand: string;
    mechanic_id: string;
    delay_days: number;
}

const carModel = model<Car>("car",
    new Schema<Car>({
        id: String,
        brand: String,
        year_of_manufacture: Number,
        owner_name: String,
        price: Number
    })
);

const mechanicSchema = new Schema<Mechanic>({
    id: String,
    full_name: String,
    qualification_level: Number,
    bonus: Number
});

const mechanicModel = model<Mechanic>("mechanic",
    mechanicSchema
);

const orderModel = model<Order>("order",
    new Schema<Order>({
        id: String,
        issue_date: Date,
        planned_completion_date: Date,
        actual_completion_date: Date,
        work_category: String,
        car_id: String,
        mechanic_id: String
    })
);

const delayReairModel = model<DelayedRepair>("delayed_repair",
    new Schema({
        car_brand: String,
        mechanic_id: String,
        delay_days: Number
    })
);



(async () => {
    const mech = mechanicModel.watch();
    mech.on("change", async (change) => { 
        if (change.operationType === "update" && 
            change.updateDescription.updatedFields.qualification_level) {
            const mechanic = await mechanicModel.findOne(change.documentKey );
            if (!mechanic) { 
                return;
            }

            console.log(`CHANGE`,mechanic);
            const bonusIncrease = Math.floor( mechanic.bonus * 0.1 * mechanic.qualification_level);
            const updt = await mechanic.$set("bonus", bonusIncrease).save();
            console.log(`UPDATE`, updt);
            
            console.log(`Бонус оновлено для механіка:`, mechanic.full_name);
        }
    })
})();
    
    
    
    //     function findLoyalClient() {
    //         return orderModel.aggregate([
    //             {
    //                 $lookup: {
    //                     from: "cars",
    //                     localField: "car_id",
    //                     foreignField: "id",
    //                     as: "car"
    //                 }
    //             },
    //             { $unwind: "$car" },
    //             {
    //                 $group: {
    //                     _id: "$car.owner_name",
    //                     unique_mechanics: { $addToSet: "$mechanic_id" }
    //                 }
    //             },
    //             { $match: { "unique_mechanics.1": { $exists: false } } },
    //             {
    //                 $project: {
    //                     owner_name: "$_id",
    //                     mechanic_id: { $arrayElemAt: ["$unique_mechanics", 0] }
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: "mechanics",
    //                     localField: "mechanic_id",
    //                     foreignField: "id",
    //                     as: "mechanic"
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 0,
    //                     owner_name: 1,
    //                     mechanic_name: { $arrayElemAt: ["$mechanic.full_name", 0] }
    //                 }
    //             }
    //         ])
    //     };
    
    //     const result = await findLoyalClient();
    //     console.log(result);

//     function top_mech_category(work_category: string) {
//         return orderModel.aggregate([
//             { $match: { work_category: work_category } },
//             { $group: { _id: "$mechanic_id", job_count: { $sum: 1 } } },
//             { $sort: { job_count: -1 } },
//             { $limit: 1 },
//             {
//                 $lookup: {
//                     from: "mechanics",
//                     localField: "_id",
//                     foreignField: "id",
//                     as: "mechanic"
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     mechanic_name: { $arrayElemAt: ["$mechanic.full_name", 0] },
//                     jobs_completed: "$job_count"
//                 }
//             }
//         ])
//     }

//    const result = await top_mech_category("Ремонт двигуна");
//    console.log(result)



// const result = await orderModel.aggregate([
//     {
//         $lookup: {
//             from: "cars",
//             localField: "car_id",
//             foreignField: "id",
//             as: "car"
//         }
//     },
//     { $unwind: "$car" },
//     {
//         $match: {
//             "car.brand": "Mercedes-600",
//             $expr: { $gt: ["$actual_completion_date", "$planned_completion_date"] }
//         }
//     },
//     {
//         $project: {
//             _id: 0,
//             car_brand: "$car.brand",
//             mechanic_id: 1,
//             delay_days: {
//                 $dateDiff: {
//                     startDate: "$planned_completion_date",
//                     endDate: "$actual_completion_date",
//                     unit: "day"
//                 }
//             }
//         }
//     }
// ]);
// console.log(result); /// Результат

// await new delayReairModel(...result).save(); /// Збереження результату в іншій колекції

// const check = await delayReairModel.find();

// console.log(check) /// Демонстрація збереженого резлутату в колекції