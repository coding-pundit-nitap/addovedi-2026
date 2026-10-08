// Adds the default sponsor categories if missing. Does NOT touch sponsors (keeps uploaded logos).
// Run: node scripts/seedSponsorCategories.js   (from server/)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SponsorCategory from '../models/SponsorCategory.js';

dotenv.config();

const CATEGORIES = [
    { name: 'PLATINUM', priority: 1, color: '#E5F6FF' },
    { name: 'GOLD', priority: 2, color: '#FFD700' },
    { name: 'SILVER', priority: 3, color: '#B8C4D6' },
    { name: 'TECHNICAL', priority: 4, color: '#00E5FF' },
    { name: 'EVENT', priority: 4, color: '#7A5CFF' },
    { name: 'TRAVEL', priority: 4, color: '#1FFF76' },
    { name: 'MEDIA', priority: 5, color: '#FF2CFB' },
    { name: 'BARTER', priority: 5, color: '#FBBF24' },
];

await mongoose.connect(process.env.MONGODB_URI);
let added = 0;
for (const [i, c] of CATEGORIES.entries()) {
    const res = await SponsorCategory.updateOne({ name: c.name }, { $setOnInsert: { ...c, createdAt: new Date(Date.now() + i) } }, { upsert: true });
    if (res.upsertedCount) added++;
}
console.log(`Added ${added} categories (${CATEGORIES.length - added} already existed).`);
await mongoose.disconnect();
