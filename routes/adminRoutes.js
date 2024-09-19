import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js";
import {getAllUsers} from "../controllers/userController.js";
import {createAdminUser} from "../controllers/adminController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
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
router.get('/users', protect, admin, getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/create-admin:
 *   post:
 *     summary: Create a new admin user (admin only)
 *     tags: [Admin]
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
router.post('/users/create-admin', protect, admin, createAdminUser);

export default router;
