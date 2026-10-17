// Replaces ALL sponsor categories and sponsor/alliance records with the real Addovedi 2026 partners.
// Run once:  node scripts/seedSponsors.js   (add --logos-only to only fill in missing logos)
// Full run:   (from server/, needs MONGODB_URI in .env)
// Logos are not seeded; upload them per partner from Admin > Sponsor Alliances.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sponsor from '../models/Sponsor.js';
import SponsorCategory from '../models/SponsorCategory.js';

dotenv.config();

// Logos live in client/public/sponsors (served by the frontend); admin uploads replace them with Cloudinary URLs.
const LOGO_FILES = {"TRUSCHOLAR": "truscholar.png", "SOLIDWORKS": "solidworks.svg", "AIMIL": "aimil.png", "NODWIN GAMING × KRAFTON": "nodwin.svg", "ZEBRONICS": "zebronics.png", "UNSTOP": "unstop.svg", "DENVER": "denver.png", "JIOSAAVN": "jiosaavn.svg", "EASEMYTRIP": "easemytrip.png", "CAMPUS KARMA": "campuskarma.jpg", "ABHIBUS": "abhibus.png"};

const p = (name, category, sub, desc, support, extra = {}) => ({
    name, category, sub, desc, support, logo: name.slice(0, 4), logoImage: `/sponsors/${LOGO_FILES[name]}`, url: '#', ...extra,
});

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
if (process.argv.includes('--logos-only')) {
    // Non-destructive: only fills in logoImage for sponsors that don't have one yet.
    for (const [name, file] of Object.entries(LOGO_FILES)) {
        const r = await Sponsor.updateOne({ name, $or: [{ logoImage: '' }, { logoImage: { $exists: false } }] }, { $set: { logoImage: `/sponsors/${file}` } });
        console.log(`${name}: ${r.modifiedCount ? 'logo set' : 'skipped (missing or already has logo)'}`);
    }
    await mongoose.disconnect();
    process.exit(0);
}
await SponsorCategory.deleteMany({});
await SponsorCategory.insertMany(CATEGORIES.map((c, i) => ({ ...c, createdAt: new Date(Date.now() + i) })));
const removed = await Sponsor.deleteMany({});
await Sponsor.insertMany(PARTNERS.map((x, i) => ({ ...x, createdAt: new Date(Date.now() + i) })));
console.log(`Removed ${removed.deletedCount} old sponsors, inserted ${PARTNERS.length}.`);
await mongoose.disconnect();
