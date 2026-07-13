/**
 * HologramCards.jsx — Cyberpunk / Gaming-themed 3D lobby console.
 *
 * Renders glowing category cards that, when clicked, mathematically coalesce
 * into the center console and blast outward into the sub-events of that division
 * with bounciness and expanding neon shockwaves.
 */

import { useRef, useMemo, useState, useEffect, Suspense, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';
import { useLocation, useNavigate } from 'react-router-dom';

export const CARD_DATA = [
    {
        title: 'ROBOTICS & RC',
        subtitle: 'AUTONOMOUS MOTORS',
        desc: 'Race high-speed RC cars and program precise line followers.',
        color: '#00d9ff',
        xp: '8,000 XP',
        difficulty: 'ELITE',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4M8 15h.01M16 15h.01"></path>
            </svg>
        ),
    },
    {
        title: 'CODING QUEST',
        subtitle: 'ALGORITHMIC WARFARE',
        desc: 'Join high-speed hackathons and optimize code structures.',
        color: '#ff1f4f',
        xp: '5,000 XP',
        difficulty: 'HARD',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
                <line x1="14" y1="4" x2="10" y2="20"></line>
            </svg>
        ),
    },
    {
        title: 'ELECTRICAL GUILD',
        subtitle: 'CIRCUIT DEBUGGING',
        desc: 'Master breadboard wiring, logic gates, and analog designs.',
        color: '#ff9d00',
        xp: '6,500 XP',
        difficulty: 'MEDIUM',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
        ),
    },
    {
        title: 'GAMING ARENA',
        subtitle: 'ESPORTS SHOWDOWN',
        desc: 'Compete in Valorant, BGMI, and FIFA college tournaments.',
        color: '#9b5cff',
        xp: '6,000 XP',
        difficulty: 'HARD',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"></path>
            </svg>
        ),
    },
    {
        title: 'CREATIVE & DESIGN',
        subtitle: 'STRUCTURE & CLAY',
        desc: 'Build structural bridges, throw pottery, and exhibit fine arts.',
        color: '#1fff76',
        xp: '4,500 XP',
        difficulty: 'EASY',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5L17.5 5.5a2.12 2.12 0 1 0-3-3L4.5 16.5z"></path>
                <path d="M12 5l7 7M9 8l7 7M3 21h18"></path>
            </svg>
        ),
    },
    {
        title: 'AI & DATA SCIENCE',
        subtitle: 'NEURAL CONSTRUCTS',
        desc: 'Train reinforcement agents and design deep learning models.',
        color: '#2b5cff',
        xp: '7,000 XP',
        difficulty: 'HARD',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
        ),
    },
    {
        title: 'WORKSHOP LAB',
        subtitle: 'KINETIC HARDWARE',
        desc: 'Operate industrial metalworks and build hardware machinery.',
        color: '#ffea00',
        xp: '5,500 XP',
        difficulty: 'MEDIUM',
        icon: (color) => (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
        ),
    }
];

export const slugify = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const SUB_EVENTS = {
    'CODING QUEST': [
        {
            title: 'BUG HUNT',
            subtitle: 'DIAGNOSTICS & DEBUGGING',
            desc: 'Scan code segments and patch hidden compiler bugs under pressure.',
            color: '#ff1f4f',
            xp: '1,500 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <path d="M12 2v2M5 5l1.5 1.5M19 5l-1.5 1.5M6 14h12M6 17h12"></path>
                </svg>
            )
        },
        {
            title: 'BYTE CODE',
            subtitle: 'ALGORITHMS & SPEED',
            desc: 'Crack algorithmic constraints and design time-optimal data models.',
            color: '#ff1f4f',
            xp: '2,500 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            )
        },
        {
            title: 'WEB CRAFT',
            subtitle: 'DASHBOARD INTERFACES',
            desc: 'Design beautiful, responsive game visual overlay terminals.',
            color: '#ff1f4f',
            xp: '3,000 XP',
            difficulty: 'ELITE',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            )
        }
    ],
    'ELECTRICAL GUILD': [
        {
            title: 'LOGIC QUEST',
            subtitle: 'TRUTH TABLES & CIRCUITS',
            desc: 'Build gate systems and resolve high-frequency signals.',
            color: '#ff9d00',
            xp: '2,000 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="7"></circle>
                    <polyline points="12 9 12 12 14 14"></polyline>
                </svg>
            )
        },
        {
            title: 'MAZE RUNNER',
            subtitle: 'AUTONOMOUS PCB BOARDS',
            desc: 'Program microcontrollers to solve breadboard electrical mazes.',
            color: '#ff9d00',
            xp: '3,000 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
            )
        }
    ],
    'ROBOTICS & RC': [
        {
            title: 'ROBO WARS',
            subtitle: 'COMBAT ARENA',
            desc: 'Destroy opponents in a steel-caged combat arena showdown.',
            color: '#00d9ff',
            xp: '4,000 XP',
            difficulty: 'ELITE',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 22 22 22 12 2"></polygon>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            )
        },
        {
            title: 'LINE RUNNER',
            subtitle: 'INFRARED ACCELERATION',
            desc: 'Design line followers that lock onto grid courses in record time.',
            color: '#00d9ff',
            xp: '2,500 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
            )
        },
        {
            title: 'DRONE PILOT',
            subtitle: 'AERIAL ACCELERATOR',
            desc: 'Fly precision micro drones through complex vertical ring gates.',
            color: '#00d9ff',
            xp: '3,500 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
            )
        }
    ],
    'CREATIVE & DESIGN': [
        {
            title: 'PROPEL',
            subtitle: 'PNEUMATIC PROPULSION',
            desc: 'Assemble model rockets and launch them high using air-pressure pumps.',
            color: '#1fff76',
            xp: '1,200 XP',
            difficulty: 'EASY',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5L17.5 5.5a2.12 2.12 0 1 0-3-3L4.5 16.5z"></path>
                </svg>
            )
        },
        {
            title: 'TRUSS BUILD',
            subtitle: 'BALSA WOOD BRIDGES',
            desc: 'Glue together truss bridges and load test them to the absolute break limit.',
            color: '#1fff76',
            xp: '1,800 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            )
        },
        {
            title: 'POTTERY ART',
            subtitle: 'CLAY VISIONS',
            desc: 'Sculpt customized pots on motorized spinning potter wheels.',
            color: '#1fff76',
            xp: '1,000 XP',
            difficulty: 'EASY',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            )
        }
    ],
    'GAMING ARENA': [
        {
            title: 'VALORANT',
            subtitle: '5V5 SEARCH & DESTROY',
            desc: 'Coordinate agent tactics on stage screens for gaming domination.',
            color: '#9b5cff',
            xp: '3,000 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <path d="M6 12h4M8 10v4"></path>
                </svg>
            )
        },
        {
            title: 'BGMI CRUCIBLE',
            subtitle: 'SURVIVAL BR',
            desc: 'Drop in teams, clear hostile drops, and survive the gaming circle.',
            color: '#9b5cff',
            xp: '2,500 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                </svg>
            )
        },
        {
            title: 'FIFA PRO',
            subtitle: '1V1 ESPORTS',
            desc: 'Compete in high-frequency bracket matches on console screens.',
            color: '#9b5cff',
            xp: '2,000 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10"></path>
                </svg>
            )
        }
    ],
    'AI & DATA SCIENCE': [
        {
            title: 'MACHINE INTELLIGENCE',
            subtitle: 'NEURAL NETWORKS & TELEMETRY',
            desc: 'Solve deep learning model matrices and run predictive simulations.',
            color: '#2b5cff',
            xp: '3,500 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                </svg>
            )
        },
        {
            title: 'NEURAL HACK',
            subtitle: 'TRANSFORMER TUNING',
            desc: 'Optimize custom transformers and train computer vision parameters.',
            color: '#2b5cff',
            xp: '2,800 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            )
        }
    ],
    'WORKSHOP LAB': [
        {
            title: 'KINETIC METALWORKS',
            subtitle: 'HARDWARE MACHINERY',
            desc: 'Cut and construct architectural rigs using industrial lathe tools.',
            color: '#ffea00',
            xp: '2,600 XP',
            difficulty: 'HARD',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6"></path>
                </svg>
            )
        },
        {
            title: 'CAD BLUEPRINTS',
            subtitle: 'SOLID MODELLING',
            desc: 'Render complex 3D hardware schematics and mechanical parts.',
            color: '#ffea00',
            xp: '2,200 XP',
            difficulty: 'MEDIUM',
            icon: (color) => (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                </svg>
            )
        }
    ]
};

