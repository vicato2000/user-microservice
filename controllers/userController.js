// controllers/userController.js
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import {validationResult} from "express-validator";
import Audit from "../models/Audit.js";

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
            token: generateToken(user._id, user.username, user.email),
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
            token: generateToken(user._id, user.username, user.email),
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
        username: user.username,
        email: user.email,
    });

};

export const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
}

export const changePassword = async (req, res) => {
    const user = await User.findById(req.user._id);

    const {oldPassword, newPassword} = req.body;

    if (oldPassword === newPassword) {
        return res.status(400).json({message: 'The new password must be different from the old password'});
    }

    if (user && bcrypt.compareSync(oldPassword, user.password)) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({message: 'Password changed successfully'});
    } else {
        res.status(401).json({message: 'Invalid password'});
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findById(req.user._id);

    const {name, surname, email, username} = req.body;

    if (user) {
        if (email !== user.email) {
            const userExists = await User.findOne({email});
            if (userExists) {
                return res.status(409).json({message: 'The user email already exists'});
            }
        }
        if (username !== user.username) {
            const userExists = await User.findOne({username});
            if (userExists) {
                return res.status(409).json({message: 'The user username already exists'});
            }
        }
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.username = username;
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            username: user.username,
            token: generateToken(user._id, user.username, user.email),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}

export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        // Encuentra al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica la contraseña proporcionada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Elimina la cuenta del usuario
        await User.findByIdAndDelete(userId);

        // Registra la auditoría de la eliminación de cuenta
        await Audit.create({
            userId: user._id,
            changedBy: user._id,
            changeType: 'delete',
            changes: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            timestamp: new Date(),
        });

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error(`Error deleting user account: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};



