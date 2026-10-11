// Targeted, non-destructive update of the two Robotics Protocol events in whichever DB .env points at:
// registration fee, prize, Unstop link, team size, coordinators. Touches nothing else.
// Dry run by default: `node scripts/updateRoboticsEvents.js`  -> add --confirm to write.
import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import SubEvent from '../models/SubEvent.js';

const DATA = JSON.parse(readFileSync(new URL('./data/events2026.json', import.meta.url), 'utf8'));
const confirm = process.argv.includes('--confirm');
const wanted = ['ROBO SOCCER', 'DUNE DOMINATOR'];

await mongoose.connect(process.env.MONGODB_URI);
console.log(`DB host: ${mongoose.connection.host} / ${mongoose.connection.name}   mode: ${confirm ? 'WRITE' : 'DRY RUN'}`);

for (const title of wanted) {
    const src = DATA.flatMap(c => c.events).find(e => e.title === title);
    const set = {
        minTeam: src.minTeam, maxTeam: src.maxTeam, fee: src.fee, unstopUrl: src.unstopUrl,
        heads: src.heads, 'timeline.prize': src.timeline.prize,
    };
    const doc = await SubEvent.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean();
    if (!doc) { console.log(`\n${title}: NOT FOUND in DB, skipped`); continue; }
    console.log(`\n${title}  (_id ${doc._id})`);
    console.log('  before:', JSON.stringify({ minTeam: doc.minTeam, maxTeam: doc.maxTeam, fee: doc.fee, unstopUrl: doc.unstopUrl, heads: doc.heads, prize: doc.timeline?.prize }));
    console.log('  after :', JSON.stringify({ ...set, prize: set['timeline.prize'], 'timeline.prize': undefined }));
    if (confirm) { await SubEvent.updateOne({ _id: doc._id }, { $set: set }, { runValidators: true }); console.log('  updated'); }
}
await mongoose.disconnect();
