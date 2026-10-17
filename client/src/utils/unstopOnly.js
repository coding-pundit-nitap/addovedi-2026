// Divisions whose events are registered ONLY on Unstop: no Addovedi profile, team form, invites or admin
// verification. Their event window just shows a "Register on Unstop" button. Every other division keeps the
// full Addovedi registration flow.
const UNSTOP_ONLY_CATEGORIES = ['GAMING NEXUS', 'FUN ARENA'];

export const isUnstopOnlyCategory = (title) => UNSTOP_ONLY_CATEGORIES.includes(String(title || '').trim().toUpperCase());
