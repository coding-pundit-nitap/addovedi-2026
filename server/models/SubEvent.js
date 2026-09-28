import mongoose from 'mongoose';

const HeadCoordinatorSchema = new mongoose.Schema({
    name: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' }
});

const SubEventSchema = new mongoose.Schema({
    categoryTitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
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
    heads: [HeadCoordinatorSchema],
    iconType: {
        type: String,
        required: true,
        default: 'code'
    },
    modelType: {
        type: String,
        required: false,
        default: 'coding' // 'gun' | 'mecha' | 'controller' | 'coding' | 'civil' | 'electrical' | 'ai'
    }
}, { timestamps: true });

export default mongoose.model('SubEvent', SubEventSchema);

