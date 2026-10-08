// Replaces ALL sponsor/alliance records with the real Addovedi 2026 partners.
// Run once:  node scripts/seedSponsors.js   (from server/, needs MONGODB_URI in .env)
// Logos are not seeded; upload them per partner from Admin > Sponsor Alliances.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sponsor from '../models/Sponsor.js';

dotenv.config();

const p = (name, category, sub, desc, support, extra = {}) => ({
    name, category, sub, desc, support, logo: name.slice(0, 4), url: '#', ...extra,
});

const PARTNERS = [
    p('TRUSCHOLAR', 'PLATINUM', 'Official Credential Partner', 'Every Addovedi 2026 certificate is issued through the TruScholar blockchain-powered digital credential platform, with a lifetime Smart Credential Wallet, AI Career Coach and a job & internship portal for participants.', ['Digital certificates', 'Credential wallet']),
    p('SOLIDWORKS', 'GOLD', 'Gold Sponsor', 'Powering SOLID SIEGE, with student licenses and certification vouchers for winners and an onboarding webinar on SOLIDWORKS design.', ['SOLID SIEGE', 'Licenses', 'Certification vouchers']),
    p('AIMIL', 'SILVER', 'Sponsor', 'Supporting Addovedi 2026 as an official sponsor.', ['Event sponsor']),
    p('NODWIN GAMING × KRAFTON', 'SILVER', 'Gaming Partner', 'Prize pools and branding for the BGMI and Real Cricket tournaments.', ['BGMI', 'Real Cricket'], { pending: true }),
    p('ZEBRONICS', 'TECHNICAL', 'Official Tech Partner', 'Stage pillars, campus standees and product goodies for the fest.', ['Stage pillars', 'Standees', 'Goodies'], { pending: true }),
    p('UNSTOP', 'TECHNICAL', 'Platform Partner', 'Event listing and registration platform, with goodies for participants.', ['Registrations', 'Goodies']),
    p('DENVER', 'EVENT', 'Fragrance Partner', 'Free sampling for attendees, an experience zone, games and hampers for winners.', ['Experience zone', 'Hampers']),
    p('JIOSAAVN', 'EVENT', 'Official Music Streaming Partner', 'Pro codes as prizes and presence across music events and Pronite.', ['Pronite', 'Music events']),
    p('EASEMYTRIP', 'TRAVEL', 'Official Travel Partner', '300 travel vouchers for flights and hotels, valid for 5 months.', ['Travel vouchers']),
    p('CAMPUS KARMA', 'MEDIA', 'Media Partner', 'Promotional posts and articles before and after the fest.', ['Social posts', 'Articles']),
    p('ABHIBUS', 'BARTER', 'Barter Partner', 'Bus travel vouchers and student referral offers.', ['Bus vouchers'], { pending: true }),
];

await mongoose.connect(process.env.MONGODB_URI);
const removed = await Sponsor.deleteMany({});
await Sponsor.insertMany(PARTNERS.map((x, i) => ({ ...x, createdAt: new Date(Date.now() + i) })));
console.log(`Removed ${removed.deletedCount} old sponsors, inserted ${PARTNERS.length}.`);
await mongoose.disconnect();
