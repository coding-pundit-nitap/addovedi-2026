// Adds the 2026 head coordinators from client/src/data/crew2026.json to the Crew collection.
// Safe by default: upserts by name+category, never deletes (keeps admin-uploaded avatars/bios).
// Pass --replace to first wipe the whole Crew collection (removes the old placeholder crew).
// Run: node scripts/seedCrew.js [--replace]   (from server/, against whichever DB MONGODB_URI points at)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Crew from '../models/Crew.js';

dotenv.config();

const sections = JSON.parse(fs.readFileSync(new URL('../../client/src/data/crew2026.json', import.meta.url), 'utf8'));

await mongoose.connect(process.env.MONGODB_URI);
if (process.argv.includes('--replace')) {
    const { deletedCount } = await Crew.deleteMany({});
    console.log(`Removed ${deletedCount} existing crew docs.`);
}
// Ascending createdAt keeps section/member order (the crew list sorts by createdAt).
let t = Date.now();
let added = 0;
for (const sec of sections) {
    for (const { name, role } of sec.members) {
        const res = await Crew.updateOne(
            { name, category: sec.title },
            { $setOnInsert: { name, role, category: sec.title, statText: 'MISSIONS CODE', statVal: 0, createdAt: new Date(t++) } },
            { upsert: true }
        );
        if (res.upsertedCount) added++;
    }
}
console.log(`Added ${added} crew members.`);
await mongoose.disconnect();
