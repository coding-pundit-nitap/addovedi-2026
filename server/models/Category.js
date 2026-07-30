import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: '#00d9ff'
    },
    xp: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        default: 'MEDIUM'
    },
    iconType: {
        type: String,
        required: true,
        default: 'code' // 'code' | 'robot' | 'bolt' | 'gamepad'
    },
    modelType: {
        type: String,
        required: true,
        default: 'coding' // 'gun' | 'mecha' | 'controller' | 'coding' | 'civil' | 'electrical' | 'ai'
    }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
