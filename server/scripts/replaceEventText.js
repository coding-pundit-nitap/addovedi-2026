// Replaces one word/phrase inside the TEXT fields of ONE event in whichever DB .env points at (overview, desc, subtitle, timeline.prize).
// Touches nothing else. Dry run by default: `node scripts/replaceEventText.js "BRAINWAVE BONANZA" hoodies goodies`; add --confirm to write.
import 'dotenv/config';
import mongoose from 'mongoose';
import SubEvent from '../models/SubEvent.js';

const confirm = process.argv.includes('--confirm');
const [title, from, to] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!title || !from || to === undefined) { console.error('Usage: node scripts/replaceEventText.js "EVENT TITLE" from to [--confirm]'); process.exit(1); }
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(`\\b${esc(from)}\\b`, 'gi');
const FIELDS = ['overview', 'desc', 'subtitle', 'timeline.prize'];
const get = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);

await mongoose.connect(process.env.MONGODB_URI);
console.log(`DB host: ${mongoose.connection.host} / ${mongoose.connection.name}   mode: ${confirm ? 'WRITE' : 'DRY RUN'}   "${from}" -> "${to}"   event: ${title}`);
const doc = await SubEvent.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean();
if (!doc) { console.log('Event not found.'); await mongoose.disconnect(); process.exit(1); }
const set = {};
for (const f of FIELDS) {
    const v = get(doc, f);
    if (typeof v === 'string' && re.test(v)) { re.lastIndex = 0; const n = v.replace(re, to); set[f] = n; console.log(`  ${f}: ${(v.match(re) || []).length} match(es)\n    before: ...${v.slice(Math.max(0, v.search(re) - 35), v.search(re) + 30)}...\n    after : ...${n.slice(Math.max(0, v.search(re) - 35), v.search(re) + 30)}...`); }
    re.lastIndex = 0;
}
if (!Object.keys(set).length) console.log('  nothing to change.');
else if (confirm) { await SubEvent.updateOne({ _id: doc._id }, { $set: set }, { runValidators: true }); console.log(`  updated fields: ${Object.keys(set).join(', ')}`); }
await mongoose.disconnect();
