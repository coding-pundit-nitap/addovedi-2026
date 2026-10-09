import mongoose from 'mongoose';

// Single-document collection of site-wide switches controlled from Admin.
const SiteSettingsSchema = new mongoose.Schema({
    // Event registration is closed until an admin turns it on ("starting soon" is shown instead).
    registrationOpen: { type: Boolean, default: false },
    // The Crew page shows "launching soon" until an admin turns this on.
    crewVisible: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('SiteSettings', SiteSettingsSchema);
