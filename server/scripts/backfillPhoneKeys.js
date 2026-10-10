// Gives every existing player a phoneKey (last 10 digits of their mobile number) so "one account per number" also
// covers accounts created before that rule. Safe to re-run. If several accounts already share a number, the OLDEST keeps
// the key and the others are listed (their numbers stay as they are; resolve them by hand: delete or change one).
// Run: node scripts/backfillPhoneKeys.js   (from server/, against whichever DB MONGODB_URI points at)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GlobalUser from '../models/GlobalUser.js';
import { phoneKey } from '../utils/validators.js';

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
const users = await GlobalUser.find({}).sort({ createdAt: 1 }).select('addovediId name phone phoneKey').lean();
const taken = new Map(users.filter(u => u.phoneKey).map(u => [u.phoneKey, u.addovediId]));
let set = 0; const conflicts = [];
for (const u of users) {
    if (u.phoneKey) continue;
    const key = phoneKey(u.phone);
    if (key.length !== 10) { conflicts.push(`${u.addovediId} ${u.name}: unusable number "${u.phone}"`); continue; }
    if (taken.has(key)) { conflicts.push(`${u.addovediId} ${u.name}: ${u.phone} is already used by ${taken.get(key)}`); continue; }
    await GlobalUser.updateOne({ _id: u._id }, { $set: { phoneKey: key } });
    taken.set(key, u.addovediId); set++;
}
console.log(`Set phoneKey on ${set} account(s).`);
if (conflicts.length) console.log('NOT set (duplicate or invalid numbers):\n  ' + conflicts.join('\n  '));
await GlobalUser.syncIndexes();
await mongoose.disconnect();
