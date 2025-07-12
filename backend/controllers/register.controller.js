import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

const handleNewUser = async (req, res) => {
    const { user, email, pwd } = req.body;
    if (!user || !email || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const duplicate = await User.findOne({ username: user }).exec();

    if (duplicate) return res.status(409).json({ 'message': 'this username is taken.' });
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const newUser = await User.create({ username: user, email, password: hashedPwd });
        console.log(newUser);
        res.status(201).json({ 'success': `New user ${newUser.username} created successfully.` });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ 'message': err.message });
    }
}

export default handleNewUser;