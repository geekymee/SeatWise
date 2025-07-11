import 'dotenv/config'
import { DB_NAME } from './constants.js';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { allowedOrigins } from './constants.js';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 5500;


;( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    } catch (error) {
        console.error("ERROR: ", error)
    }
})()

app.use(credentials);


app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());












mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}...`) });
});