const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // optional but recommended for relations
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "intersted", "accepted", "rejected"], 
                message: `{VALUE} is not a valid status`,
            },

            //   default: "interested", // optional: default status
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ConnectionRequest", connectionRequest);
