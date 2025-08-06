import 'dotenv/config'
import { DB_NAME } from './constants.js';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { allowedOrigins } from './constants.js';
import cookieParser from 'cookie-parser';
import { credentials } from './middlewares/credentials.js';
import authRoute from './routes/auth.route.js';
import registerRoute from './routes/register.route.js';
import logoutRoute from './routes/logout.route.js';
import refreshTokenRoute from './routes/refreshToken.route.js';
import manageRoom from './routes/room.route.js';
import examSchedule from './routes/schedule.route.js';
import seatAllocation from './routes/allocation.route.js';
import verifyJWT from './middlewares/jwtVerification.js';
const app = express();
const PORT = process.env.PORT || 3500;

;( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    } catch (error) {
        console.error("ERROR: ", error)
    }
})()

app.use(credentials);
app.get('/', (req, res) => {
    res.json('Welcome to SeatWise API');    
})
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

app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh',refreshTokenRoute );
app.use('/logout', logoutRoute);

app.use(verifyJWT);
app.use('/manage-room', manageRoom);
app.use('/exam-schedule', examSchedule);
app.use('/room-allocation-review', seatAllocation);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}...`) });
});