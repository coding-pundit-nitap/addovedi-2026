// Targeted, non-destructive update of specific events in whichever DB .env points at: team size, coordinators, prize,
// overview, and (when present in the data file) registration fee and Unstop link. Touches nothing else.
// Dry run by default: `node scripts/updateEventDetails.js`  -> add --confirm to write.
// Titles default to the events below; pass others as arguments: `node scripts/updateEventDetails.js "SOME EVENT" --confirm`.
import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import SubEvent from '../models/SubEvent.js';

const DATA = JSON.parse(readFileSync(new URL('./data/events2026.json', import.meta.url), 'utf8'));
const confirm = process.argv.includes('--confirm');
const named = process.argv.slice(2).filter(a => !a.startsWith('--'));
const wanted = named.length ? named : ['ROBO SOCCER', 'DUNE DOMINATOR', 'SOLID SIEGE', 'HYDRAULIC WARZONE', 'SKY FORGE'];

await mongoose.connect(process.env.MONGODB_URI);
console.log(`DB host: ${mongoose.connection.host} / ${mongoose.connection.name}   mode: ${confirm ? 'WRITE' : 'DRY RUN'}`);

for (const title of wanted) {
    const src = DATA.flatMap(c => c.events).find(e => e.title === title);
    const set = { minTeam: src.minTeam, maxTeam: src.maxTeam, heads: src.heads || [], 'timeline.prize': src.timeline?.prize || '' };
    if (src.overview) set.overview = src.overview;
    if (src.fee !== undefined) set.fee = src.fee;
    if (src.unstopUrl) set.unstopUrl = src.unstopUrl;
    const doc = await SubEvent.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean();
    if (!doc) { console.log(`\n${title}: NOT FOUND in DB, skipped`); continue; }
    console.log(`\n${title}  (_id ${doc._id})`);
    const brief = (o) => JSON.stringify({ ...o, overview: o.overview ? `${String(o.overview).length} chars` : undefined });
    console.log('  before:', brief({ minTeam: doc.minTeam, maxTeam: doc.maxTeam, fee: doc.fee, unstopUrl: doc.unstopUrl, heads: (doc.heads || []).map(h => ({ name: h.name, phone: h.phone })), prize: doc.timeline?.prize, overview: doc.overview }));
    console.log('  after :', brief({ ...set, prize: set['timeline.prize'], 'timeline.prize': undefined }));
    if (confirm) { await SubEvent.updateOne({ _id: doc._id }, { $set: set }, { runValidators: true }); console.log('  updated'); }
}
await mongoose.disconnect();
