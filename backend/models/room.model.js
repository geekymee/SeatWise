import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room_no: {
        type: String,
        required: [true, 'Please provide room no'],
        unique: true, 
    },
    floor_no: {
        type: Number,
        required: [true, 'Please provide floor no'],
    },
    building: {
        type: String,
        required: [true, 'Please provide block name'],
        enum: {
            values: ['Main building', 'SMS building', 'CC building'],
            message: '{VALUE} is not supported'
        }
    },
    capacity: {
        type: Number,
        require: [true, 'Please provide available seats'],
    }
});

export const Room = mongoose.model('Room', RoomSchema);