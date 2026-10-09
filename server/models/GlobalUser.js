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
        maxlength: 100,
        required: true,
        trim: true
    },
    email: {
        type: String,
        maxlength: 254,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        maxlength: 20,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    college: { type: String, maxlength: 150, trim: true, default: '' },
    department: { type: String, maxlength: 100, trim: true, default: '' },
    year: { type: String, maxlength: 20, trim: true, default: '' },
    state: { type: String, maxlength: 100, trim: true, default: '' },
    city: { type: String, maxlength: 100, trim: true, default: '' },
    gender: { type: String, maxlength: 30, trim: true, default: '' },
    dob: { type: String, maxlength: 30, trim: true, default: '' },
    emergencyContact: { type: String, maxlength: 20, trim: true, default: '' },
    // Set when an admin resets the password; the player is asked to choose their own at next login.
    mustChangePassword: { type: Boolean, default: false },
    // Sessions issued before this moment are rejected (see middleware/auth.js requireParticipant).
    passwordChangedAt: { type: Date },
    avatar: { type: String, maxlength: 40, trim: true, default: 'specter' }
}, { timestamps: true });

export default mongoose.model('GlobalUser', GlobalUserSchema);