export const CAROUSEL_RADIUS = 12.0;
export const CAROUSEL_OFFSET_Z = 7.6;
export const CAROUSEL_ANGLE_STEP = Math.PI * 2 / 12;

export default function HologramCards() {
    const location = useLocation();
    const navigate = useNavigate();

    const activeCategorySlug = useStore(state => state.activeCategorySlug);
    const setActiveCategorySlug = useStore(state => state.setActiveCategorySlug);

    const { categoryName, eventName } = useMemo(() => {
        const parts = location.pathname.split('/').filter(Boolean);
        return {
            categoryName: parts[1] || null,
            eventName: parts[2] || null
        };
    }, [location.pathname]);

    const selectedDivision = useMemo(() => {
        if (!categoryName) return null;
        const matched = CARD_DATA.find(c => slugify(c.title) === categoryName);
        return matched ? matched.title : null;
    }, [categoryName]);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeRotationIndex, setActiveRotationIndex] = useState(0);

    const startX = useRef(0);
    const isDragging = useRef(false);
    const isScrollLocked = useRef(false);

    // Sync activeRotationIndex to categoryName on route direct load
    useEffect(() => {
        if (categoryName) {
            const idx = CARD_DATA.findIndex(c => slugify(c.title) === categoryName);
            if (idx !== -1 && idx !== activeRotationIndex) {
                setActiveRotationIndex(idx);
            }
        }
    }, [categoryName]);

    // Sync from activeCategorySlug store changes to rotation index (from bottom nav clicking)
    useEffect(() => {
        if (selectedDivision === null && activeCategorySlug) {
            const idx = CARD_DATA.findIndex(c => slugify(c.title) === activeCategorySlug);
            if (idx !== -1 && idx !== activeRotationIndex) {
                setActiveRotationIndex(idx);
            }
        }
    }, [activeCategorySlug, selectedDivision]);

    // Automatically sync activeRotationIndex changes back to store (for bottom nav highlighting)
    useEffect(() => {
        if (selectedDivision === null) {
            const activeCard = CARD_DATA[activeRotationIndex];
            if (activeCard) {
                const slug = slugify(activeCard.title);
                if (activeCategorySlug !== slug) {
                    setActiveCategorySlug(slug);
                }
            }
        }
    }, [activeRotationIndex, selectedDivision, activeCategorySlug, setActiveCategorySlug]);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isTransitioning || selectedDivision || isScrollLocked.current) return;
            
            // Use dominant axis to prevent deltaX + deltaY cancelling each other out on trackpad
            const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) > 20) {
                isScrollLocked.current = true;
                if (delta > 0) {
                    setActiveRotationIndex(prev => (prev + 1) % 7);
                } else {
                    setActiveRotationIndex(prev => (prev - 1 + 7) % 7);
                }
                
                // Keep locked for 500ms to guarantee exactly ONE card transition per user trackpad sweep
                setTimeout(() => {
                    isScrollLocked.current = false;
                }, 500);
            }
        };

        const handleKeyDown = (e) => {
            if (isTransitioning || selectedDivision) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setActiveRotationIndex(prev => (prev + 1) % 7);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setActiveRotationIndex(prev => (prev - 1 + 7) % 7);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTransitioning, selectedDivision]);

    useEffect(() => {
        const handlePointerDown = (e) => {
            if (isTransitioning || selectedDivision) return;
            startX.current = e.clientX;
            isDragging.current = true;
        };

        const handlePointerUp = (e) => {
            if (!isDragging.current) return;
            isDragging.current = false;
            const deltaX = e.clientX - startX.current;
            if (Math.abs(deltaX) > 60) {
                if (deltaX < 0) {
                    setActiveRotationIndex(prev => (prev + 1) % 7);
                } else {
                    setActiveRotationIndex(prev => (prev - 1 + 7) % 7);
                }
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isTransitioning, selectedDivision]);

    const cardRefs = useRef([]);
    const shockwave1Ref = useRef();
    const shockwave2Ref = useRef();
    const shockwave3Ref = useRef();

    const sparksPointsRef = useRef();
    const sparksProgress = useRef(0);
    const sparksColor = useRef(new THREE.Color('#00d9ff'));

    // Uneven star-like glowing spark texture generator
    const sparkTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Glowing radial gradient
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;

        const points = 5;
        const outerRadius = 24;
        const innerRadius = 8;
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / points;

        ctx.beginPath();
        ctx.moveTo(32, 32 - outerRadius);
        for (let i = 0; i < points; i++) {
            const offsetOuter = outerRadius * (0.8 + Math.random() * 0.4);
            let x = 32 + Math.cos(rot) * offsetOuter;
            let y = 32 + Math.sin(rot) * offsetOuter;
            ctx.lineTo(x, y);
            rot += step;

            const offsetInner = innerRadius * (0.8 + Math.random() * 0.4);
            x = 32 + Math.cos(rot) * offsetInner;
            y = 32 + Math.sin(rot) * offsetInner;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.closePath();
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }, []);

    const sparksData = useMemo(() => {
        const count = 200;
        const velocities = new Float32Array(count * 3);
        const randomOffsets = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Velocities: shoot outwards in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const speed = 3.0 + Math.random() * 7.0; // Shoot out at random speeds

            velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            velocities[i * 3 + 2] = Math.cos(phi) * speed;

            // Random offsets to make the blast look irregular
            randomOffsets[i * 3] = (Math.random() - 0.5) * 0.4;
            randomOffsets[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            randomOffsets[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }

        return { velocities, randomOffsets, count };
    }, []);

    const initialPositions = useMemo(() => new Float32Array(200 * 3), []);
    const initialColors = useMemo(() => new Float32Array(200 * 3), []);

    // Glass Shards Data & Refs
    const shardRefs = useRef([]);
    const glassProgress = useRef(0);
    const glassColor = useRef(new THREE.Color('#ffffff'));

    const shardsData = useMemo(() => {
        const count = 35;
        const shards = [];
        for (let i = 0; i < count; i++) {
            shards.push({
                scale: [
                    0.15 + Math.random() * 0.35,
                    0.25 + Math.random() * 0.45,
                    0.02
                ],
                vx: (Math.random() - 0.5) * 8.0,
                vy: (Math.random() - 0.5) * 8.0 + 2.0,
                vz: (Math.random() - 0.5) * 8.0,
                rvx: (Math.random() - 0.5) * 15,
                rvy: (Math.random() - 0.5) * 15,
                rvz: (Math.random() - 0.5) * 15,
                ox: (Math.random() - 0.5) * 1.5,
                oy: (Math.random() - 0.5) * 2.5,
                oz: (Math.random() - 0.5) * 0.2
            });
        }
        return shards;
    }, []);



    // Compute active layout positions dynamically
    const layoutCards = useMemo(() => {
        if (selectedDivision === null) {
            const radius = CAROUSEL_RADIUS;
            const offsetZ = CAROUSEL_OFFSET_Z;
            const angleStep = CAROUSEL_ANGLE_STEP;

            return CARD_DATA.map((card, i) => {
                const diff = (i - activeRotationIndex) % 7;
                const wrappedDiff = diff > 3 ? diff - 7 : (diff < -3 ? diff + 7 : diff);
                const cardAngle = wrappedDiff * angleStep;

                const x = Math.sin(cardAngle) * radius;
                const z = Math.cos(cardAngle) * radius - radius - offsetZ;
                const rotY = -cardAngle * 0.75;

                return {
                    ...card,
                    pos: [x, 3.3, z],
                    rot: [0, rotY, 0],
                    wrappedDiff
                };
            });
        }

        // Sub-events layout inside selected division
        const subList = SUB_EVENTS[selectedDivision] || [];
        const count = subList.length;

        return subList.map((item, idx) => {
            let x = 0;
            let z = -9.6;
            let rotY = 0;

            if (count === 3) {
                if (idx === 0) { x = -4.5; z = -9.6; rotY = 0.15; }
                if (idx === 1) { x = 0; z = -9.6; rotY = 0; }
                if (idx === 2) { x = 4.5; z = -9.6; rotY = -0.15; }
            } else if (count === 2) {
                if (idx === 0) { x = -2.5; z = -9.6; rotY = 0.1; }
                if (idx === 1) { x = 2.5; z = -9.6; rotY = -0.1; }
            }

            return {
                ...item,
                pos: [x, 3.3, z],
                rot: [0, rotY, 0]
            };
        });
    }, [selectedDivision, activeRotationIndex]);

    const activeColor = useMemo(() => {
        if (selectedDivision) {
            const matched = CARD_DATA.find(c => c.title === selectedDivision);
            return matched ? matched.color : '#00d9ff';
        }
        const activeCard = CARD_DATA[activeRotationIndex];
        return activeCard ? activeCard.color : '#00d9ff';
    }, [selectedDivision, activeRotationIndex]);

    // ── Transition: Category Card Launch Click ──
    const handleLaunch = (card) => {
        if (isTransitioning) return;

        if (selectedDivision) {
            // It is a sub-event card, navigate to registration path!
            const catSlug = slugify(selectedDivision);
            const eventSlug = slugify(card.title);
            navigate(`/event/${catSlug}/${eventSlug}`);
            return;
        }

        setIsTransitioning(true);

        // 1. Combine phase: Animate all currently rendered cards to the center console
        const tl = gsap.timeline({
            onComplete: () => {
                // Navigate to the category route!
                const slug = slugify(card.title);
                navigate(`/event/${slug}`);
                setIsTransitioning(false);

                // Trigger 3D neon shockwave burst
                triggerShockwave(card.color);

                // Trigger Camera Shake
                const state = useStore.getState();
                if (state.setShakeIntensity) {
                    state.setShakeIntensity(0.85);
                    gsap.to({ val: 0.85 }, {
                        val: 0,
                        duration: 1.25,
                        ease: 'power2.out',
                        onUpdate: function () {
                            state.setShakeIntensity(this.targets()[0].val);
                        }
                    });
                }
            }
        });

        cardRefs.current.forEach((ref) => {
            if (ref) {
                tl.to(ref.position, { x: 0, y: 3.3, z: -9.6, duration: 0.85, ease: 'power3.inOut' }, 0);
                tl.to(ref.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.85, ease: 'power3.inOut' }, 0);
                tl.to(ref.rotation, { x: 0, y: 0, z: 0, duration: 0.85, ease: 'power3.inOut' }, 0);
            }
        });
    };

    // ── Transition: Return back to Categories ──
    const handleBack = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        // Combine sub-events back to center
        const tl = gsap.timeline({
            onComplete: () => {
                navigate('/event');
                setIsTransitioning(false);
                triggerShockwave('#00d9ff', true);
            }
        });

        cardRefs.current.forEach((ref) => {
            if (ref) {
                tl.to(ref.position, { x: 0, y: 3.3, z: -9.6, duration: 0.85, ease: 'power3.inOut' }, 0);
                tl.to(ref.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.85, ease: 'power3.inOut' }, 0);
                tl.to(ref.rotation, { x: 0, y: 0, z: 0, duration: 0.85, ease: 'power3.inOut' }, 0);
            }
        });
    };

    // ── Holographic 3D Expanding Shockwave Burst ──
    const triggerShockwave = (color, isSingle = false) => {
        // Trigger sparks animation & update color attributes
        if (sparksPointsRef.current) {
            const baseColor = new THREE.Color(color);
            const colorsArray = sparksPointsRef.current.geometry.attributes.color.array;

            for (let i = 0; i < sparksData.count; i++) {
                let sparkColor;
                const rand = Math.random();
                if (rand < 0.3) {
                    sparkColor = new THREE.Color('#ffffff'); // White-hot
                } else if (rand < 0.6) {
                    sparkColor = new THREE.Color('#ffb03b').lerp(baseColor, 0.3); // Bright electric gold
                } else {
                    sparkColor = baseColor.clone().multiplyScalar(1.3 + Math.random() * 0.4); // Bright theme color
                }
                colorsArray[i * 3] = sparkColor.r;
                colorsArray[i * 3 + 1] = sparkColor.g;
                colorsArray[i * 3 + 2] = sparkColor.b;
            }
            sparksPointsRef.current.geometry.attributes.color.needsUpdate = true;

            sparksProgress.current = 0;
            gsap.killTweensOf(sparksProgress);
            gsap.to(sparksProgress, {
                current: 1.0,
                duration: 1.2,
                ease: 'power2.out'
            });
        }

        // Trigger glass shards animation
        glassColor.current.set(color);
        glassProgress.current = 0;
        gsap.killTweensOf(glassProgress);
        gsap.to(glassProgress, {
            current: 1.0,
            duration: 1.4,
            ease: 'power1.out'
        });

        // Shockwave 1: Main fast blast
        if (shockwave1Ref.current) {
            const mesh = shockwave1Ref.current;
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.material.color.set(color);
            mesh.material.opacity = 0.9;
            gsap.to(mesh.scale, { x: 18, y: 18, z: 18, duration: 1.0, ease: 'power4.out' });
            gsap.to(mesh.material, { opacity: 0, duration: 1.0, ease: 'power4.out' });
        }

        if (isSingle) return;

        // Shockwave 2: Secondary wave with 0.12s delay
        if (shockwave2Ref.current) {
            const mesh = shockwave2Ref.current;
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.material.color.set(color);
            mesh.material.opacity = 0.7;
            gsap.to(mesh.scale, { x: 16, y: 16, z: 16, duration: 1.2, delay: 0.12, ease: 'power3.out' });
            gsap.to(mesh.material, { opacity: 0, duration: 1.2, delay: 0.12, ease: 'power3.out' });
        }

        // Shockwave 3: Tertiary slow massive wave with 0.25s delay
        if (shockwave3Ref.current) {
            const mesh = shockwave3Ref.current;
            mesh.scale.set(0.1, 0.1, 0.1);
            mesh.material.color.set(color);
            mesh.material.opacity = 0.5;
            gsap.to(mesh.scale, { x: 20, y: 20, z: 20, duration: 1.5, delay: 0.25, ease: 'power2.out' });
            gsap.to(mesh.material, { opacity: 0, duration: 1.5, delay: 0.25, ease: 'power2.out' });
        }
    };

    useFrame((state) => {
        // 1. Animate Sparks Particles
        if (sparksPointsRef.current) {
            const progress = sparksProgress.current;
            if (progress > 0 && progress < 1) {
                const positions = sparksPointsRef.current.geometry.attributes.position.array;
                const velocities = sparksData.velocities;
                const randomOffsets = sparksData.randomOffsets;

                // Center of the blast: [0, 3.3, -9.6]
                const centerX = 0;
                const centerY = 3.3;
                const centerZ = -9.6;

                for (let i = 0; i < sparksData.count; i++) {
                    const gravity = -4.0 * progress * progress;
                    positions[i * 3] = centerX + randomOffsets[i * 3] + velocities[i * 3] * progress;
                    positions[i * 3 + 1] = centerY + randomOffsets[i * 3 + 1] + velocities[i * 3 + 1] * progress + gravity;
                    positions[i * 3 + 2] = centerZ + randomOffsets[i * 3 + 2] + velocities[i * 3 + 2] * progress;
                }

                sparksPointsRef.current.geometry.attributes.position.needsUpdate = true;
                sparksPointsRef.current.material.opacity = (1 - progress) * 0.95;
                sparksPointsRef.current.material.size = 0.28 * (1 - progress * 0.65); // Larger and brighter
                sparksPointsRef.current.visible = true;
            } else {
                sparksPointsRef.current.visible = false;
            }
        }

        // 2. Animate Glass Shards
        const gProgress = glassProgress.current;
        if (gProgress > 0 && gProgress < 1) {
            const centerX = 0;
            const centerY = 3.3;
            const centerZ = -9.6;

            shardsData.forEach((shard, idx) => {
                const mesh = shardRefs.current[idx];
                if (mesh) {
                    const gravity = -5.0 * gProgress * gProgress;
                    mesh.position.x = centerX + shard.ox + shard.vx * gProgress;
                    mesh.position.y = centerY + shard.oy + shard.vy * gProgress + gravity;
                    mesh.position.z = centerZ + shard.oz + shard.vz * gProgress;

                    mesh.rotation.x = shard.rvx * gProgress;
                    mesh.rotation.y = shard.rvy * gProgress;
                    mesh.rotation.z = shard.rvz * gProgress;

                    mesh.material.opacity = (1 - gProgress) * 0.85;
                    mesh.material.color.copy(glassColor.current);
                    mesh.visible = true;
                }
            });
        } else {
            shardsData.forEach((_, idx) => {
                const mesh = shardRefs.current[idx];
                if (mesh) mesh.visible = false;
            });
        }
    });

    return (
        <group>
            {/* Ambient neon fill lights for the hologram chamber */}
            <pointLight position={[-10, 10, -5]} intensity={35} color={activeColor} distance={30} decay={2} />
            <pointLight position={[0, 12, -5]} intensity={50} color={activeColor} distance={30} decay={2} />
            <pointLight position={[10, 10, -5]} intensity={35} color={activeColor} distance={30} decay={2} />

            {/* Invisible Top-Right Light Source */}
            <directionalLight position={[18, 20, 8]} intensity={12.0} color="#ffffff" />
            <pointLight position={[14, 14, 5]} intensity={200} color={activeColor} distance={45} decay={1.5} />
            <pointLight position={[-16, -1, 4]} intensity={180} color={activeColor} distance={45} decay={1.5} />

            {/* Retro-futuristic Grid Floor */}
            <gridHelper args={[100, 50, activeColor, '#031930']} position={[0, -2, -10]} opacity={0.25} transparent />

            {/* Title Headers */}
            {!eventName && (
                <LobbyHeader 
                    selectedDivision={selectedDivision} 
                    activeTitle={selectedDivision || CARD_DATA[activeRotationIndex]?.title} 
                    sctrId={(selectedDivision ? CARD_DATA.findIndex(c => c.title === selectedDivision) : activeRotationIndex) + 1}
                />
            )}

            {/* Background Holographic Weapon Showcase — main lobby only */}
            {!eventName && !selectedDivision && (
                <Suspense fallback={null}>
                    <WeaponShowcase activeColor={activeColor} />
                </Suspense>
            )}

            {/* Mecha Robot Hologram — Robotics & RC category page */}
            {selectedDivision === 'ROBOTICS & RC' && !eventName && (
                <Suspense fallback={null}>
                    <RobotShowcase activeColor={activeColor} />
                </Suspense>
            )}

            {/* Left & Right floating holographic HUD consoles */}
            {!eventName && (
                <>
                    <HudWidget position={[-10.5, 4.2, -9.5]} rotation={[0, 0.5, 0]} side="left" />
                    <HudWidget position={[10.5, 4.2, -9.5]} rotation={[0, -0.5, 0]} side="right" />
                </>
            )}

            {/* 3D Shockwave expansion meshes (Multi-layered shockwaves) */}
            <mesh ref={shockwave1Ref} position={[0, 3.3, -9.6]}>
                <ringGeometry args={[0.9, 1.05, 64]} />
                <meshBasicMaterial transparent opacity={0} color="#00d9ff" side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={shockwave2Ref} position={[0, 3.3, -9.6]}>
                <ringGeometry args={[0.7, 0.85, 64]} />
                <meshBasicMaterial transparent opacity={0} color="#00d9ff" side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={shockwave3Ref} position={[0, 3.3, -9.6]}>
                <ringGeometry args={[0.5, 0.65, 64]} />
                <meshBasicMaterial transparent opacity={0} color="#00d9ff" side={THREE.DoubleSide} />
            </mesh>

            {/* Blast Sparks Particle System */}
            <points ref={sparksPointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={initialPositions.length / 3}
                        array={initialPositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={initialColors.length / 3}
                        array={initialColors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.25}
                    transparent
                    opacity={0}
                    vertexColors
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    map={sparkTexture}
                    alphaTest={0.01}
                />
            </points>

            {/* Glass Shards Break Effect */}
            <group>
                {shardsData.map((shard, idx) => (
                    <mesh
                        key={idx}
                        ref={(el) => shardRefs.current[idx] = el}
                        scale={shard.scale}
                    >
                        <coneGeometry args={[0.5, 1.0, 3]} />
                        <meshStandardMaterial
                            transparent
                            opacity={0}
                            roughness={0.05}
                            metalness={0.95}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))}
            </group>

            {/* HTML Back Nav Button */}
            {selectedDivision && !eventName && (
                <Html position={[0, 0.4, -9.0]} center>
                    <button
                        onClick={handleBack}
                        className="pointer-events-auto px-10 py-3.5 bg-black text-[#00f0ff] hover:text-white border-2 border-[#00f0ff] font-mono text-[10px] tracking-[0.25em] font-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] relative overflow-hidden"
                        style={{
                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                            minWidth: '290px'
                        }}
                    >
                        {/* Laser light scan sweep effect */}
                        <span className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent -translate-x-12 hover:translate-x-[300px] transition-transform duration-1000 ease-out" />

                        {/* Futuristic design markers */}
                        <span className="absolute top-[2px] right-2 text-[6px] tracking-normal text-[#00f0ff]/50">SYS.RETURN</span>
                        <span className="absolute bottom-[2px] left-2 text-[6px] tracking-normal text-[#00f0ff]/50">LOBBY_V2</span>

                        [ ESC_RETURN_TO_DECK ]
                    </button>
                </Html>
            )}

            {/* Symmetrically aligned categories / sub-event cards (hidden on active event registration) */}
            {!eventName && layoutCards.map((card, i) => (
                <SingleCard
                    key={card.title}
                    data={card}
                    index={i}
                    onLaunch={handleLaunch}
                    isTransitioning={isTransitioning}
                    selectedDivision={selectedDivision}
                    isActive={selectedDivision !== null || i === activeRotationIndex}
                    wrappedDiff={card.wrappedDiff !== undefined ? card.wrappedDiff : 0}
                    onClickCard={() => {
                        if (selectedDivision !== null) {
                            handleLaunch(card);
                        } else {
                            if (i !== activeRotationIndex) {
                                setActiveRotationIndex(i);
                            }
                        }
                    }}
                    ref={(el) => cardRefs.current[i] = el}
                />
            ))}
        </group>
    );
}

// ── Background Holographic Weapon Showcase (Main Lobby) ─────────────────────
function WeaponShowcase({ activeColor }) {
    const showRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();

    const { scene } = useGLTF('/models/gun/scene.gltf');

    const blueprintModel = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    color: activeColor,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.15,
                });
            }
        });
        return clone;
    }, [scene, activeColor]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (showRef.current) {
            showRef.current.rotation.y = t * 0.12;
            showRef.current.position.y = 8.8 + Math.sin(t * 0.5) * 0.2;
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.22;
        if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.14;
    });

    return (
        <group>
            <group ref={showRef} position={[0, 8.8, -14.5]} scale={[0.18, 0.18, 0.18]}>
                <primitive object={blueprintModel} rotation={[0, -Math.PI / 2, 0]} position={[0, -2.0, 0]} />
            </group>

            <mesh ref={ring1Ref} position={[0, 8.8, -14.8]} rotation={[0, 0, 0]}>
                <ringGeometry args={[3.2, 3.23, 64]} />
                <meshBasicMaterial color={activeColor} transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ring2Ref} position={[0, 8.8, -14.9]} rotation={[0, 0, 0]}>
                <ringGeometry args={[2.5, 2.52, 48]} />
                <meshBasicMaterial color={activeColor} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            <Html
                transform
                distanceFactor={7.5}
                position={[0, 5.2, -14.5]}
                style={{
                    color: '#00d9ff',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    opacity: 0.4,
                    letterSpacing: '2px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                DIAGNOSTICS: XEN_SLR_BLUEPRINT_HUD
            </Html>
        </group>
    );
}

