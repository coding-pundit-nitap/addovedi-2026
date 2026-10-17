import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Admin tokens issued before this moment are rejected (see middleware/auth.js protect).
    passwordChangedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Admin', AdminSchema);
