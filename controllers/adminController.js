import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const createAdminUser = async (req, res) => {
    const { name, surname, email, username, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists w' })
    }

    const salt = await bcrypt.genSalt(10);


    const user = await User.create({
        name,
        surname,
        email,
        username,
        password: await bcrypt.hash(password, salt),
        role: 'admin',
        token: generateToken(user._id, user.username, user.email),
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            role: user.role,
            token: generateToken(user._id, user.username, user.email),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
}
