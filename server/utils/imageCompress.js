import sharp from 'sharp';

// Every image uploaded from Admin passes through here before it is stored, so an organiser can drop in a 6MB phone
// photo and the website still serves a small, fast file.
//   - longest side capped at MAX_SIDE (enough for a retina-sharp card or logo, never enlarged)
//   - EXIF rotation applied, metadata (GPS etc.) stripped
//   - re-encoded as WebP (keeps transparency for logos; animated GIFs stay animated)
//   - a file that is already small is left alone if re-encoding wouldn't shrink it
export const MAX_SIDE = 1000;
const ALREADY_SMALL = 400 * 1024;

export async function compressImage(buffer, mimetype) {
    const animated = mimetype === 'image/gif';
    // limitInputPixels guards against "decompression bomb" files (tiny on disk, gigantic once decoded).
    const out = await sharp(buffer, { limitInputPixels: 50_000_000, animated })
        .rotate()
        .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();

    if (out.length >= buffer.length && buffer.length < ALREADY_SMALL) {
        return { buffer, changed: false, format: undefined, before: buffer.length, after: buffer.length };
    }
    return { buffer: out, changed: true, format: 'webp', before: buffer.length, after: out.length };
}
