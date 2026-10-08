import arenaWarriorTee from '../assets/images/merch/arena-warrior-tee.png';
import enterTheArenaTee from '../assets/images/merch/enter-the-arena-tee.png';

// Single Google Form used to order either tee (size/design picked inside the form).
export const MERCH_FORM_URL = 'https://forms.gle/REPLACE_WITH_REAL_FORM_LINK';

export const MERCH_ITEMS = [
    {
        id: 'arena-warrior-tee',
        name: 'ARENA WARRIOR TEE',
        tag: 'WHITE · CLASSIC FIT',
        color: '#00D9FF',
        price: 300,
        img: arenaWarriorTee,
        desc: 'White tee, ADDOVEDI chest logo, full line-art warrior back print with the Theodore Roosevelt "Man in the Arena" quote.',
    },
    {
        id: 'enter-the-arena-tee',
        name: 'ENTER THE ARENA TEE',
        tag: 'BLACK · OVERSIZED FIT',
        color: '#FF4D6D',
        price: 300,
        img: enterTheArenaTee,
        desc: 'Black tee, ADDOVEDI chest logo, exploded-view retro console back print — "Enter the Arena 2026".',
    },
];
