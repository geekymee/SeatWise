import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); 
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            
            if (err || !foundUser._id.equals(decoded.id)) return res.sendStatus(403);
            const accessToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.json({ user: foundUser.username, accessToken });
        }
    );
}

export default handleRefreshToken;