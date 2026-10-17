import mongoose from 'mongoose';

const SponsorCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true, uppercase: true, maxlength: 40 },
    // 1 = highest: largest card, shown first. 5 = lowest: smallest card, shown last.
    priority: { type: Number, required: true, min: 1, max: 5, default: 3 },
    color: { type: String, default: '#00E5FF' }
}, { timestamps: true });

export default mongoose.model('SponsorCategory', SponsorCategorySchema);