// ── Mecha Robot Hologram (Robotics & RC Category Page) ───────────────────────
function RobotShowcase({ activeColor }) {
    const robotRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();

    const { scene } = useGLTF('/models/mecha/scene.gltf');

    // Auto-center + auto-scale the mecha model via Box3 so it always appears
    // regardless of its internal coordinate offsets
    const { mechaModel, scale: autoScale, offset } = useMemo(() => {
        const clone = scene.clone();

        // Apply wireframe hologram material
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    color: activeColor,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.30,
                });
            }
        });

        // Compute bounding box of the raw model
        const box = new THREE.Box3().setFromObject(clone);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Desired display height ~6 world units (roughly matches gun height)
        const desiredHeight = 6.0;
        const modelHeight = size.y || 1;
        const s = desiredHeight / modelHeight;

        return { mechaModel: clone, scale: s, offset: center };
    }, [scene, activeColor]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (robotRef.current) {
            robotRef.current.rotation.y = t * 0.08;
            robotRef.current.position.y = 6.0 + Math.sin(t * 0.4) * 0.25;
        }
        if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.18;
        if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.12;
    });

    return (
        <group>
            {/* Model centered via negative offset then scaled to desired height */}
            <group ref={robotRef} position={[0, 6.0, -12.0]} scale={[autoScale, autoScale, autoScale]}>
                <primitive
                    object={mechaModel}
                    position={[-offset.x, -offset.y, -offset.z]}
                    rotation={[0, Math.PI, 0]}
                />
            </group>

            <mesh ref={ring1Ref} position={[0, 3.5, -12.2]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[4.5, 4.55, 64]} />
                <meshBasicMaterial color={activeColor} transparent opacity={0.22} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ring2Ref} position={[0, 3.5, -12.3]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[3.2, 3.24, 48]} />
                <meshBasicMaterial color={activeColor} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            <Html
                transform
                distanceFactor={7.5}
                position={[0, 1.0, -12.0]}
                style={{
                    color: activeColor,
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    opacity: 0.5,
                    letterSpacing: '2px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                MECHA_UNIT: RC_AUTONOMOUS_MOTOR_HUD
            </Html>
        </group>
    );
}


