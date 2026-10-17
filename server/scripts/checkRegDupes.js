// Run before deploying the unique-leader index: lists live registrations that would violate it.
import 'dotenv/config';
import mongoose from 'mongoose';
import Registration from '../models/Registration.js';
await mongoose.connect(process.env.MONGODB_URI);
const d = await Registration.aggregate([
  { $match: { status: { $in: ['PENDING_UNSTOP_VERIFICATION', 'VERIFIED'] } } },
  { $group: { _id: { e: '$eventTitle', l: { $toUpper: '$leaderUID' } }, n: { $sum: 1 } } },
  { $match: { n: { $gt: 1 } } }
]);
console.log(d.length ? d : 'No duplicate live leader registrations.');
await mongoose.disconnect();
