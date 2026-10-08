// Placeholder gallery entries per year. Swap `img` with a real photo path
// (e.g. an import from assets/images/past/...) once photos are available —
// everything else (tabs, layout) already works off this data.
export const PAST_EDITIONS = [
    {
        year: '2025',
        tagline: 'ADDOVEDI 2025 — THE FIRST SIGNAL',
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: `2025-${i + 1}`,
            img: null,
            caption: `GALLERY SLOT ${i + 1}`,
        })),
    },
    {
        year: '2024',
        tagline: 'ADDOVEDI 2024 — ORIGIN SEQUENCE',
        photos: Array.from({ length: 6 }, (_, i) => ({
            id: `2024-${i + 1}`,
            img: null,
            caption: `GALLERY SLOT ${i + 1}`,
        })),
    },
];
