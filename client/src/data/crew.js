// client/src/data/crew.js — Centralized Personnel Database
import crew2026 from './crew2026.json';

export const FACULTY_CREW = [
    {
        id: 'FC01',
        name: 'Dr. Amit Rawat',
        role: 'CONVENER',
        avatarSeed: 'Amit',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43201',
        email: 'amit.rawat@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Techfest Strategic Blueprinting', 'Department Integration Oversight']
    },
    {
        id: 'FC02',
        name: 'Dr. Shalini Vyas',
        role: 'CO-CONVENER',
        avatarSeed: 'Shalini',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43202',
        email: 'shalini.vyas@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Academic & Technical Advisory', 'Curriculum Matching Oversight']
    },
    {
        id: 'FC03',
        name: 'Prof. Rajesh K. Patel',
        role: 'FACULTY ADVISOR',
        avatarSeed: 'Rajesh',
        color: '#9b5cff',
        glow: 'rgba(155,92,255,0.4)',
        phone: '+91 98765 43203',
        email: 'rajesh.patel@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Student Squad Guidance', 'Event Protocol Supervision']
    },
    {
        id: 'FC04',
        name: 'Dr. Neha Chaturvedi',
        role: 'FACULTY COORDINATOR',
        avatarSeed: 'NehaC',
        color: '#ff2cfb',
        glow: 'rgba(255,44,251,0.4)',
        phone: '+91 98765 43204',
        email: 'neha.chaturvedi@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Logistics & Venue Operations Coordination', 'Cross-Divisional Synchronization']
    }
];

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
export function mergeCrewFromDb(dbCrew) {
    if (!Array.isArray(dbCrew) || dbCrew.length === 0) return STUDENT_SECTIONS;

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
