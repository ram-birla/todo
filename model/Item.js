const mongoose = require("mongoose");
const User = require("./User");

const item_Schema = mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status:{
        type: Number,
        default: 0
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }   
})

module.exports = mongoose.model("Item", item_Schema)