import { connect, model, Schema } from "mongoose";

connect("mongodb://127.0.0.1:27017/avtoservice")
    .then(() => console.log("[Connect] MongoDB"));



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


function top_mech_category(work_category: string) {
    return orderModel.aggregate([
        { $match: { work_category: work_category } },
        { $group: { _id: "$mechanic_id", job_count: { $sum: 1 } } },
        { $sort: { job_count: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: "mechanics",
                localField: "_id",
                foreignField: "id",
                as: "mechanic"
            }
        },
        {
            $project: {
                _id: 0,
                mechanic_name: { $arrayElemAt: ["$mechanic.full_name", 0] },
                jobs_completed: "$job_count"
            }
        }
    ])
}



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

       const result = await top_mech_category("Ремонт двигуна");
       console.log(result)
})();