// The admin portal lives at an unlisted path instead of the guessable /admin.
// This is only to keep casual visitors out of sight of the login page; the real
// protection is still the admin login + JWT on every admin API route.
export const ADMIN_PATH = '/enterthearena';
