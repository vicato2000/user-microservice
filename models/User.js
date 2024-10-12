// models/User.js
import mongoose from 'mongoose';
import Audit from "./Audit.js";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role :{
      type: String  ,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

userSchema.post('save', async function (doc, next){

    const changeType = doc.isNew ? 'create' : 'update';

    const auditEntry = {
        userId: doc._id,
        changedBy: doc._id,
        changeType: changeType,
        changes: doc,
    };

    await Audit.create(auditEntry);
    next();
});

userSchema.post('findOneAndUpdate', async function (doc, next) {
    const update = this.getUpdate();

    const auditEntry = {
        userId: doc._id,
        changedBy: doc._id,
        changeType: 'update',
        changes: update,
    };

    await Audit.create(auditEntry);
    next();
})

userSchema.post('findOneAndDelete', async function (doc, next) {
    const userId = doc._id;

    const auditEntry = {
        userId: userId,
        changedBy: userId,
        changeType: 'delete',
        changes: doc,
    };

    await Audit.create(auditEntry);
    next();
})

const User = mongoose.model('User', userSchema);

export default User;
