import arenaWarriorTee from '../assets/images/merch/arena-warrior-tee.webp';
import enterTheArenaTee from '../assets/images/merch/enter-the-arena-tee.webp';

// Single Google Form used to order either tee (size/fit/design picked inside the form).
export const MERCH_FORM_URL = 'https://forms.gle/n4yspHCCrpaB5cG48';

export const MERCH_ORDER_DEADLINE = '10th October';

// Every tee comes in both fits, same two prices across the drop.
export const MERCH_VARIANTS = [
    { label: 'REGULAR', price: 349 },
    { label: 'OVERSIZE', price: 399 },
];

export const MERCH_ITEMS = [
    {
        id: 'gladiator-tee',
        name: 'GLADIATOR TEE',
        tag: 'WHITE TEE',
        color: '#00D9FF',
        img: arenaWarriorTee,
        desc: 'White tee, ADDOVEDI chest logo, full line-art warrior back print with the Theodore Roosevelt "Man in the Arena" quote.',
    },
    {
        id: 'enter-the-arena-tee',
        name: 'ENTER THE ARENA TEE',
        tag: 'BLACK TEE',
        color: '#FF4D6D',
        img: enterTheArenaTee,
        desc: 'Black tee, ADDOVEDI chest logo, exploded-view retro console back print — "Enter the Arena 2026".',
    },
];
