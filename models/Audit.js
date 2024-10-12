import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    changeType: {
        type: String,
        enum: ['create', 'update', 'delete'],
        required: true,
    },
    changes: {
        type: Object,
        required: true,
    }
},
{
    timestamps: true,
});

const Audit = mongoose.model('Audit', auditSchema);
export default Audit;
