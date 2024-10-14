import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import Audit from "../models/Audit.js";

export const createAdminUser = async (req, res) => {
    const { name, surname, email, username, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10);


    const user = await User.create({
        name,
        surname,
        email,
        username,
        password: await bcrypt.hash(password, salt),
        role: 'admin',
        token: '',
    });

    user.token = generateToken(user._id, user.username, user.email);
    await user.save();

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
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();

        await Audit.create({
            userId: user._id,
            changedBy: req.user._id,
            changeType: 'delete',
            changes: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAudits = async (req, res) => {
    try {
        const audits = await Audit.find({}).populate('userId').populate('changedBy');
        res.json(audits);
    } catch (error) {
        console.error(`Error retrieving audits: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};


export const checkAdminUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ isAdmin: user.role === 'admin' });
    } catch (error) {
        console.error(`Error checking admin user: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        user.role = role;
        await user.save();

        // // Registrar auditoría de cambio de rol
        // await Audit.create({
        //     userId: user._id,
        //     changedBy: req.user._id, // Admin que hizo el cambio
        //     changeType: 'update',
        //     changes: { role },
        // });

        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error(`Error updating user role: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserAudits = async (req, res) => {
    try {
        const userId = req.params.id;

        const audits = await Audit.find({ userId }).sort({ createdAt: -1 });
        if (!audits || audits.length === 0) {
            return res.status(404).json({ message: 'No audit logs found for this user' });
        }

        console.log(audits);

        res.json(audits);
    } catch (error) {
        console.error(`Error retrieving audit logs: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

