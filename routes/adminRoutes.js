import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {admin} from "../middleware/roleMiddleware.js";
import {getAllUsers} from "../controllers/userController.js";
import {createAdminUser, deleteUser, getAudits, updateUserRole, checkAdminUser} from "../controllers/adminController.js";

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
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user is not admin
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', protect, admin, deleteUser);

/**
 * @swagger
 * /api/v1/admin/audits:
 *   get:
 *     summary: Get all audits
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Audit'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user is not admin
 */
router.get('/audits', protect, admin, getAudits);

/**
 * @swagger
 * /api/v1/admin/users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ['user', 'admin']
 *                 example: 'admin'
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role or request data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user is not admin
 *       404:
 *         description: User not found
 */
router.put('/users/:id/role', protect, admin, updateUserRole);

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


/**
 * @swagger
 * /api/v1/admin/users/check-admin:
 *   get:
 *     summary: Check if the authenticated user is an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user is an admin
 *               example:
 *                 isAdmin: true
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Server error
 */
router.get('/users/check-admin', protect, checkAdminUser);

export default router;
