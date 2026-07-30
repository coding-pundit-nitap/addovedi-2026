import mongoose from 'mongoose';

const connectDB = async () => {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/addovedi';
    try {
        await mongoose.connect(connString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected successfully.`);
    } catch (err) {
        console.warn(`Primary MongoDB Connection failed: ${err.message}. Trying local fallback...`);
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/addovedi', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(`Connected to local MongoDB database fallback.`);
        } catch (fallbackErr) {
            console.error(`MongoDB Connection Error: ${fallbackErr.message}`);
        }
    }
};

export default connectDB;
