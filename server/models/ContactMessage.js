import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        maxlength: 200
    },
    subject: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 5000
    }
}, { timestamps: true });

export default mongoose.model('ContactMessage', ContactMessageSchema);
