// client/src/data/crew.js — Centralized Personnel Database
import crew2026 from './crew2026.json';
import faculty2026 from './faculty2026.json';

// Faculty coordinators. Source of truth: faculty2026.json (also used by server/scripts/seedCrew.js).
// Fallback shown when the database has no faculty crew documents. The main coordinator is listed first.
export const FACULTY_CREW = faculty2026.map((f, i) => {
    const color = f.main ? '#00E5FF' : '#9b5cff';
    return {
        id: `FC${String(i + 1).padStart(2, '0')}`,
        name: f.name,
        role: f.role,
        avatarSeed: f.name,
        color,
        glow: color === '#00E5FF' ? 'rgba(0,229,255,0.4)' : 'rgba(155,92,255,0.4)'
    };
});

// Real 2026 head coordinators. Source of truth: crew2026.json (also used by server/scripts/seedCrew.js).
// This is the fallback shown when the database has no crew documents.
const SECTION_COLORS = ['#00E5FF', '#9b5cff', '#ff2cfb', '#ffd700', '#1fff76', '#ff9d00', '#ff1f4f'];
const hexGlow = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},0.4)`;
};

export const STUDENT_SECTIONS = crew2026.map((sec, i) => {
    const color = SECTION_COLORS[i % SECTION_COLORS.length];
    return {
        title: sec.title,
        color,
        members: sec.members.map(({ name, role }, j) => ({
            id: `SC${String(i + 1).padStart(2, '0')}${j + 1}`,
            name,
            role,
            avatarSeed: name,
            color,
            glow: hexGlow(color)
        }))
    };
});

const CREW_COLOR_PALETTE = ['#00E5FF', '#9b5cff', '#1FFF76', '#ff1f4f', '#ffea00', '#ff9d00', '#ff2cfb'];

// Builds the STUDENT_SECTIONS shape (grouped-by-category sections) from the
// Crew documents returned by GET /api/crew, so admin-portal edits (name,
// role, bio, avatar, links, category) actually render on the public site
// instead of the page being stuck on this static fallback data forever.
export function mergeCrewFromDb(allCrew) {
    const dbCrew = Array.isArray(allCrew) ? allCrew.filter(c => c.type !== 'FACULTY') : [];
    if (dbCrew.length === 0) return STUDENT_SECTIONS;

    const order = [];
    const buckets = {};
    dbCrew.forEach(c => {
        const key = (c.category || 'CORE').toUpperCase();
        if (!buckets[key]) {
            buckets[key] = [];
            order.push(key);
        }
        buckets[key].push(c);
    });

    return order.map((key, idx) => {
        const color = CREW_COLOR_PALETTE[idx % CREW_COLOR_PALETTE.length];
        return {
            title: key,
            color,
            members: buckets[key]
                .slice()
                .sort((a, b) => (Number(b.featured) - Number(a.featured)) || ((b.statVal || 0) - (a.statVal || 0)))
                .map(c => ({
                    id: c._id,
                    name: c.name,
                    role: c.role,
                    avatar: c.avatar || '',
                    avatarSeed: c.name,
                    color,
                    glow: `${color}66`,
                    bio: c.bio || '',
                    links: Array.isArray(c.links) ? c.links : []
                }))
        };
    });
}

// Faculty list from the Crew documents flagged type === 'FACULTY' (admin-managed),
// in admin-set order (featured first, then oldest first); static fallback if none.
export function mergeFacultyFromDb(allCrew) {
    const faculty = Array.isArray(allCrew) ? allCrew.filter(c => c.type === 'FACULTY') : [];
    if (faculty.length === 0) return FACULTY_CREW;
    return faculty
        .slice()
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .map((c, i) => {
            const color = i === 0 ? '#00E5FF' : '#9b5cff';
            return {
                id: c._id,
                name: c.name,
                role: c.role,
                avatar: c.avatar || '',
                avatarSeed: c.name,
                color,
                glow: i === 0 ? 'rgba(0,229,255,0.4)' : 'rgba(155,92,255,0.4)',
                bio: c.bio || '',
                links: Array.isArray(c.links) ? c.links : []
            };
        });
}
