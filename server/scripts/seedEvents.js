// Replaces ALL categories and sub-events with the Addovedi 2026 event list from
// scripts/data/events2026.json (source: EVENT DETAILS.docx). Rules, coordinators
// and schedule are intentionally left empty; add them later from Admin.
// Run: node scripts/seedEvents.js   (from server/, needs MONGODB_URI in .env)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import Category from '../models/Category.js';
import SubEvent from '../models/SubEvent.js';

dotenv.config();

const DATA = JSON.parse(readFileSync(new URL('./data/events2026.json', import.meta.url), 'utf8'));

await mongoose.connect(process.env.MONGODB_URI);
const oldCats = await Category.deleteMany({});
const oldSubs = await SubEvent.deleteMany({});

let order = 0;
const stamp = () => new Date(Date.now() + order++);
for (const { events, ...cat } of DATA) {
    const { shortName, iconChar, id, ...catFields } = cat; // display-only; the client derives these
    await Category.create({ ...catFields, createdAt: stamp() });
    for (const ev of events) {
        await SubEvent.create({
            ...ev,
            categoryTitle: cat.title,
            color: cat.color,
            modelType: cat.modelType,
            heads: [],
            createdAt: stamp(),
        });
    }
}
console.log(`Removed ${oldCats.deletedCount} categories / ${oldSubs.deletedCount} sub-events; inserted ${DATA.length} categories / ${DATA.reduce((n, c) => n + c.events.length, 0)} sub-events.`);
await mongoose.disconnect();
