import mongoose from "mongoose";


const ScheduleSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    sem: {
        type: Number,
        required: [true, 'Provide semester number'],
    },
    date: {
        type: Date,
        required: [true, 'Provide Date'],
       
    },
    branch: {
        type: String,
        required: [true, 'Provide Branch'],
    },
    slot: {
        type: String,
        required: [true, 'Provide slot info'],
    },
    subcode: {
        type: String,
        required: [true, 'Provide subcode info'],
    },
    createdAt : {
    type: Date,
    default: Date.now,
    expires: '100d' 
  }
},
    { timestamps: true }
);

export const Schedule = mongoose.model('Schedule', ScheduleSchema);
