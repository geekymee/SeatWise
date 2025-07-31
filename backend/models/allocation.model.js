import mongoose from "mongoose";

const AllocationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: [true, 'Provide Date'],
        
    },
    rooms: {
        type: [{ room_no: String, capacity: Number }],
        required: [true, 'Provide room array'],
    },
    seats: {
        type: Number,
        required: [true, 'Please provide no of seats']
    },
    createdAt : {
    type: Date,
    default: Date.now,
    expires: '100d' 
  }
},
    { timestamps: true }
);

export const Allocation =  mongoose.model('Allocation', AllocationSchema);
