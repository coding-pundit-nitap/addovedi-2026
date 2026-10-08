import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: 'GOLD' // 'PLATINUM' | 'GOLD' | 'SILVER' | 'TECHNICAL' | 'EVENT' | 'TRAVEL' | 'MEDIA' | 'BARTER'
    },
    sub: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: false,
        default: ''
    },
    logoImage: {
        type: String,
        required: false,
        default: '' // Cloudinary URL — takes priority over logo initials when set
    },
    desc: {
        type: String,
        required: true
    },
    support: {
        type: [String],
        required: true,
        default: []
    },
    pending: {
        type: Boolean,
        default: false // true = partnership not fully finalized; shown as "Joining soon"
    },
    url: {
        type: String,
        required: true,
        default: '#'
    }
}, { timestamps: true });

export default mongoose.model('Sponsor', SponsorSchema);
