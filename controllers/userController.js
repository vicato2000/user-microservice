// controllers/userController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import {validationResult} from "express-validator";

export const registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, surname, email, username, password} = req.body;

    const userExists = await User.findOne({email});
    if (userExists) {
        return res.status(400).json({message: 'The user already exists'});
    }

    const salt = await bcrypt.genSalt(10);

    const user = await User.create({
        name,
        surname,
        email,
        username,
        password: await bcrypt.hash(password, salt),
        role: 'user',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({message: 'Invalid user data'});
    }
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({message: 'Invalid email or password'});
    }
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
    });

};

export const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
}

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
        token: generateToken(user._id),
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
}
