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
    // Generated once the team is final (every invited teammate accepted, or the leader chose to continue
    // with the accepted ones). Unstop registration and admin verification only happen after this exists.
    teamId: { type: String, trim: true, unique: true, sparse: true },
    teamFinalAt: { type: Date },
    members: [{
        name: { type: String, trim: true },
        uid: { type: String, trim: true },
        // Teammate consent. createRegistration sets PENDING explicitly; the schema default is
        // ACCEPTED only so registrations made before this feature (whose members never had to
        // consent) keep showing as accepted instead of suddenly turning pending.
        status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'ACCEPTED' },
        respondedAt: { type: Date },
        invitedAt: { type: Date, default: Date.now },
        // how many times this person has been invited to THIS team (max MAX_INVITES_PER_PERSON)
        inviteCount: { type: Number, default: 1 },
        // true when a PENDING invite lapsed after INVITE_TTL_HOURS and the member was removed
        expired: { type: Boolean, default: false }
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
    { eventTitle: 1, 'members.uid': 1 },
    { collation: { locale: 'en', strength: 2 } }
);

// Standalone (non-eventTitle-prefixed) indexes for "all of my registrations
// across every event" lookups (getMyRegistrations) — the compound indexes
// above can't be used efficiently for a query that doesn't filter by
// eventTitle first.
// Hard guarantee against a leader holding two live registrations for one event (the in-process lock
// and findOne check above can race across instances). Cancelled ones are excluded so re-registering works.
registrationSchema.index(
    { eventTitle: 1, leaderUID: 1 },
    { unique: true, name: 'uniq_live_leader_per_event', collation: { locale: 'en', strength: 2 },
      partialFilterExpression: { status: { $in: ['PENDING_UNSTOP_VERIFICATION', 'VERIFIED'] } } }
);
registrationSchema.index({ leaderUID: 1 }, { collation: { locale: 'en', strength: 2 } });
registrationSchema.index({ 'members.uid': 1 }, { collation: { locale: 'en', strength: 2 } });

export default mongoose.model('Registration', registrationSchema);
