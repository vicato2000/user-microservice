import Audit from '../models/Audit.js';

// Obtener todos los registros de auditoría de un usuario específico
export const getUserAuditLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const audits = await Audit.find({ userId }).populate('changedBy', 'username email');
        res.json(audits);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving audit logs' });
    }
};
