import { connect } from "mongoose";
import { orderModel } from "./models/order.model";
import { mechanicModel } from "./models/mechanic.model";

connect("mongodb://127.0.0.1:27017/avtoservice")
    .then(() => console.log("[Connect] MongoDB"));


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
            const mechanic = await mechanicModel.findOne(change.documentKey);
            if (!mechanic) {
                return;
            }

            console.log(`CHANGE`, mechanic);
            const bonusIncrease = Math.floor(mechanic.bonus * 0.1 * mechanic.qualification_level);
            const updt = await mechanic.$set("bonus", bonusIncrease).save();
            console.log(`UPDATE`, updt);

            console.log(`Бонус оновлено для механіка:`, mechanic.full_name);
        }
    })

    const result = await top_mech_category("Ремонт двигуна");
    console.log(result)
})();