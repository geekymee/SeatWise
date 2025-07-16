import mongoose from "mongoose";


const SlotSchema = new mongoose.Schema({
    branch: {
        type: String,
    },
    slot: {
        type: String,
    },
    sem: {
        type: Number,
    },
    subcode: {
        type: [String],
    }
});

export const Slot = mongoose.model('Slot',  SlotSchema);