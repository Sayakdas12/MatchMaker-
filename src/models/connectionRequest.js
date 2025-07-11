const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // recommended for relations
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"], 
                message: `{VALUE} is not a valid status`,
            },

            //   default: "interested", // optional: default status
        },
    },
    {
        timestamps: true, 
    }
);


connectionRequest.index({ fromUserId: 1, toUserId: 1}),



connectionRequest.pre("save", function(next){
    const connectionRequest = this;
    // Check if the fromUderId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself !!");
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequest);
