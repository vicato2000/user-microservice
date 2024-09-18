import express from 'express';
import { registerUser, loginUser, getUserProfile, getAllUsers, createAdminUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import { admin } from '../middleware/roleMiddleware.js';

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

/**
 * @swagger
 * /api/v1/users/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: "60f8c1b82e3d4c23d8d52e5a"
 *                 name: "John"
 *                 surname: "Doe"
 *                 email: "john.doe@example.com"
 *                 username: "johndoe123"
 *               - id: "60f8c1b82e3d4c23d8d52e5b"
 *                 name: "Jane"
 *                 surname: "Doe"
 *                 email: "jane.doe@example.com"
 *                 username: "janedoe123"
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Access forbidden, requires admin privileges
 *       404:
 *         description: No users found
 */
router.get('/admin/users', protect, admin, getAllUsers);

/**
 * @swagger
 * /api/v1/users/admin/users/create-admin:
 *   post:
 *     summary: Create a new admin user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             name: "Admin"
 *             surname: "User"
 *             email: "admin@example.com"
 *             username: "adminuser"
 *             password: "adminpassword"
 *     responses:
 *       201:
 *         description: Admin user successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: "60f8c1b82e3d4c23d8d52e5a"
 *               name: "Admin"
 *               surname: "User"
 *               email: "admin@example.com"
 *               username: "adminuser"
 *               role: "admin"
 *               token: "your-jwt-token-here"
 *       400:
 *         description: User already exists or invalid data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Only admins can create new admin users
 */
router.post('/admin/users/create-admin', protect, admin, createAdminUser);

export default router;
