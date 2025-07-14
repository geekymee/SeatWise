import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';

const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization ;
    console.log(authHeader)
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            console.log(process.env.ACCESS_TOKEN_SECRET)
            if (err) return res.sendStatus(403); // invalid token
            try {
                req.user = await User.findById(decoded.id).select('-password');
                next();
            } catch (error) {
                res.status(500).json({ 'message': error.message });
            }
        });
}

export default verifyJWT;