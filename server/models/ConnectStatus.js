import mongoose from 'mongoose';

const ConnectStatusSchema = new mongoose.Schema({
    generalQueries: {
        type: String,
        required: true,
        default: 'ONLINE'
    },
    sponsors: {
        type: String,
        required: true,
        default: 'AVAILABLE'
    },
    events: {
        type: String,
        required: true,
        default: 'ONLINE'
    },
    media: {
        type: String,
        required: true,
        default: 'RESPONDING'
    }
}, { timestamps: true });

export default mongoose.model('ConnectStatus', ConnectStatusSchema);
