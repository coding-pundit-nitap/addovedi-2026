import mongoose from 'mongoose';

const HeadCoordinatorSchema = new mongoose.Schema({
    name: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' }
});

// Scheduling info for the public Timeline page. `day` is left unset (null)
// until an admin actually decides it — an event with no day assigned is
// simply skipped when the Timeline page builds its day-by-day schedule, so
// "not yet scheduled" sub-events never show up with a made-up time.
const TimelineSchema = new mongoose.Schema({
    day: { type: Number, min: 1, max: 3, default: null },
    time: { type: String, default: '' },
    end: { type: String, default: '' },
    venue: { type: String, default: '' },
    mode: { type: String, default: 'Solo' },
    prize: { type: String, default: '' }
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

export default mongoose.model('SubEvent', SubEventSchema);

