// XP rule, shared by the events page header, the profile page and (as the displayed bounty) the event pages.
// Keep in step with server/controllers/leaderboardController.js.
//   - A player earns 200 XP for every VERIFIED registration they are part of (team leader or accepted teammate).
//     XP appears when the admin verifies the registration, not when the form is submitted.
//   - Every 3 verified registrations is one level, from level 1 up to level 10.
export const XP_PER_REGISTRATION = 200;
export const REGISTRATIONS_PER_LEVEL = 3;
export const MAX_LEVEL = 10;

// `reg` is one row from GET /registrations/my/:id. Only verified teams the player has actually joined count.
export const countsForXp = (reg) => Boolean(reg) && reg.status === 'VERIFIED' && reg.myStatus !== 'PENDING' && reg.myStatus !== 'REJECTED';
export const verifiedCount = (regs) => (Array.isArray(regs) ? regs.filter(countsForXp).length : 0);

export function xpStats(count) {
    const n = Math.max(0, Math.floor(Number(count) || 0));
    const perLevel = XP_PER_REGISTRATION * REGISTRATIONS_PER_LEVEL;
    const xp = n * XP_PER_REGISTRATION;
    const level = Math.min(MAX_LEVEL, 1 + Math.floor(n / REGISTRATIONS_PER_LEVEL));
    const levelFloorXp = (level - 1) * perLevel;
    const nextLevelXp = level >= MAX_LEVEL ? null : level * perLevel;
    const progress = level >= MAX_LEVEL ? 100 : Math.round(((xp - levelFloorXp) / perLevel) * 100);
    return { count: n, xp, level, levelFloorXp, nextLevelXp, progress, xpToNext: nextLevelXp === null ? 0 : nextLevelXp - xp };
}
