import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {admin} from "../middleware/roleMiddleware.js";
import { getUserAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

// Ruta para obtener los logs de un usuario específico (solo administradores)
router.get('/:userId/logs', protect, admin, getUserAuditLogs);

export default router;
