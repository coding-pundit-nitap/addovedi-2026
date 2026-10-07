import mongoose from 'mongoose';

// A real, server-persisted participant account — replaces the old
// localStorage-only "fake account" system. addovediId is guaranteed unique
// via an atomic counter (see services/globalUserService.js) plus a unique
// index here as a backstop.
const GlobalUserSchema = new mongoose.Schema({
    addovediId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    college: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    gender: { type: String, trim: true, default: '' },
    dob: { type: String, trim: true, default: '' },
    emergencyContact: { type: String, trim: true, default: '' },
    avatar: { type: String, trim: true, default: 'specter' }
}, { timestamps: true });

export default mongoose.model('GlobalUser', GlobalUserSchema);
