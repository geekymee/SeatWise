import {Schedule} from '../models/schedule.model.js'
import {Room} from '../models/room.model.js'
import {Allocation} from '../models/allocation.model.js'
import {generateSeating} from '../generateSeating.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer'
import countStudents from '../countStudents.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.resolve(__dirname, '../updatedExcels');
const fileNameRegex = /^([0][1-9]|[12][0-9]|3[01])-([0][1-9]|[1][0-2])+-([0-9]{4})+_[FA]N\.xlsx$/;

export const getDates = async (req, res) => {
    const user = req.user.username;

    try {
        const dates = await Schedule.distinct('date', { user });
        const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
        const formattedDates = sortedDates.map(date => {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        });
        return res.status(200).send(formattedDates);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

export const getExams = async (req, res) => {
    const { date } = req.query;
    console.log(req.query);
    const user = req.user.username._id || req.user._id; 
    if (!date ) {
        return res.status(400).json({ 'message': 'provide date ' });
    }

    try {
        const formattedDate = date.split('-').reverse().join('-');
        const dateObject = new Date(formattedDate).toISOString();

        const schedules = await Schedule.find({ date: dateObject, user: user }).select('sem branch slot subcode').lean();
        const rooms = await Room.find({ user }).select('room_no capacity');
        const exams = schedules.reduce((acc, { sem, branch, slot }) => {
            const exam = `S${sem}-${branch}-${slot}`;
            acc.push(exam);
            return acc;
        }, []);

        if (exams?.length === 0) {
            exams.push("No exams scheduled");
            return res.status(200).json({ exams, details: null, totalStudents: 0 });
        }
        const details = schedules.map(({ sem, branch, slot, subcode }) => {
            return { sem, branch, slot, subcode };
        }); 
        const room = rooms.map(({ room_no, capacity }) => {
            return { room_no, capacity };
        });
        const totalStudents = await countStudents({ details },{ rooms: room });

        console.log(totalStudents);

        return res.status(200).json({ exams, details, totalStudents });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'message': error.message });
    }
};

export const getRooms = async (req, res) => {
    const user = req.user._id;
    try {
        const rooms = await Room.find({ user }).select('room_no capacity');
        return res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ 'message': err.message });
    }
};

export const createAllocation = async (req, res) => {
    const user = req.user.username;
    const { date, rooms, details } = req.body;
    if (!date  || !rooms || !details) {
        return res.status(400).json({ 'message': 'provide date and rooms' });
    } 
    const totalCapacity = rooms.reduce((total, obj) => total + obj.capacity, 0);
    console.log("here", totalCapacity);
    const formattedDate = date.split('-').reverse().join('-');
    const dateObject = new Date(formattedDate).toISOString();
    try {
        
        const schedule = await Schedule.findOne({ user, date: dateObject });

        if (schedule) {

            await generateSeating(req.body); // function for manipulating the uploadedExcel file for seat arrangement

            const newAllocation = new Allocation({
                user: req.user.username,
                date: dateObject,
                rooms,
                seats: totalCapacity
            });

            await newAllocation.save();

            res.status(201).json({ "message": 'Allocation created successfully', "Allocation": newAllocation });
        }
        else {
            res.status(404).json({ "error": 'No schedule found for the given date' });
        }

    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
};

export const getAllocation = async (req, res) => {
    const { date} = req.query;
    console.log(req.query);
    const user = req.user.username;
    if (!date ) {
        return res.status(400).json({ 'message': 'provide date' });
    }
    try {
        const formattedDate = date.split('-').reverse().join('-');
        const dateObject = new Date(formattedDate).toISOString();
        const allocations = await allocations.find({ user, date: dateObject }).select('rooms seats').lean();
        const rooms = allocations?.flatMap(allocation => allocation.rooms.map(item => item.room_no));
        const seatSelected = allocations.length === 0 ? 0 : allocations[0].seats;
        return res.status(200).json({ rooms, seats: seatSelected });
    }
    catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
};

export const sendExcels = async (req, res) => {
    const email = req.user.email;

    try {

        const files = await fs.promises.readdir(directoryPath);
        console.log(files);

        if (files.length === 0) {
            return res.status(404).json({ message: 'No files found in the directory' });
        }

        const transporter = nodemailer.createTransport({
            // Configure your email provider details here
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        const attachments = files.map((file) => {
            const filePath = path.join(directoryPath, file);
            if (fs.existsSync(filePath) && fileNameRegex.test(file)) {
                return { path: filePath };
            }
            return null;
        }).filter((attachment) => attachment !== null);

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Seat arrangement Excel Files',
            text: 'Please find the files attached.',
            attachments: attachments
        };

        const sendMailPromise = new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });

        await sendMailPromise;

        return res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'An error occurred while sending the email' });
    }
}

