import mongoose from "mongoose";


const SubjectSchema = new mongoose.Schema({
    branch: {
        type: String,
    },
    Subject: {
        type: String,
    },
    sem: {
        type: Number,
    },
    subcode: {
        type: [String],
    }
});

export const Subject = mongoose.model('Subject', SubjectSchema);