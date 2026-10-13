import mongoose from 'mongoose';

const HeadCoordinatorSchema = new mongoose.Schema({
    name: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' }
});

// One scheduled slot. The first slot of an event lives directly on the timeline
// (day/time/end/venue); `sessions` holds any further slots (later rounds, a
// second day). `endDay` is only needed when a slot finishes on a later day than
// it starts (e.g. a 24h hackathon). `label` names the round shown on the card.
const SessionSchema = new mongoose.Schema({
    day: { type: Number, min: 1, max: 3, required: true },
    time: { type: String, default: '', trim: true, maxlength: 10 },
    end: { type: String, default: '', trim: true, maxlength: 10 },
    endDay: { type: Number, min: 1, max: 3, default: null },
    venue: { type: String, default: '', trim: true, maxlength: 80 },
    label: { type: String, default: '', trim: true, maxlength: 80 }
}, { _id: false });

// Scheduling info for the public Timeline page. `day` is left unset (null)
// until an admin actually decides it — an event with no day assigned is
// simply skipped when the Timeline page builds its day-by-day schedule, so
// "not yet scheduled" sub-events never show up with a made-up time.
const TimelineSchema = new mongoose.Schema({
    day: { type: Number, min: 1, max: 3, default: null },
    time: { type: String, default: '' },
    end: { type: String, default: '' },
    endDay: { type: Number, min: 1, max: 3, default: null },
    label: { type: String, default: '', trim: true, maxlength: 80 },
    venue: { type: String, default: '' },
    mode: { type: String, default: 'Solo' },
    prize: { type: String, default: '' },
    sessions: { type: [SessionSchema], default: [] }
}, { _id: false });

const SubEventSchema = new mongoose.Schema({
    categoryTitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    // Allowed team size (leader included). Equal values = fixed size, e.g. BGMI 4/4.
    minTeam: { type: Number, default: 1, min: 1, max: 10 },
    maxTeam: { type: Number, default: 5, min: 1, max: 10 },
    // Admin switch: true = new registrations / invites for THIS event are refused (shown as "Registration closed").
    // Missing/false = follows the main registration switch only. Existing registrations are never touched by it.
    registrationClosed: { type: Boolean, default: false },
    // Registration fee shown in the event modal, e.g. '₹100' or 'FREE'. Blank = FREE.
    fee: { type: String, default: '', trim: true, maxlength: 40 },
    overview: {
        type: String,
        required: false,
        default: '' // Longer multi-paragraph description shown on the event's Overview tab
    },
    color: {
        type: String,
        required: true,
        default: '#00d9ff'
    },
    xp: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        default: 'MEDIUM'
    },
    heads: [HeadCoordinatorSchema],
    iconType: {
        type: String,
        required: true,
        default: 'code'
    },
    modelType: {
        type: String,
        required: false,
        default: 'coding' // 'gun' | 'mecha' | 'controller' | 'coding' | 'civil' | 'electrical' | 'ai'
    },
    unstopUrl: {
        type: String,
        required: false,
        default: 'https://unstop.com'
    },
    timeline: {
        type: TimelineSchema,
        required: false,
        default: () => ({})
    }
}, { timestamps: true });

SubEventSchema.pre('validate', function (next) {
    if (this.minTeam > this.maxTeam) return next(new Error('Minimum team size cannot exceed maximum team size.'));
    next();
});

export default mongoose.model('SubEvent', SubEventSchema);
