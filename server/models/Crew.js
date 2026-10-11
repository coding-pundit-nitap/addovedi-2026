import mongoose from 'mongoose';

const SocialLinkSchema = new mongoose.Schema({
    platform: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' }
});

const CrewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['STUDENT', 'FACULTY'],
        default: 'STUDENT'
    },
    category: {
        type: String,
        required: true,
        default: 'CORE' // 'CORE' | 'TECHNICAL' | 'DESIGN' | 'MEDIA' etc.
    },
    statText: {
        type: String,
        required: true,
        default: 'MISSIONS CODE'
    },
    statVal: {
        type: Number,
        required: true,
        default: 0
    },
    featured: {
        type: Boolean,
        required: true,
        default: false
    },
    featuredHeading: {
        type: String,
        required: false,
        default: ''
    },
    bio: {
        type: String,
        required: false,
        default: ''
    },
    // Shown on the crew card (tap-to-call)
    phone: { type: String, maxlength: 20, trim: true, default: '' },
    links: [SocialLinkSchema]
}, { timestamps: true });

export default mongoose.model('Crew', CrewSchema);
