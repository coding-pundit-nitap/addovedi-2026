// XP rule, shared by the events-page header, the profile page and the event pages' bounty label.
// Keep in step with server/services/xpService.js.
//   - A player earns XP for every VERIFIED registration they are part of (team leader or accepted teammate).
//     XP appears when the admin verifies the registration, not when the form is submitted.
//   - 250 XP in events that allow only ONE player (the event's maxTeam is 1); 200 XP in every other event, whatever size the
//     team registered with. It follows the event's current team-size setting.
//   - Every 600 XP is one level, from level 1 up to level 10.
export const XP_TEAM_EVENT = 200;
export const XP_SINGLE_EVENT = 250;
export const XP_PER_REGISTRATION = XP_TEAM_EVENT;   // kept for older imports
export const XP_PER_LEVEL = 600;
export const MAX_LEVEL = 10;

// `event` is anything with a maxTeam (a sub-event from the API or the static data).
export const isSingleEvent = (event) => Number(event?.maxTeam) === 1;
export const xpForEvent = (event) => (isSingleEvent(event) ? XP_SINGLE_EVENT : XP_TEAM_EVENT);

// `reg` is one row from GET /registrations/my/:id. Only verified teams the player has actually joined count.
export const countsForXp = (reg) => Boolean(reg) && reg.status === 'VERIFIED' && reg.myStatus !== 'PENDING' && reg.myStatus !== 'REJECTED';
export const verifiedCount = (regs) => (Array.isArray(regs) ? regs.filter(countsForXp).length : 0);
// The server tells us what each registration is worth (xpAward). Anything else (an older server, a damaged value) counts as 200.
export const regXp = (reg) => (countsForXp(reg) ? (reg.xpAward === XP_SINGLE_EVENT ? XP_SINGLE_EVENT : XP_TEAM_EVENT) : 0);
export const sumXp = (regs) => (Array.isArray(regs) ? regs.reduce((t, r) => t + regXp(r), 0) : 0);

export function xpStats(xpInput) {
    const xp = Math.max(0, Math.floor(Number(xpInput) || 0));
    const level = Math.min(MAX_LEVEL, 1 + Math.floor(xp / XP_PER_LEVEL));
    const levelFloorXp = (level - 1) * XP_PER_LEVEL;
    const nextLevelXp = level >= MAX_LEVEL ? null : level * XP_PER_LEVEL;
    const progress = level >= MAX_LEVEL ? 100 : Math.round(((xp - levelFloorXp) / XP_PER_LEVEL) * 100);
    return { xp, level, levelFloorXp, nextLevelXp, progress, xpToNext: nextLevelXp === null ? 0 : nextLevelXp - xp };
}
