import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID by MongoDB
 *         name:
 *           type: string
 *           description: The user's first name
 *         surname:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username (nick)
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         id: 60f8c1b82e3d4c23d8d52e5a
 *         name: John
 *         surname: Doe
 *         email: john.doe@example.com
 *         username: johndoe123
 *         password: 123456
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "John"
 *             surname: "Doe"
 *             email: "john.doe@example.com"
 *             username: "johndoe123"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "60f8c1b82e3d4c23d8d52e5a"
 *               name: "John"
 *               surname: "Doe"
 *               email: "john.doe@example.com"
 *               username: "johndoe123"
 *               role: "user"
 *               token: "your-jwt-token-here"
 *       400:
 *         description: Bad request, invalid data or user already exists
 */
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('surname', 'Surname is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required and should be at least 6 characters').isLength({ min: 6 }),
    ],
    registerUser
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "john.doe@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *             example:
 *               id: "60f8c1b82e3d4c23d8d52e5a"
 *               name: "John"
 *               surname: "Doe"
 *               email: "john.doe@example.com"
 *               username: "johndoe123"
 *               token: "your-jwt-token-here"
 *       401:
 *         description: Invalid credentials
 */
router.post(
    '/login',
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "60f8c1b82e3d4c23d8d52e5a"
 *               name: "John"
 *               surname: "Doe"
 *               email: "john.doe@example.com"
 *               username: "johndoe123"
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.get('/profile', protect, getUserProfile);



export default router;
