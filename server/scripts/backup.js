// Full database backup: every collection to a gzipped Extended-JSON file (keeps ObjectIds and dates intact).
// Works against Atlas or the college server's Mongo; needs no mongodump install.
//
//   node scripts/backup.js            (from server/; uses MONGODB_URI from .env)
//
// Output: <BACKUP_DIR or ./backups>/<YYYY-MM-DD_HH-MM-SS>/<collection>.json.gz + manifest.json
// The newest BACKUP_KEEP (default 14) backups are kept, older ones are deleted.
// WARNING: backups contain personal data and password hashes. Never commit or share them (backups/ is gitignored).
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

dotenv.config();

const { EJSON } = mongoose.mongo.BSON;
const root = process.env.BACKUP_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'backups');
const keep = Math.max(1, Number(process.env.BACKUP_KEEP) || 14);

const stamp = new Date().toISOString().replace('T', '_').replace(/:/g, '-').slice(0, 19);
const dir = path.join(root, stamp);
fs.mkdirSync(dir, { recursive: true });

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/addovedi', { serverSelectionTimeoutMS: 15000 });
const db = mongoose.connection.db;
const manifest = { createdAt: new Date().toISOString(), database: db.databaseName, collections: {} };

for (const { name } of await db.listCollections({}, { nameOnly: true }).toArray()) {
    if (name.startsWith('system.')) continue;
    const docs = await db.collection(name).find({}).toArray();
    fs.writeFileSync(path.join(dir, `${name}.json.gz`), zlib.gzipSync(EJSON.stringify(docs, { relaxed: false })));
    manifest.collections[name] = docs.length;
}
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
await mongoose.disconnect();

// Prune old backups (only folders that look like our timestamps).
const old = fs.readdirSync(root).filter(d => /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/.test(d)).sort().reverse().slice(keep);
for (const d of old) fs.rmSync(path.join(root, d), { recursive: true, force: true });

console.log(`Backup saved to ${path.resolve(dir)}`);
console.log(Object.entries(manifest.collections).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
if (old.length) console.log(`Pruned ${old.length} old backup(s) (keeping ${keep}).`);
