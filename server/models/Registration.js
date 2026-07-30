import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true,
        trim: true
    },
    categoryTitle: {
        type: String,
        required: true,
        trim: true
    },
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    leaderName: {
        type: String,
        required: true,
        trim: true
    },
    leaderUID: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    leaderPhone: {
        type: String,
        required: true,
        trim: true
    },
    teamSize: {
        type: Number,
        default: 1
    },
    members: [{
        name: { type: String, trim: true },
        uid: { type: String, trim: true }
    }],
    userEmail: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Registration', registrationSchema);
