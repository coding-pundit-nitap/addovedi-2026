import mongoose from 'mongoose';

// Generic atomic-increment counter collection (classic MongoDB auto-increment
// pattern), used wherever a globally-unique sequential value is needed —
// e.g. Addovedi IDs. findByIdAndUpdate with $inc is a single atomic
// operation, so concurrent signups can never be handed the same number.
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 142 }
});

export default mongoose.model('Counter', CounterSchema);
