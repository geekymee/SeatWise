import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const accessToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
}

export default handleLogin;