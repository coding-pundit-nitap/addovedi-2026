// Content for the "How to register" guide (/how-to-register). The screenshots live in client/public/guide/
// (1600x900 WebP, ~1.2MB in total) and were captured from a test copy of the site with fictional data.
// To refresh them after a UI change, see video-output/scripts/shots.mjs.
const img = (n) => `/guide/step-${String(n).padStart(2, '0')}.webp`;

export const GUIDE_GROUPS = [
    { id: 'account', label: 'Account', first: 1 },
    { id: 'event', label: 'Find an event', first: 6 },
    { id: 'profile', label: 'Profile', first: 10 },
    { id: 'register', label: 'Register', first: 12 },
    { id: 'team', label: 'Team & admin', first: 15 },
    { id: 'declined', label: 'If declined', first: 20 },
];

const groupOf = (n) => [...GUIDE_GROUPS].reverse().find(g => n >= g.first).id;

const RAW = [
    ['Open the website', 'Visit the official Addovedi 2026 website and click Create Player.'],
    ['Create your account', 'In the portal, choose the Enlist New Player tab.'],
    ['Enter your details', 'Fill in your name, email, mobile number and a password (8+ characters), then submit.'],
    ['Your Addovedi ID', 'Your account is active instantly (no OTP) and your unique Addovedi ID is issued.'],
    ['Log in', 'Log in with your email and password to open your dashboard (Player HQ).'],
    ['Browse the arena', 'Browse the event divisions along the bottom bar and open the one you like.'],
    ['Choose your event', 'Pick the event you want to take part in and click Register Now.'],
    ['Check the event details', 'Review the fee, prize pool and status. Use the tabs for the overview, rules and coordinators.'],
    ['Read the rules', 'Read the rules and eligibility carefully before you register.'],
    ['Complete your profile first', 'A complete profile is required before you can register for any event. Open Player HQ to finish it.'],
    ['Fill in your profile', 'Add your college, department, year, state, city and an emergency contact, then save. You only do this once.'],
    ['Start the registration form', 'Enter a team name and choose the team size. Your own details are filled in automatically.'],
    ['Add your teammates', 'Add each teammate’s name and Addovedi ID, check everything, then send the invites.'],
    ['Invites are sent', 'The team is not final until every teammate accepts. Pending teammates are listed here.'],
    ['Your teammate gets an invite', 'Your teammate sees an invitation banner as soon as they open the site.'],
    ['Teammate accepts', 'They open the event page and accept the invite. Acceptance is final.'],
    ['Teammate has joined', 'The teammate is now part of the team.'],
    ['Team ID issued', 'When everyone accepts you get a Team ID. Use it with your Addovedi ID on Unstop, then wait for the admin to verify.'],
    ['Verified by the admin', 'Once the admin verifies your registration you are all set. The confirmation shows the date and venue.'],
    ['If a teammate declines', 'An invited teammate can also decline the invite from the same banner.'],
    ['What the leader sees', 'The leader sees the decline and can invite someone else, invite them again later, or continue with fewer players.'],
];

export const GUIDE_STEPS = RAW.map(([title, caption], k) => ({ n: k + 1, img: img(k + 1), group: groupOf(k + 1), title, caption }));