// ── Lobby Title Header ────────────────────────────────────────────────────────
function LobbyHeader({ selectedDivision, activeTitle, sctrId }) {
    return (
        <group position={[0, selectedDivision ? 8.6 : 11.4, -10.5]}>
            <mesh position={[0, -0.45, 0]}>
                <planeGeometry args={[16, 0.03]} />
                <meshBasicMaterial color="#00d9ff" toneMapped={false} />
            </mesh>
            <Html
                transform
                distanceFactor={8.0}
                position={[0, 0, 0]}
                style={{
                    width: '750px',
                    color: '#00d9ff',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}>
                    <div style={{ color: '#ffffff', opacity: 0.35, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        // ACCESS TERMINAL SYNCED // SCTR_DATA_STREAM RESOLVED
                    </div>
                    <div style={{ fontSize: '30px', fontWeight: 950, letterSpacing: '6px' }}>
                        {selectedDivision ? 'INITIALIZING' : 'ENGAGING'} SECTOR 0{sctrId}
                    </div>
                </div>
            </Html>
        </group>
    );
}

// ── Floating HUD Widget ───────────────────────────────────────────────────────
function HudWidget({ position, rotation, side }) {
    const ref = useRef();

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.elapsedTime;
        ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
        ref.current.rotation.y = rotation[1] + Math.cos(t * 0.8) * 0.02;
    });

    const lines = side === 'left'
        ? ['SYS_STATUS: READY', 'ARENA_LOBBY: ACTIVE', 'XP_BOOST: 2.0X', 'PING: 24MS']
        : ['SERVERS: ONLINE', 'PLAYERS: 2,026', 'ACTIVE_QUESTS: 5', 'SEC_SECTOR: SECURE'];

    const accentColor = side === 'left' ? '#ff1f4f' : '#9b5cff';

    const panelGeo = useMemo(() => new THREE.PlaneGeometry(2.0, 3.0), []);
    const edgesGeo = useMemo(() => new THREE.EdgesGeometry(panelGeo), [panelGeo]);

    return (
        <group ref={ref} position={position} rotation={rotation}>
            <mesh geometry={panelGeo}>
                <meshBasicMaterial color={accentColor} transparent opacity={0.03} />
            </mesh>
            <lineSegments geometry={edgesGeo}>
                <lineBasicMaterial color={accentColor} opacity={0.3} transparent />
            </lineSegments>

            <Html
                transform
                distanceFactor={4.5}
                position={[0, 0, 0.02]}
                style={{
                    width: '180px',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div style={{ padding: '10px' }}>
                    <div style={{ color: accentColor, fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px', marginBottom: '15px', textAlign: 'center' }}>
                        [HUD_CONSOLE]
                    </div>
                    {lines.map((line) => (
                        <div key={line} style={{ fontSize: '10px', opacity: 0.7, marginBottom: '8px' }}>
                            {line}
                        </div>
                    ))}
                </div>
            </Html>
        </group>
    );
}

// ── Single Hologram Card (Forward Reference Enabled for GSAP tracking) ────────
const SingleCard = forwardRef(({ data, index, onLaunch, isTransitioning, selectedDivision, isActive, wrappedDiff, onClickCard }, ref) => {
    const cardRef = useRef();
    const crystalRef = useRef();
    const laserRef = useRef();
    const [meshHovered, setMeshHovered] = useState(false);
    const [btnHovered, setBtnHovered] = useState(false);
    const hovered = isActive && (meshHovered || btnHovered);
    const [isBlasting, setIsBlasting] = useState(true);

    // Box Geometry: [Width, Height, Thickness] - Upscaled to look extra massive from ground level
    const cardGeo = useMemo(() => new THREE.BoxGeometry(3.7, 6.1, 0.12), []);
    const cardEdgesGeo = useMemo(() => new THREE.EdgesGeometry(cardGeo), [cardGeo]);
    const innerGridGeo = useMemo(() => new THREE.PlaneGeometry(3.3, 5.7), []);

    // Cylinder geometries for neon light tubes
    const tubeGeo = useMemo(() => new THREE.CylinderGeometry(0.024, 0.024, 5.5, 8), []);

    const scaleVec = useMemo(() => new THREE.Vector3(), []);

    // Expose local cardRef as parent ref hook
    useImperativeHandle(ref, () => cardRef.current);

    // ── Explode / Blast Outward Animation on Mount ──
    useEffect(() => {
        if (cardRef.current) {
            setIsBlasting(true);

            // Set starting point to center console
            cardRef.current.position.set(0, 3.3, -9.6);
            cardRef.current.scale.set(0.01, 0.01, 0.01);
            cardRef.current.rotation.set(0, 0, 0);

            const delay = index * 0.08;

            gsap.to(cardRef.current.position, {
                x: data.pos[0],
                y: data.pos[1],
                z: data.pos[2],
                duration: 1.25,
                delay: delay,
                ease: 'back.out(1.1)'
              });

              gsap.to(cardRef.current.scale, {
                  x: 1.0,
                  y: 1.0,
                  z: 1.0,
                  duration: 1.25,
                  delay: delay,
                  ease: 'back.out(1.1)'
              });

              gsap.to(cardRef.current.rotation, {
                  x: data.rot[0],
                  y: data.rot[1],
                  z: data.rot[2],
                  duration: 1.25,
                  delay: delay,
                  ease: 'power3.out',
                  onComplete: () => {
                      setIsBlasting(false);
                  }
              });
          }
      }, [data.pos, data.rot, index]);

      const currentAngle = useRef(null);

      useEffect(() => {
          currentAngle.current = null;
      }, [selectedDivision]);

      useFrame(({ clock }) => {
          if (!cardRef.current || isTransitioning || isBlasting) return;
          const t = clock.elapsedTime + index * 10;

          let targetX = data.pos[0];
          let targetY = data.pos[1];
          let targetZ = hovered ? data.pos[2] + 0.25 : data.pos[2];

          let baseRotY = data.rot[1];

          if (selectedDivision === null) {
              const targetAngle = wrappedDiff * CAROUSEL_ANGLE_STEP;
              if (currentAngle.current === null) {
                  currentAngle.current = targetAngle;
              }
              const diffAngle = targetAngle - currentAngle.current;
              const wrappedDiffAngle = Math.atan2(Math.sin(diffAngle), Math.cos(diffAngle));
              currentAngle.current += wrappedDiffAngle * 0.05;

              baseRotY = -currentAngle.current * 0.75;
              targetX = Math.sin(currentAngle.current) * CAROUSEL_RADIUS;
              const baseZ = Math.cos(currentAngle.current) * CAROUSEL_RADIUS - CAROUSEL_RADIUS - CAROUSEL_OFFSET_Z;
              targetZ = hovered ? baseZ + 0.25 : baseZ;
              targetY = 3.3;
          }

          const targetScale = hovered ? 1.03 : 1.0;

          const targetRotX = hovered ? 0.02 : 0;
          const targetRotY = hovered ? baseRotY - 0.02 : baseRotY;
          const targetRotZ = 0;

          // Smoothly interpolate current state to targets (0.05 for liquid-smooth hydraulic transition)
          cardRef.current.position.x = THREE.MathUtils.lerp(cardRef.current.position.x, targetX, 0.05);
          cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, targetY, 0.05);
          cardRef.current.position.z = THREE.MathUtils.lerp(cardRef.current.position.z, targetZ, 0.05);

          scaleVec.set(targetScale, targetScale, targetScale);
          cardRef.current.scale.lerp(scaleVec, 0.05);

          cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, targetRotX, 0.05);
          cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetRotY, 0.05);
          cardRef.current.rotation.z = THREE.MathUtils.lerp(cardRef.current.rotation.z, targetRotZ, 0.05);

          // Spin crystal faster when hovered
          if (crystalRef.current) {
              crystalRef.current.rotation.x = t * (hovered ? 1.1 : 0.4);
              crystalRef.current.rotation.y = t * (hovered ? 1.6 : 0.65);
          }

          // Pulse the neon tubes' brightness
          if (laserRef.current) {
              laserRef.current.opacity = (isActive ? 0.75 : 0.25) + Math.sin(t * 6.0) * 0.15;
          }
      });

      // Opacity filters
      const finalOpacity = isActive ? (hovered ? 0.6 : 0.4) : (Math.abs(wrappedDiff) === 1 ? 0.12 : 0.03);
      const frameOpacity = isActive ? (hovered ? 1.0 : 0.6) : (Math.abs(wrappedDiff) === 1 ? 0.3 : 0.08);

      return (
          <group>
              <group ref={cardRef} position={data.pos} rotation={data.rot}>
                  {/* 1. Floating Crystal behind the card */}
                  <mesh ref={crystalRef} position={[0, 0, -1.8]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                      <boxGeometry args={[0.9, 0.9, 0.9]} />
                      <meshBasicMaterial color={data.color} wireframe transparent opacity={isActive ? (hovered ? 0.45 : 0.22) : 0.05} />
                  </mesh>

                  {/* 2. Glassmorphic 3D Box Panel (Dynamically handles pointer hover & clicking on the moving card!) */}
                  <mesh
                      geometry={cardGeo}
                      onPointerOver={(e) => {
                          if (isTransitioning || isBlasting) return;
                          e.stopPropagation();
                          setMeshHovered(true);
                      }}
                      onPointerOut={(e) => {
                          e.stopPropagation();
                          setMeshHovered(false);
                      }}
                      onClick={(e) => {
                          if (isTransitioning || isBlasting) return;
                          e.stopPropagation();
                          onClickCard();
                      }}
                  >
                      <meshPhysicalMaterial
                          color="#04091a"
                          transmission={0.88}
                          opacity={finalOpacity}
                          transparent
                          roughness={0.1}
                          metalness={0.25}
                          ior={1.25}
                          thickness={0.8}
                          side={THREE.DoubleSide}
                      />
                  </mesh>

                  {/* 3. Glowing Neon Wire Border Frame */}
                  <lineSegments geometry={cardEdgesGeo}>
                      <lineBasicMaterial color={data.color} linewidth={isActive && hovered ? 4.0 : 2.0} opacity={frameOpacity} transparent />
                  </lineSegments>

                  {/* Glowing Vertical Neon Tubes on the sides */}
                  <mesh position={[-1.9, 0, 0.06]} geometry={tubeGeo}>
                      <meshBasicMaterial ref={laserRef} color={data.color} toneMapped={false} transparent opacity={isActive ? 0.8 : 0.25} />
                  </mesh>
                  <mesh position={[1.9, 0, 0.06]} geometry={tubeGeo}>
                      <meshBasicMaterial color={data.color} toneMapped={false} transparent opacity={isActive ? 0.8 : 0.25} />
                  </mesh>

                  {/* Corner brackets */}
                  <CornerBracket pos={[-1.85, 3.05, 0.06]} color={data.color} opacity={isActive ? 1.0 : 0.3} />
                  <CornerBracket pos={[1.85, 3.05, 0.06]} color={data.color} rotation={[0, 0, -Math.PI / 2]} opacity={isActive ? 1.0 : 0.3} />
                  <CornerBracket pos={[-1.85, -3.05, 0.06]} color={data.color} rotation={[0, 0, Math.PI / 2]} opacity={isActive ? 1.0 : 0.3} />
                  <CornerBracket pos={[1.85, -3.05, 0.06]} color={data.color} rotation={[0, 0, Math.PI]} opacity={isActive ? 1.0 : 0.3} />

                  {/* Inner Tech Grid Lines */}
                  <mesh position={[0, 0, 0.005]} geometry={innerGridGeo}>
                      <meshBasicMaterial color={data.color} wireframe transparent opacity={isActive ? 0.07 : 0.015} />
                  </mesh>

                  {/* 4. Text Content Overlay */}
                  <Html
                      transform
                      distanceFactor={4.6}
                      position={[0, 0, 0.1]}
                      style={{
                          width: '290px',
                          color: '#ffffff',
                          fontFamily: 'sans-serif',
                          textAlign: 'center',
                          userSelect: 'none',
                          pointerEvents: 'none',
                      }}
                  >
                      <div style={{
                          padding: '15px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'all 0.3s ease',
                          pointerEvents: 'none'
                      }}>
                          <div style={{
                              marginBottom: '12px',
                              filter: isActive && hovered ? `drop-shadow(0 0 8px ${data.color})` : 'none',
                              transform: isActive && hovered ? 'scale(1.1) rotate(4deg)' : 'none',
                              transition: 'transform 0.3s ease',
                              opacity: isActive ? 1.0 : 0.35
                          }}>
                              {data.icon(data.color)}
                          </div>

                          <h2 style={{
                              color: data.color,
                              margin: '0 0 6px 0',
                              fontSize: '18px',
                              fontWeight: 950,
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              textShadow: isActive && hovered ? `0 0 10px ${data.color}` : 'none',
                              lineHeight: 1.2,
                              opacity: isActive ? 1.0 : 0.45
                          }}>
                              {data.title}
                          </h2>

                          <h3 style={{
                              color: '#ffffff',
                              opacity: isActive ? (hovered ? 1.0 : 0.8) : 0.25,
                              margin: '0 0 14px 0',
                              fontSize: '10px',
                              fontWeight: 800,
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                          }}>
                              {data.subtitle}
                          </h3>

                          {/* Detail fields are only visible on active categories or sub-events */}
                          {isActive && (
                              <>
                                  <p style={{
                                      color: '#ffffff',
                                      opacity: hovered ? 0.8 : 0.55,
                                      fontSize: '11px',
                                      lineHeight: 1.3,
                                      margin: '0 0 24px 0',
                                      minHeight: '44px'
                                  }}>
                                      {data.desc}
                                  </p>

                                  {/* Launch / Register Button */}
                                  <div
                                      onMouseEnter={() => setBtnHovered(true)}
                                      onMouseLeave={() => setBtnHovered(false)}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          onLaunch(data);
                                      }}
                                      className="cursor-pointer"
                                      style={{
                                          border: `1.5px solid ${data.color}`,
                                          background: hovered ? `${data.color}35` : `${data.color}18`,
                                          padding: '8px 14px',
                                          fontSize: '10px',
                                          fontWeight: 900,
                                          color: hovered ? '#ffffff' : data.color,
                                          letterSpacing: '1px',
                                          textTransform: 'uppercase',
                                          borderRadius: '4px',
                                          boxShadow: hovered ? `0 0 15px ${data.color}44` : 'none',
                                          transition: 'all 0.3s ease',
                                          userSelect: 'none',
                                          pointerEvents: 'auto'
                                      }}
                                  >
                                      {selectedDivision ? 'REGISTER NOW' : 'LAUNCH QUEST'}
                                  </div>
                              </>
                          )}
                      </div>
                  </Html>
              </group>
          </group>
      );
  });

  // Decorative L-bracket corner elements
  function CornerBracket({ pos, color, rotation = [0, 0, 0], opacity = 1.0 }) {
      const points = useMemo(() => [
          new THREE.Vector3(-0.3, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -0.3, 0)
      ], []);

      const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

      return (
          <line position={pos} rotation={rotation} geometry={lineGeo}>
              <lineBasicMaterial color={color} linewidth={3.0} transparent opacity={opacity} />
          </line>
      );
  }

// Pre-load assets to avoid stuttering
useGLTF.preload('/models/gun/scene.gltf');
useGLTF.preload('/models/mecha/scene.gltf');
