import mongoose from 'mongoose';

// Single-document collection of site-wide switches controlled from Admin.
const SiteSettingsSchema = new mongoose.Schema({
    // Event registration is closed until an admin turns it on ("starting soon" is shown instead).
    registrationOpen: { type: Boolean, default: false },
    // Three states: 'soon' (starting soon), 'open', 'closed' (registration ended). Unset on older documents:
    // then it is derived from registrationOpen. registrationOpen is kept in sync as (mode === 'open').
    registrationMode: { type: String, enum: ['soon', 'open', 'closed'] },
    // The whole Events/Arena section shows "coming soon" when an admin turns this off. Defaults to ON so
    // existing sites keep working until an admin chooses to hide it.
    eventsVisible: { type: Boolean, default: true },
    // The Crew page shows "launching soon" until an admin turns this on.
    crewVisible: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('SiteSettings', SiteSettingsSchema);
