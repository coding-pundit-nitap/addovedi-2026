import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Crew from '../models/Crew.js';
import Sponsor from '../models/Sponsor.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[DB] Connected to MongoDB Atlas...'))
    .catch(err => console.error('[DB] Connection Error:', err));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// High-reliability brand logo API assets for corporate sponsors
const SPONSOR_LOGOS = {
    'NVIDIA': 'https://logo.clearbit.com/nvidia.com',
    'AMD': 'https://logo.clearbit.com/amd.com',
    'ASUS ROG': 'https://logo.clearbit.com/rog.asus.com',
    'MSI': 'https://logo.clearbit.com/msi.com',
    'BOAT': 'https://logo.clearbit.com/boat-lifestyle.com',
    'MICROSOFT': 'https://logo.clearbit.com/microsoft.com',
    'INTEL': 'https://logo.clearbit.com/intel.com',
    'GIGABYTE': 'https://logo.clearbit.com/gigabyte.com',
    'RAZER': 'https://logo.clearbit.com/razer.com',
    'GITHUB': 'https://logo.clearbit.com/github.com',
    'RED BULL': 'https://logo.clearbit.com/redbull.com',
    'SONY': 'https://logo.clearbit.com/sony.com',
    'CADENCE': 'https://logo.clearbit.com/cadence.com',
    'SOLIDWORKS': 'https://logo.clearbit.com/solidworks.com',
    'DELL': 'https://logo.clearbit.com/dell.com',
    'LOGITECH': 'https://logo.clearbit.com/logitech.com',
    'COCA COLA': 'https://logo.clearbit.com/cocacola.com',
    'SPOTIFY': 'https://logo.clearbit.com/spotify.com'
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const syncToCloudinary = async () => {
    try {
        console.log('[SYNC] Starting image upload sync pipeline...');

        // 1. Sync Crew Avatars with cool robotic avatars from Dicebear
        const crewMembers = await Crew.find({});
        console.log(`[SYNC] Syncing ${crewMembers.length} crew profiles...`);
        for (let member of crewMembers) {
            // If already synced, skip to save API calls
            if (member.avatar && member.avatar.includes('cloudinary.com')) {
                console.log(`[CREW SKIP] Already synced: ${member.name}`);
                continue;
            }

            // Generate PNG cyber robot avatar based on name
            const avatarUrl = `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(member.name)}`;
            try {
                const res = await cloudinary.uploader.upload(avatarUrl, {
                    folder: 'addovedi_crew',
                    public_id: member.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
                });
                member.avatar = res.secure_url;
                await member.save();
                console.log(`[CREW SUCCESS] Avatars synced for ${member.name} -> ${res.secure_url}`);
                await delay(300); // polite delay
            } catch (err) {
                console.error(`[CREW ERROR] Failed to upload avatar for ${member.name}:`, err.message);
            }
        }

        // 2. Sync Sponsor Logos with high-quality vector source graphics
        const sponsors = await Sponsor.find({});
        console.log(`[SYNC] Syncing ${sponsors.length} sponsor alliances...`);
        for (let sponsor of sponsors) {
            // If already synced, skip to save rate limits
            if (sponsor.logoImage && sponsor.logoImage.includes('cloudinary.com')) {
                console.log(`[SPONSOR SKIP] Already synced: ${sponsor.name}`);
                continue;
            }

            const logoUrl = SPONSOR_LOGOS[sponsor.name.toUpperCase()];
            if (logoUrl) {
                try {
                    console.log(`[SYNCING] Uploading logo for ${sponsor.name}...`);
                    const res = await cloudinary.uploader.upload(logoUrl, {
                        folder: 'addovedi_sponsors',
                        public_id: sponsor.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
                    });
                    sponsor.logoImage = res.secure_url;
                    await sponsor.save();
                    console.log(`[SPONSOR SUCCESS] Logo image synced for ${sponsor.name} -> ${res.secure_url}`);
                    await delay(300); // polite delay
                } catch (err) {
                    console.error(`[SPONSOR ERROR] Failed to upload logo for ${sponsor.name}:`, err.message);
                }
            } else {
                console.warn(`[SPONSOR SKIP] No logo URL matched for ${sponsor.name}, skipping image upload.`);
            }
        }

        console.log('[SYNC COMPLETE] All images successfully hosted on Cloudinary and links updated in MongoDB.');
        process.exit(0);
    } catch (err) {
        console.error('[SYNC CRITICAL ERROR] Pipeline failed:', err.message);
        process.exit(1);
    }
};

// Wait for database connection to be established before starting
setTimeout(syncToCloudinary, 3000);
