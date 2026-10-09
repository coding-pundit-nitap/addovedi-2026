import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        maxlength: 200,
        required: true,
        trim: true
    },
    categoryTitle: {
        type: String,
        maxlength: 200,
        required: true,
        trim: true
    },
    teamName: {
        type: String,
        maxlength: 100,
        required: true,
        trim: true
    },
    leaderName: {
        type: String,
        maxlength: 100,
        required: true,
        trim: true
    },
    leaderUID: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    leaderPhone: {
        type: String,
        maxlength: 20,
        required: true,
        trim: true
    },
    teamSize: {
        type: Number,
        default: 1
    },
    members: [{
        name: { type: String, trim: true },
        uid: { type: String, trim: true }
    }],
    userEmail: {
        type: String,
        maxlength: 254,
        trim: true
    },
    unstopRefId: {
        type: String,
        maxlength: 200,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['PENDING_UNSTOP_VERIFICATION', 'VERIFIED', 'CANCELLED'],
        default: 'PENDING_UNSTOP_VERIFICATION'
    }
}, {
    timestamps: true
});

// Case-insensitive compound indexes (collation strength:2 = case-insensitive
// equality) so the duplicate-enlistment check in createRegistration can do a
// single indexed lookup instead of pulling every registration for an event
// into memory and scanning it in JS — the latter degrades to a full
// in-memory scan on every new registration as an event's roster grows,
// which becomes a real crash risk (CPU + memory, blocking Node's single
// event loop) at high registration volume, attack or not.
registrationSchema.index(
    { eventTitle: 1, leaderUID: 1 },
    { collation: { locale: 'en', strength: 2 } }
);
registrationSchema.index(
    { eventTitle: 1, 'members.uid': 1 },
    { collation: { locale: 'en', strength: 2 } }
);

// Standalone (non-eventTitle-prefixed) indexes for "all of my registrations
// across every event" lookups (getMyRegistrations) — the compound indexes
// above can't be used efficiently for a query that doesn't filter by
// eventTitle first.
registrationSchema.index({ leaderUID: 1 }, { collation: { locale: 'en', strength: 2 } });
registrationSchema.index({ 'members.uid': 1 }, { collation: { locale: 'en', strength: 2 } });

export default mongoose.model('Registration', registrationSchema);
