// Restores a backup made by scripts/backup.js into the database MONGODB_URI points at.
//
//   node scripts/restoreBackup.js <backup-folder>             dry run: shows what would be restored
//   node scripts/restoreBackup.js <backup-folder> --confirm   REPLACES each backed-up collection's contents
//
// Also the way to move data between databases (e.g. Atlas -> the college server's Mongo): back up the source,
// point MONGODB_URI at the target, restore. Collections not in the backup are left untouched.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

dotenv.config();

const { EJSON } = mongoose.mongo.BSON;
const dir = process.argv[2];
const confirm = process.argv.includes('--confirm');
if (!dir || !fs.existsSync(path.join(dir, 'manifest.json'))) {
    console.error('Usage: node scripts/restoreBackup.js <backup-folder> [--confirm]');
    process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/addovedi', { serverSelectionTimeoutMS: 15000 });
const db = mongoose.connection.db;
console.log(`Target database: ${db.databaseName}  (${confirm ? 'RESTORING' : 'dry run, nothing changes'})`);

for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json.gz'))) {
    const name = file.replace(/\.json\.gz$/, '');
    const docs = EJSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, file))).toString('utf8'));
    const existing = await db.collection(name).countDocuments();
    console.log(`  ${name}: ${docs.length} in backup, ${existing} currently in database`);
    if (confirm) {
        await db.collection(name).deleteMany({});
        if (docs.length) await db.collection(name).insertMany(docs);
    }
}
if (!confirm) console.log('\nDry run only. Add --confirm to replace the collections above.');
await mongoose.disconnect();
