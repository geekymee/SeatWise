import {Schedule} from '../models/schedule.model.js';
import path from 'path';
import { createBranches } from '../createBranches.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addSchedule = async (req, res) => {
    const { sem, date, branch, slot, subcode } = req.body;
    const user = req.user.username;
    
    try {
        const existingSchedule = await Schedule.findOne({ 
            $or: [
                { user, sem, date, branch, slot, subcode },
                { user, sem, date, branch }
            ] 
        });
        if (existingSchedule) {
            return res.status(409).send('Schedule already exists');
        }

        const createdSchedule = await Schedule.create({ user, sem, date, branch, slot, subcode });
        const formattedDate = createdSchedule.date.toLocaleDateString('en-GB');
        res.status(201).send({ ...createdSchedule._doc, date: formattedDate });
    } catch (error) {
        console.error("[Schedule Creation Error]:", error);
        res.status(400).send({ error: error.message || error });
    }
}

export const viewSchedules = async (req, res) => {
    const user = req.user.username;

    try {
        const schedules = await Schedule.find({ user: user });
        const formattedSchedules = schedules.map((schedule) => {
            const date = schedule.date.toLocaleDateString("en-GB");
            return { ...schedule._doc, date };
        });
        res.status(200).send(formattedSchedules);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteSchedule = async (req, res) => {
    const user = req.user.username;
    const scheduleId = req.params.id;

    try {
        const schedule = await Schedule.findOneAndDelete({ _id: scheduleId, user: user });

        if (!schedule) {
            return res.status(404).send('Schedule not found');
        }

        res.status(200).send(`Schedule with id ${scheduleId}, user ${schedule.user}, and subcode ${schedule.subcode} deleted successfully`);

    } catch (error) {
        res.status(400).send(error);
    }
}


export const uploadFile = async (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, "..", 'uploadedExcels', files[key].name);
        console.log("filepath :" , filepath)
        files[key].mv(filepath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err });
        })
    })

    try {
        await createBranches(Object.keys(files));
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message || error });
    }

    return res.status(201).json({ status: "success", message: Object.keys(files).toString() });
}

