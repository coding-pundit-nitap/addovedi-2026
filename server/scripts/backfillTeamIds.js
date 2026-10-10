// One-off: give Team IDs to existing registrations that are already final (everyone accepted). Safe to re-run.
import 'dotenv/config';
import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
import { finalizeIfReady } from '../services/teamService.js';
await mongoose.connect(process.env.MONGODB_URI);
const regs = await Registration.find({ teamId: { $exists: false }, status: { $ne: 'CANCELLED' } }).sort({ createdAt: 1 });
let n = 0;
for (const r of regs) if (await finalizeIfReady(r)) n++;
console.log(`Assigned Team IDs to ${n} of ${regs.length} registrations without one.`);
await mongoose.disconnect();
