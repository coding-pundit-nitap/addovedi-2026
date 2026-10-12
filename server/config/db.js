import mongoose from 'mongoose';
import dns from 'dns';

const configureDns = () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
        console.log('[DB] Configured Node.js DNS resolvers to [8.8.8.8, 1.1.1.1]');
    } catch (e) {
        console.warn('[DB] Could not override DNS servers:', e.message);
    }
};

// Fail a query after 4s when the database is unreachable instead of Mongoose's default 10s of buffering.
mongoose.set('bufferTimeoutMS', 4000);

const connectDB = async () => {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/addovedi';
    
    // Set public DNS to reliably resolve MongoDB Atlas SRV records
    configureDns();

    try {
        await mongoose.connect(connString, {
            serverSelectionTimeoutMS: 6000
        });
        console.log(`[DB] MongoDB Connected successfully.`);
    } catch (err) {
        console.warn(`[DB] Primary MongoDB Connection failed: ${err.message}. Retrying with DNS fallback...`);
        try {
            configureDns();
            await mongoose.connect(connString, {
                serverSelectionTimeoutMS: 6000
            });
            console.log(`[DB] MongoDB Connected successfully on DNS retry.`);
        } catch (retryErr) {
            console.warn(`[DB] Cloud Connection failed: ${retryErr.message}. Trying local fallback...`);
            try {
                await mongoose.connect('mongodb://127.0.0.1:27017/addovedi', {
                    serverSelectionTimeoutMS: 5000
                });
                console.log(`[DB] Connected to local MongoDB fallback.`);
            } catch (fallbackErr) {
                console.error(`[DB ERROR] All MongoDB connections failed: ${fallbackErr.message}`);
            }
        }
    }
};

export default connectDB;
