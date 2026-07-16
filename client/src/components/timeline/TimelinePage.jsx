/**
 * TimelinePage.jsx — MISSION COMMAND CENTER
 *
 * Three-day mission archive with:
 *  • Steampunk clock rendered as holographic 3D background (cyan wireframe glow)
 *  • Futuristic "save slot" day selectors
 *  • Snake-shaped neon mission route per day
 *  • Right-side HUD panel with event details
 *  • Category-specific holographic node icons
 *  • Boot sequence + holographic day-switch transitions
 *  • Radar / particle / grid animated background
 *  • Fully responsive (desktop + mobile)
 */

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import TimelineNav from './TimelineNav';

/* ═══════════════════════════════════════════
   MISSION DATA
═══════════════════════════════════════════ */
const CATEGORY_ICONS = {
    Gaming:    { icon: '🎮', color: '#9B5CFF' },
    Robotics:  { icon: '🤖', color: '#00E5FF' },
    Coding:    { icon: '💻', color: '#FF2CFB' },
    Workshop:  { icon: '⚙️', color: '#FF9D00' },
    AI:        { icon: '🧠', color: '#1FFF76' },
    Electrical:{ icon: '⚡', color: '#FFD700' },
    Creative:  { icon: '🎨', color: '#FF1F4F' },
    Cultural:  { icon: '🎵', color: '#FF2CFB' },
};

const DAYS = [
    {
        slot: 'SLOT 01',
        label: 'DAY 1',
        date: 'Sep 12',
        color: '#00E5FF',
        events: [
            { id: 'D1E1', title: 'ROBOTICS RACE', subtitle: 'RC VEHICLES', category: 'Robotics', time: '09:00', end: '10:30', venue: 'Lab Alpha', mode: 'Team (4)', registered: 128, prize: '₹15,000', desc: 'High-speed RC car racing and precision obstacle navigation in futuristic tracks.' },
            { id: 'D1E2', title: 'BUG HUNT',      subtitle: 'CODE DEBUGGING', category: 'Coding', time: '09:30', end: '11:00', venue: 'Lab Beta',  mode: 'Solo',       registered: 96,  prize: '₹10,000', desc: 'Scan hidden bugs in code segments under competitive time pressure.' },
            { id: 'D1E3', title: 'BGMI QUALS',    subtitle: 'BATTLE ROYALE',  category: 'Gaming', time: '10:00', end: '12:00', venue: 'Arena Omega',mode: 'Squad (4)', registered: 64,  prize: '₹20,000', desc: 'BGMI squad tournament — top 4 squads advance to the grand finals.' },
            { id: 'D1E4', title: 'CIRCUIT LAB',   subtitle: 'ELECTRONICS',    category: 'Electrical',time:'10:30',end:'12:00',venue:'Sigma Hall', mode: 'Solo',       registered: 80,  prize: '₹8,000',  desc: 'Breadboard wiring, logic gates, and analog circuit design challenges.' },
            { id: 'D1E5', title: 'BYTE CODE',     subtitle: 'ALGORITHMS',     category: 'Coding', time: '12:00', end: '14:00', venue: 'Lab Beta',  mode: 'Solo',       registered: 112, prize: '₹12,000', desc: 'Optimize code under time constraints — crack algorithmic puzzles at speed.' },
            { id: 'D1E6', title: 'LINE FOLLOWER', subtitle: 'AUTONOMOUS BOT', category: 'Robotics',time: '13:00', end: '15:00', venue: 'Lab Alpha', mode: 'Team (2)', registered: 60,  prize: '₹10,000', desc: 'Program robots to follow tracks and complete obstacle circuits autonomously.' },
            { id: 'D1E7', title: 'AI CHALLENGE',  subtitle: 'NEURAL MODELS',  category: 'AI',     time: '14:00', end: '16:00', venue: 'Hub Delta',  mode: 'Team (3)', registered: 72,  prize: '₹18,000', desc: 'Train and deploy machine learning models to solve real-world datasets.' },
            { id: 'D1E8', title: 'POTTERY THROW', subtitle: 'CREATIVE ARTS',  category: 'Creative',time: '15:00',end:'17:00', venue:'Studio Gamma',mode: 'Solo',      registered: 40,  prize: '₹5,000',  desc: 'Traditional pottery wheel sessions judged on form, creativity, and execution.' },
            { id: 'D1E9', title: 'FIFA 1V1',      subtitle: 'ESPORTS',        category: 'Gaming', time: '16:00', end: '18:00', venue: 'Arena Omega',mode: 'Solo',       registered: 88,  prize: '₹15,000', desc: 'Head-to-head FIFA tournament on PS5 — knockout bracket format.' },
        ],
    },
    {
        slot: 'SLOT 02',
        label: 'DAY 2',
        date: 'Sep 13',
        color: '#7A5CFF',
        events: [
            { id: 'D2E1', title: 'DRONE WARS',    subtitle: 'AERIAL BATTLE',  category: 'Robotics',time: '08:00', end:'10:00',venue:'Rooftop A',   mode:'Team (2)',    registered: 44,  prize: '₹20,000', desc: 'FPV drone racing and obstacle course in the open arena roof space.' },
            { id: 'D2E2', title: 'HACKATHON',     subtitle: '24HR SPRINT',    category: 'Coding', time: '09:00', end: '13:00', venue: 'Lab Beta',  mode: 'Team (4)', registered: 80,  prize: '₹25,000', desc: 'Build a working prototype in 4 hours — problem statement revealed at start.' },
            { id: 'D2E3', title: 'VALORANT',      subtitle: 'TACTICAL SHOOTER',category:'Gaming', time: '10:00', end: '13:00', venue: 'Arena Omega',mode:'Squad (5)',  registered: 50,  prize: '₹25,000', desc: '5v5 Valorant tournament in custom lobby — defuse map rotation.' },
            { id: 'D2E4', title: 'DEEP LEARN',    subtitle: 'AI WORKSHOP',    category: 'AI',     time: '10:30', end: '12:30', venue: 'Hub Delta', mode: 'Solo',       registered: 60,  prize: 'Certificate', desc: 'Hands-on deep learning workshop — build and train a neural network live.' },
            { id: 'D2E5', title: 'BRIDGE BUILD',  subtitle: 'STRUCTURES',     category: 'Creative',time:'11:00',end:'13:00', venue:'Open Court',  mode:'Team (3)',    registered: 36,  prize: '₹8,000',  desc: 'Build the strongest bridge with limited materials — load test finale.' },
            { id: 'D2E6', title: 'METAL WORKS',   subtitle: 'FABRICATION',    category: 'Workshop',time:'13:00',end:'15:00', venue:'Workshop Bay',mode:'Team (2)',   registered: 28,  prize: '₹10,000', desc: 'Industrial metalworks and hardware assembly under mission time limits.' },
            { id: 'D2E7', title: 'QUIZ ARENA',    subtitle: 'TECH TRIVIA',    category: 'Coding', time: '14:00', end: '16:00', venue: 'Hall C',     mode: 'Team (2)', registered: 100, prize: '₹8,000',  desc: 'Lightning-round technical and general knowledge quiz tournament.' },
            { id: 'D2E8', title: 'MUSIC NIGHT',   subtitle: 'CULTURAL SHOW',  category: 'Cultural',time:'17:00',end:'20:00', venue:'Main Stage',  mode:'Solo',        registered: 55,  prize: '₹12,000', desc: 'Open-stage music performances — any genre, any instrument, any vibe.' },
        ],
    },
    {
        slot: 'SLOT 03',
        label: 'DAY 3',
        date: 'Sep 14',
        color: '#FF2CFB',
        events: [
            { id: 'D3E1', title: 'ROBO SOCCER',   subtitle: 'BOT FOOTBALL',   category: 'Robotics',time: '09:00', end:'11:00',venue:'Lab Alpha',   mode:'Team (4)',    registered: 32,  prize: '₹15,000', desc: 'Programmed bots compete in a scaled-down football match — scoring in goals.' },
            { id: 'D3E2', title: 'APP BLITZ',     subtitle: 'MOBILE DEV',     category: 'Coding', time: '09:00', end: '12:00', venue: 'Lab Beta',  mode: 'Team (2)', registered: 44,  prize: '₹15,000', desc: 'Design and ship a working mobile app prototype in 3 hours.' },
            { id: 'D3E3', title: 'VALORANT FINAL',subtitle: 'GRAND FINAL',    category: 'Gaming', time: '10:00', end: '13:00', venue: 'Arena Omega',mode:'Squad (5)',  registered: 10,  prize: '₹50,000', desc: 'Final showdown — only the top 2 squads from Day 2 compete for the title.' },
            { id: 'D3E4', title: 'CIRCUIT FINAL', subtitle: 'ELECTRONICS',    category: 'Electrical',time:'11:00',end:'13:00',venue:'Sigma Hall', mode:'Solo',        registered: 20,  prize: '₹12,000', desc: 'Finals of the circuit design challenge — build a fully working circuit under pressure.' },
            { id: 'D3E5', title: 'BGMI GRAND',    subtitle: 'FINAL SHOWDOWN', category: 'Gaming', time: '12:00', end: '15:00', venue: 'Arena Omega',mode:'Squad (4)',  registered: 16,  prize: '₹40,000', desc: 'BGMI Grand Finals — the 4 qualifying squads battle for supremacy.' },
            { id: 'D3E6', title: 'ART EXHIBIT',   subtitle: 'GALLERY SHOW',   category: 'Creative',time:'13:00',end:'16:00', venue:'Studio Gamma',mode:'Solo',        registered: 50,  prize: '₹6,000',  desc: 'Submit your finest artwork — judges score on creativity, technique, and impact.' },
            { id: 'D3E7', title: 'AI SHOWCASE',   subtitle: 'PROJECT EXPO',   category: 'AI',     time: '14:00', end: '17:00', venue: 'Hub Delta', mode: 'Team (3)', registered: 24,  prize: '₹20,000', desc: 'Teams demo their AI projects to a panel of industry experts for judging.' },
            { id: 'D3E8', title: 'CLOSING GALA',  subtitle: 'AWARDS NIGHT',   category: 'Cultural',time:'18:00',end:'21:00', venue:'Main Stage',  mode:'Open',        registered: 500, prize: 'Trophies', desc: 'Prize distribution, performances, and the grand finale of Addovedi 2026.' },
        ],
    },
];

/* ═══════════════════════════════════════════
   SNAKE LAYOUT CALCULATOR
═══════════════════════════════════════════ */
const ROW_CAPACITY = 4; // events per snake row

function getSnakeLayout(events) {
    return events.map((ev, i) => {
        const row = Math.floor(i / ROW_CAPACITY);
        const posInRow = i % ROW_CAPACITY;
        const isRTL = row % 2 === 1; // alternate row direction
        const col = isRTL ? ROW_CAPACITY - 1 - posInRow : posInRow;
        return { ...ev, row, col, isRTL, indexInRow: posInRow };
    });
}

/* ═══════════════════════════════════════════
   HOLOGRAPHIC CLOCK — Three.js Scene
═══════════════════════════════════════════ */

/**
 * Maps each top-level GLTF node name to animation parameters.
 *
 * Gear rotation axis: Z  (they spin in-plane, like real clock gears)
 * Needle rotation axis: Z (they sweep around the clock face)
 * Pendulum swing: X oscillation
 *
 * Speed in radians/sec — gears follow an escapement ratio so they mesh.
 */
const PART_ANIMS = {
    // ── Main large gears (round, X≈Y dimension) ──
    Object003:  { axis: 'z', speed:  0.18, dir:  1 },   // biggest gear — slowest
    Object007:  { axis: 'z', speed: -0.28, dir: -1 },   // large gear — opposite dir
    Object008:  { axis: 'z', speed:  0.28, dir:  1 },   // companion gear
    Object006:  { axis: 'z', speed:  0.45, dir: -1 },   // medium gear
    Object005:  { axis: 'z', speed:  0.45, dir:  1 },   // medium gear companion
    Object001:  { axis: 'z', speed:  0.85, dir: -1 },   // small gear fast
    Object002:  { axis: 'z', speed:  1.10, dir:  1 },   // small gear faster
    Object010:  { axis: 'z', speed:  0.60, dir: -1 },   // side gear
    Object004:  { axis: 'z', speed:  0.22, dir:  1 },   // outer casing ring — very slow
    Object009:  { axis: 'z', speed:  0.75, dir:  1 },   // small cog

    // ── Clock hands ──
    // Object012: vertical elongated → MINUTE hand (sweeps 360° in 3600s)
    Object012:  { axis: 'z', speed: -(2 * Math.PI / 3600), dir: 1, realTime: true, hand: 'minute' },
    // Object013: horizontal → HOUR hand (sweeps 360° in 43200s)
    Object013:  { axis: 'z', speed: -(2 * Math.PI / 43200), dir: 1, realTime: true, hand: 'hour' },
    // Object015: same shape as 013 → SECOND hand (sweeps 360° in 60s)
    Object015:  { axis: 'z', speed: -(2 * Math.PI / 60), dir: 1, realTime: true, hand: 'second' },

    // ── Pendulum spheres — swing on X ──
    Sphere002:  { axis: 'x', speed: 1.2, dir: 1, pendulum: true, amp: 0.35 },
    Sphere004:  { axis: 'x', speed: 1.8, dir:-1, pendulum: true, amp: 0.20 },
    Sphere005:  { axis: 'x', speed: 1.8, dir: 1, pendulum: true, amp: 0.20 },

    // ── Cylinder / decoration — barely move ──
    Cylinder004:    { axis: 'z', speed: 0.06, dir: 1 },
    outerdecoration:{ axis: 'z', speed:-0.04, dir: 1 },
};

/** Compute initial hand angle from actual current time */
function getHandAngle(hand) {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (hand === 'second') return -(s / 60) * 2 * Math.PI;
    if (hand === 'minute') return -(m / 60) * 2 * Math.PI;
    if (hand === 'hour')   return -(h / 12) * 2 * Math.PI;
    return 0;
}

/** Applies holographic material and animates individual parts */
function HolographicClock() {
    const { scene } = useGLTF('/models/steampunk_clock/scene.gltf');
    const time = useRef(0);
    const partsRef = useRef({}); // name → Object3D

    // Holographic material — shared
    const holoMat = useMemo(() => new THREE.MeshStandardMaterial({
        color:            new THREE.Color('#00E5FF'),
        emissive:         new THREE.Color('#00E5FF'),
        emissiveIntensity: 0.65,
        metalness:   0.0,
        roughness:   1.0,
        transparent: true,
        opacity:     0.20,
        side:        THREE.DoubleSide,
        depthWrite:  false,
    }), []);

    // Secondary magenta-tinted material for second hand — makes it stand out
    const secondMat = useMemo(() => new THREE.MeshStandardMaterial({
        color:            new THREE.Color('#FF2CFB'),
        emissive:         new THREE.Color('#FF2CFB'),
        emissiveIntensity: 0.9,
        metalness:   0.0,
        roughness:   1.0,
        transparent: true,
        opacity:     0.35,
        side:        THREE.DoubleSide,
        depthWrite:  false,
    }), []);

    useEffect(() => {
        if (!scene) return;

        // 1. Apply holo materials + collect part refs
        scene.traverse(obj => {
            if (!obj.isObject3D) return;
            const anim = PART_ANIMS[obj.name];
            if (anim) {
                partsRef.current[obj.name] = obj;
                // Set starting angle for hands from real time
                if (anim.hand) {
                    const initAngle = getHandAngle(anim.hand);
                    if (anim.axis === 'z') obj.rotation.z = initAngle;
                }
            }
            if (obj.isMesh) {
                // Second hand gets accent colour
                obj.material = (obj.parent?.name === 'Object015' || obj.name === 'Object015_Material #3_0')
                    ? secondMat
                    : holoMat;
                obj.renderOrder = 1;
            }
        });

        // 2. Center & scale scene
        //    IMPORTANT: reset to identity FIRST so Box3 measures the raw model,
        //    then force a full matrix recalculation before sampling the bounding box.
        //    Without this, on first navigation (before Three.js has updated matrices)
        //    the bounding box can be wildly wrong, making the clock appear huge.
        scene.scale.set(1, 1, 1);
        scene.position.set(0, 0, 0);
        scene.rotation.set(0, 0, 0);
        scene.updateMatrixWorld(true);   // ← force full matrix update on all children

        const box  = new THREE.Box3().setFromObject(scene);
        const ctr  = new THREE.Vector3();
        const sz   = new THREE.Vector3();
        box.getCenter(ctr);
        box.getSize(sz);
        const maxD   = Math.max(sz.x, sz.y, sz.z);
        const scale  = 7 / maxD;
        scene.scale.setScalar(scale);
        // Re-center: multiply pre-scale center by post-scale factor
        scene.position.set(-ctr.x * scale, -ctr.y * scale - 0.5, -ctr.z * scale);
    }, [scene, holoMat, secondMat]);

    // Per-frame: spin gears, advance hands, swing pendulum
    useFrame((_, delta) => {
        time.current += delta;
        const t = time.current;

        Object.entries(partsRef.current).forEach(([name, obj]) => {
            const anim = PART_ANIMS[name];
            if (!anim) return;

            if (anim.pendulum) {
                // Sinusoidal swing around X
                obj.rotation.x = Math.sin(t * anim.speed) * anim.amp;
            } else if (anim.realTime) {
                // Continuous rotation based on real speed
                obj.rotation[anim.axis] += delta * anim.speed * anim.dir;
            } else {
                // Gear spin
                obj.rotation[anim.axis] += delta * anim.speed * anim.dir;
            }
        });

        // Pulse emissive — breathes like a hologram
        if (holoMat) {
            holoMat.emissiveIntensity = 0.45 + Math.sin(t * 1.4) * 0.28;
            holoMat.opacity           = 0.16 + Math.sin(t * 1.8) * 0.05;
        }
        if (secondMat) {
            secondMat.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.3;
        }
    });

    return <primitive object={scene} />;
}


/** Environment lights for the holographic scene */
function HoloLights() {
    return (
        <>
            <ambientLight intensity={0.1} color="#000820" />
            <pointLight position={[0, 4, 2]} intensity={3.0} color="#00E5FF" distance={20} decay={2} />
            <pointLight position={[-4, -2, 3]} intensity={1.5} color="#7A5CFF" distance={15} decay={2} />
            <pointLight position={[4, 2, -2]} intensity={1.0} color="#FF2CFB" distance={12} decay={2} />
        </>
    );
}

/** Full Three.js canvas background — holographic clock */
function HoloBg() {
    return (
        <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
            <Canvas
                camera={{ fov: 45, position: [0, 0, 12], near: 0.1, far: 100 }}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
                style={{ background: 'transparent' }}
            >
                <AdaptiveDpr pixelRatio={[1, 1.5]} />
                <AdaptiveEvents />
                <HoloLights />
                <Suspense fallback={null}>
                    <HolographicClock />
                </Suspense>
            </Canvas>
        </div>
    );
}

/** 2D particle / grid / radar overlay on top of the 3D canvas */
function BgOverlay() {
    const ref = useRef(null);
    const raf = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const onResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        const GRID = 55;
        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.1 + 0.25,
            a: Math.random() * 0.35 + 0.06,
            c: Math.random() > 0.5 ? '#00E5FF' : '#7A5CFF',
        }));
        const streaks = Array.from({ length: 8 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            len: Math.random() * 90 + 40, speed: Math.random() * 1.4 + 0.7,
            a: Math.random() * 0.06 + 0.02,
        }));
        const radars = [
            { x: W * 0.07, y: H * 0.5, r: 140, phase: 0 },
            { x: W * 0.93, y: H * 0.45, r: 120, phase: Math.PI },
        ];

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            // Grid
            ctx.strokeStyle = 'rgba(0,229,255,0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
            // Radar sweeps
            radars.forEach(rd => {
                rd.phase = (rd.phase + 0.007) % (Math.PI * 2);
                ctx.save();
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = '#00E5FF';
                ctx.beginPath();
                ctx.moveTo(rd.x, rd.y);
                ctx.arc(rd.x, rd.y, rd.r, rd.phase - 0.5, rd.phase);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
                for (let k = 1; k <= 3; k++) {
                    ctx.beginPath();
                    ctx.arc(rd.x, rd.y, (rd.r / 3) * k, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(0,229,255,0.04)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.restore();
            });
            // Streaks
            streaks.forEach(s => {
                s.x += s.speed;
                if (s.x > W + s.len) s.x = -s.len;
                const g = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
                g.addColorStop(0, 'transparent');
                g.addColorStop(0.5, `rgba(0,229,255,${s.a})`);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.fillRect(s.x, s.y, s.len, 1.5);
            });
            // Particles
            ctx.save();
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
            // Binary text
            if (frame % 90 === 0) {
                const texts = ['0010110', 'SYSTEM ONLINE', 'SYNCING...', 'MISSION READY', '>>> STANDBY <<<', 'T-MINUS 00:00'];
                ctx.fillStyle = 'rgba(0,229,255,0.04)';
                ctx.font = '9px monospace';
                ctx.fillText(texts[Math.floor(Math.random() * texts.length)],
                    Math.random() * W * 0.8 + W * 0.05,
                    Math.random() * H * 0.85 + H * 0.05);
            }
            frame++;
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none' }} />;
}

/* Combined background — 3D clock + 2D overlay */
function BgCanvas() {
    return (
        <>
            <HoloBg />
            <BgOverlay />
        </>
    );
}

/* ═══════════════════════════════════════════
   BOOT SEQUENCE
═══════════════════════════════════════════ */
function BootSeq({ onDone }) {
    const [pct, setPct] = useState(0);
    const [show, setShow] = useState(false);
    const [flicker, setFlicker] = useState(false);

    useEffect(() => {
        const t0 = setTimeout(() => setShow(true), 300);
        let start = null, raf;
        const t1 = setTimeout(() => {
            const go = ts => {
                if (!start) start = ts;
                const p = Math.min(100, Math.floor(((ts - start) / 1600) * 100));
                setPct(p);
                if (p < 100) raf = requestAnimationFrame(go);
                else { setTimeout(() => { setFlicker(true); setTimeout(onDone, 450); }, 150); }
            };
            raf = requestAnimationFrame(go);
        }, 450);
        return () => { clearTimeout(t0); clearTimeout(t1); cancelAnimationFrame(raf); };
    }, [onDone]);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: '#06080F',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            animation: flicker ? 'bootFlick 0.45s steps(3,end) forwards' : 'none',
        }}>
            <style>{`
                @keyframes bootFlick { 0%,100%{opacity:1}33%{opacity:0}66%{opacity:1}83%{opacity:0} }
            `}</style>
            {show && (
                <div style={{ textAlign: 'center', fontFamily:"'Orbitron',monospace" }}>
                    <div style={{ fontSize: 'clamp(9px,2vw,14px)', color: '#00E5FF', letterSpacing: '0.55em', marginBottom: '28px', textShadow: '0 0 20px #00E5FF', opacity: 0.9 }}>
                        MISSION COMMAND CENTER
                    </div>
                    <div style={{ fontSize: 'clamp(9px,1.8vw,12px)', color: 'rgba(122,92,255,0.7)', letterSpacing: '0.4em', marginBottom: '24px' }}>
                        SYSTEM INITIALIZING...
                    </div>
                    <div style={{ width:'min(320px,75vw)', height:'3px', background:'rgba(0,229,255,0.12)', borderRadius:'2px', overflow:'hidden', margin:'0 auto 16px' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#7A5CFF,#00E5FF)', boxShadow:'0 0 10px #00E5FF', transition:'width 0.04s linear', borderRadius:'2px' }} />
                    </div>
                    <div style={{ fontSize:'clamp(22px,5vw,44px)', fontWeight:900, color:'#00E5FF', textShadow:'0 0 30px #00E5FF,0 0 60px rgba(0,229,255,0.35)', letterSpacing:'0.08em' }}>
                        {pct}%
                    </div>
                    <div style={{ marginTop:'10px', fontSize:'9px', color:'rgba(0,229,255,0.3)', letterSpacing:'0.3em' }}>
                        ADDOVEDI 2026 // LOADING MISSION FILES
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   DAY SLOT CARD
═══════════════════════════════════════════ */
function DaySlot({ day, isActive, onClick, revealed }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                cursor: 'pointer',
                border: `1px solid ${isActive ? day.color : hov ? day.color + '70' : 'rgba(0,229,255,0.18)'}`,
                borderRadius: '8px',
                padding: 'clamp(10px,2vw,16px) clamp(14px,2.5vw,22px)',
                background: isActive
                    ? `linear-gradient(135deg, ${day.color}18, ${day.color}08)`
                    : hov ? 'rgba(0,229,255,0.06)' : 'rgba(0,229,255,0.03)',
                boxShadow: isActive ? `0 0 20px ${day.color}35, inset 0 0 20px ${day.color}10` : hov ? `0 0 10px ${day.color}20` : 'none',
                transform: hov || isActive ? 'translateY(-3px)' : 'none',
                transition: 'all 0.25s ease',
                opacity: revealed ? 1 : 0,
                transitionDelay: revealed ? '0.1s' : '0s',
                minWidth: 'clamp(90px,18vw,160px)',
                flex: 1,
            }}
        >
            <div style={{ fontFamily:"'Orbitron',monospace" }}>
                <div style={{ fontSize:'7px', color: isActive ? day.color : 'rgba(0,229,255,0.3)', letterSpacing:'0.3em', marginBottom:'6px', opacity: isActive ? 0.8 : 0.6 }}>
                    {day.slot}
                </div>
                <div style={{ fontSize:'clamp(12px,2.5vw,18px)', fontWeight:900, color: isActive ? '#FFF' : 'rgba(255,255,255,0.55)', letterSpacing:'0.1em', marginBottom:'5px', textShadow: isActive ? `0 0 12px ${day.color}` : 'none' }}>
                    {day.label}
                </div>
                <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.2em', marginBottom:'6px' }}>
                    {day.date}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: isActive ? day.color : 'rgba(0,229,255,0.3)', boxShadow: isActive ? `0 0 6px ${day.color}` : 'none', animation: isActive ? 'slotPulse 1.5s ease-in-out infinite' : 'none' }} />
                    <span style={{ fontSize:'7px', color: isActive ? day.color : 'rgba(0,229,255,0.4)', letterSpacing:'0.2em' }}>
                        {day.events.length} EVENTS
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   MISSION NODE
═══════════════════════════════════════════ */
function MissionNode({ ev, isSelected, isCompleted, now24, onClick, revealed, dayColor, delay }) {
    const [hov, setHov] = useState(false);
    const [angle, setAngle] = useState(0);
    const raf = useRef(null);
    const catInfo = CATEGORY_ICONS[ev.category] || { icon: '◆', color: '#00E5FF' };
    const nodeColor = catInfo.color;

    // Continuously rotate ring
    useEffect(() => {
        let a = 0;
        const go = () => { a += (isSelected || hov) ? 0.06 : 0.015; setAngle(a); raf.current = requestAnimationFrame(go); };
        raf.current = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf.current);
    }, [isSelected, hov]);

    const size = isSelected ? 56 : hov ? 50 : 42;

    return (
        <div style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
            cursor:'pointer',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'scale(1)' : 'scale(0.1)',
            transition: `opacity 0.4s ease ${delay}s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
        }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onClick}
        >
            {/* Reactor node */}
            <div style={{ position:'relative', width:`${size + 16}px`, height:`${size + 16}px`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {/* Outer rotating ring */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', transform:`rotate(${angle}rad)` }} viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="32" fill="none" stroke={nodeColor} strokeWidth="1.5"
                        strokeDasharray={isSelected || hov ? "4 2" : "6 4"}
                        opacity={isSelected ? 1 : hov ? 0.8 : 0.4}
                        style={{ filter: (isSelected || hov) ? `drop-shadow(0 0 4px ${nodeColor})` : 'none' }}
                    />
                    {(isSelected || hov) && [0, 120, 240].map(d => {
                        const r = d * Math.PI / 180;
                        return <circle key={d} cx={36 + 32 * Math.cos(r)} cy={36 + 32 * Math.sin(r)} r="2.5" fill={nodeColor} />;
                    })}
                </svg>

                {/* Middle glow ring */}
                <div style={{
                    position:'absolute',
                    width:`${size - 8}px`, height:`${size - 8}px`,
                    borderRadius:'50%',
                    border:`2px solid ${nodeColor}`,
                    boxShadow: isSelected
                        ? `0 0 18px ${nodeColor}, 0 0 36px ${nodeColor}60, inset 0 0 12px ${nodeColor}25`
                        : hov ? `0 0 10px ${nodeColor}80` : `0 0 4px ${nodeColor}40`,
                    background: `radial-gradient(circle, ${nodeColor}18 0%, transparent 70%)`,
                    transition:'box-shadow 0.3s',
                    animation:'nodePulse 2s ease-in-out infinite',
                }} />

                {/* Core icon */}
                <div style={{
                    position:'relative', zIndex:2,
                    fontSize: isSelected ? '20px' : '16px',
                    filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none',
                    transition:'font-size 0.3s',
                }}>
                    {isCompleted ? '✓' : catInfo.icon}
                </div>

                {/* Ripple on select */}
                {isSelected && (
                    <div style={{
                        position:'absolute', inset:0,
                        borderRadius:'50%',
                        border:`2px solid ${nodeColor}`,
                        animation:'rippleOut 1s ease-out infinite',
                    }} />
                )}
            </div>

            {/* Time label */}
            <div style={{
                fontFamily:"'Orbitron',monospace",
                fontSize:'9px', fontWeight:700,
                color: isSelected ? '#FFF' : hov ? nodeColor : 'rgba(255,255,255,0.4)',
                letterSpacing:'0.12em',
                textShadow: isSelected ? `0 0 8px ${nodeColor}` : 'none',
                transition:'color 0.3s',
            }}>{ev.time}</div>

            {/* Category badge */}
            <div style={{
                fontSize:'7px',
                color: isSelected ? nodeColor : 'rgba(255,255,255,0.2)',
                letterSpacing:'0.15em',
                fontFamily:"'Orbitron',monospace",
                transition:'color 0.3s',
                whiteSpace:'nowrap',
            }}>
                {ev.category.toUpperCase()}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   SNAKE MAP (DESKTOP)
═══════════════════════════════════════════ */
function SnakeMap({ events, selectedId, onSelect, revealed, dayColor, now24 }) {
    const laid = useMemo(() => getSnakeLayout(events), [events]);
    const rows = Math.ceil(events.length / ROW_CAPACITY);

    return (
        <div style={{ position:'relative', width:'100%' }}>
            {Array.from({ length: rows }, (_, rowIdx) => {
                const rowItems = laid.filter(e => e.row === rowIdx);
                const isRTL = rowIdx % 2 === 1;

                return (
                    <div key={rowIdx} style={{ marginBottom: rowIdx < rows - 1 ? '32px' : 0 }}>
                        {/* Node row */}
                        <div style={{
                            display:'flex',
                            justifyContent: isRTL ? 'flex-end' : 'flex-start',
                            gap:'0',
                            position:'relative',
                        }}>
                            {/* Horizontal rail behind nodes */}
                            <div style={{
                                position:'absolute',
                                top:'50%',
                                left: rowItems.length > 0 ? `${(isRTL ? (ROW_CAPACITY - rowItems.length) : 0) * (100 / ROW_CAPACITY)}%` : '0',
                                width: `${(rowItems.length - 1) * (100 / (ROW_CAPACITY - 1))}%`,
                                height:'4px',
                                transform:'translateY(-50%)',
                                background:`linear-gradient(${isRTL ? '270deg' : '90deg'}, transparent, ${dayColor}40)`,
                                zIndex:0,
                                overflow:'visible',
                                ...(isRTL ? { right:0, left:'auto' } : {}),
                            }}>
                                {/* Rail glow */}
                                <div style={{
                                    position:'absolute', inset:0,
                                    background:`linear-gradient(${isRTL ? '270deg' : '90deg'}, transparent, ${dayColor})`,
                                    opacity: revealed ? 0.6 : 0,
                                    boxShadow:`0 0 8px ${dayColor}, 0 0 16px ${dayColor}50`,
                                    transition:`opacity 0.8s ease ${0.5 + rowIdx * 0.3}s`,
                                    borderRadius:'2px',
                                }} />
                                {/* Tiny rail particles */}
                                {[0.2, 0.5, 0.8].map((pos, pi) => (
                                    <div key={pi} style={{
                                        position:'absolute', top:'50%',
                                        left: isRTL ? `${(1 - pos) * 100}%` : `${pos * 100}%`,
                                        transform:'translate(-50%,-50%)',
                                        width:'4px', height:'4px',
                                        borderRadius:'50%',
                                        background:dayColor,
                                        opacity: revealed ? 0.7 : 0,
                                        animation: revealed ? `railParticle ${1.2 + pi * 0.4}s ease-in-out infinite ${pi * 0.5}s` : 'none',
                                    }} />
                                ))}
                            </div>

                            {/* Nodes */}
                            {(isRTL ? [...rowItems].reverse() : rowItems).map((ev, nodeIdx) => (
                                <div key={ev.id} style={{ flex: 1, display:'flex', justifyContent:'center', position:'relative', zIndex:2 }}>
                                    <MissionNode
                                        ev={ev}
                                        isSelected={selectedId === ev.id}
                                        isCompleted={parseInt(ev.time) * 60 < now24}
                                        now24={now24}
                                        onClick={() => onSelect(ev)}
                                        revealed={revealed}
                                        dayColor={dayColor}
                                        delay={0.6 + rowIdx * 0.2 + nodeIdx * 0.08}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Vertical connector to next row */}
                        {rowIdx < rows - 1 && (() => {
                            const isNextRTL = (rowIdx + 1) % 2 === 1;
                            const connectorSide = isRTL ? 'left' : 'right';
                            return (
                                <div style={{ position:'relative', height:'32px', display:'flex', alignItems:'stretch', justifyContent: connectorSide === 'right' ? 'flex-end' : 'flex-start' }}>
                                    <div style={{
                                        width:'4px',
                                        background:`linear-gradient(to bottom, ${dayColor}, ${dayColor}40)`,
                                        boxShadow:`0 0 8px ${dayColor}60`,
                                        opacity: revealed ? 1 : 0,
                                        transition:`opacity 0.5s ease ${0.8 + rowIdx * 0.3}s`,
                                        marginLeft: connectorSide === 'right' ? 'calc(100% / 8 - 2px)' : undefined,
                                        marginRight: connectorSide === 'left' ? 'calc(100% / 8 - 2px)' : undefined,
                                        borderRadius:'2px',
                                    }} />
                                </div>
                            );
                        })()}
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════
   EVENT DETAIL PANEL (Right HUD)
═══════════════════════════════════════════ */
function EventPanel({ ev, dayColor, visible }) {
    const [scanPos, setScanPos] = useState(0);
    const raf = useRef(null);

    useEffect(() => {
        let pos = 0;
        const go = () => {
            pos = (pos + 0.4) % 110;
            setScanPos(pos);
            raf.current = requestAnimationFrame(go);
        };
        raf.current = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf.current);
    }, []);

    const catInfo = ev ? (CATEGORY_ICONS[ev.category] || { icon:'◆', color:'#00E5FF' }) : null;
    const color = ev ? (catInfo?.color || dayColor) : dayColor;

    return (
        <div style={{
            position:'relative',
            background:'rgba(6,8,15,0.92)',
            border:`1px solid ${visible && ev ? color + '60' : 'rgba(0,229,255,0.15)'}`,
            borderRadius:'12px',
            padding:'24px 20px',
            backdropFilter:'blur(16px)',
            boxShadow: visible && ev ? `0 0 30px ${color}20, inset 0 0 40px rgba(0,229,255,0.03)` : 'none',
            overflow:'hidden',
            transition:'border-color 0.4s, box-shadow 0.4s',
            minHeight:'360px',
            display:'flex',
            flexDirection:'column',
        }}>
            {/* Corner brackets */}
            {[0,1,2,3].map(i => (
                <div key={i} style={{
                    position:'absolute', width:'14px', height:'14px',
                    ...(i===0 && { top:'6px', left:'6px', borderTop:`1.5px solid ${color}`, borderLeft:`1.5px solid ${color}` }),
                    ...(i===1 && { top:'6px', right:'6px', borderTop:`1.5px solid ${color}`, borderRight:`1.5px solid ${color}` }),
                    ...(i===2 && { bottom:'6px', left:'6px', borderBottom:`1.5px solid ${color}`, borderLeft:`1.5px solid ${color}` }),
                    ...(i===3 && { bottom:'6px', right:'6px', borderBottom:`1.5px solid ${color}`, borderRight:`1.5px solid ${color}` }),
                    opacity: 0.7,
                    transition:'border-color 0.4s',
                }} />
            ))}

            {/* Moving scan line */}
            <div style={{
                position:'absolute', left:0, right:0,
                top:`${scanPos}%`, height:'1px',
                background:`linear-gradient(90deg, transparent, ${color}30, transparent)`,
                pointerEvents:'none',
            }} />

            {!ev ? (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                    <div style={{ fontSize:'32px', opacity:0.15 }}>🎯</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'rgba(0,229,255,0.25)', letterSpacing:'0.35em', textAlign:'center', lineHeight:2 }}>
                        SELECT A MISSION NODE<br />TO VIEW DETAILS
                    </div>
                </div>
            ) : (
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition:'opacity 0.35s ease, transform 0.35s ease' }}>
                    {/* Header */}
                    <div style={{ borderBottom:`1px solid ${color}25`, paddingBottom:'14px', marginBottom:'14px' }}>
                        <div style={{ fontSize:'10px', fontFamily:"'Orbitron',monospace", color:color, letterSpacing:'0.3em', marginBottom:'6px', opacity:0.7 }}>
                            // {ev.id} — {ev.category.toUpperCase()}
                        </div>
                        <div style={{ fontSize:'clamp(14px,2vw,20px)', fontWeight:900, color:'#FFF', fontFamily:"'Orbitron',monospace", letterSpacing:'0.08em', marginBottom:'4px', lineHeight:1.2 }}>
                            {ev.title}
                        </div>
                        <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.2em', fontFamily:"'Orbitron',monospace" }}>
                            {ev.subtitle}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:'16px' }}>
                        {ev.desc}
                    </div>

                    {/* Details grid */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
                        {[
                            { label:'TIME',         val:`${ev.time} – ${ev.end}` },
                            { label:'VENUE',        val: ev.venue },
                            { label:'MODE',         val: ev.mode },
                            { label:'REGISTRATION', val:`${ev.registered} TEAMS / PLAYERS` },
                            { label:'PRIZE POOL',   val: ev.prize },
                        ].map(({ label, val }) => (
                            <div key={label} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', color:color, letterSpacing:'0.2em', opacity:0.65, minWidth:'90px', paddingTop:'1px' }}>
                                    {label}
                                </div>
                                <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.75)', fontWeight:600, lineHeight:1.4 }}>
                                    {val}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Register button */}
                    <button style={{
                        marginTop:'18px',
                        width:'100%', padding:'10px',
                        background:`linear-gradient(135deg, ${color}22, ${color}12)`,
                        border:`1px solid ${color}80`,
                        borderRadius:'6px',
                        color: color,
                        fontFamily:"'Orbitron',monospace",
                        fontSize:'10px', fontWeight:900,
                        letterSpacing:'0.35em',
                        cursor:'pointer',
                        boxShadow:`0 0 12px ${color}25`,
                        transition:'background 0.2s, box-shadow 0.2s',
                    }}>
                        REGISTER →
                    </button>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════
   MOBILE: VERTICAL NODE LIST
═══════════════════════════════════════════ */
function MobileNodeList({ events, selectedId, onSelect, revealed, dayColor, now24 }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0', paddingBottom:'8px' }}>
            {events.map((ev, i) => {
                const catInfo = CATEGORY_ICONS[ev.category] || { icon:'◆', color:'#00E5FF' };
                const isSelected = selectedId === ev.id;
                const isLeft = i % 2 === 0;
                return (
                    <div key={ev.id} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'scale(0.8)', transition:`opacity 0.4s ${i * 0.07}s, transform 0.5s ${i * 0.07}s` }}>
                        <div style={{ display:'flex', alignItems:'center', width:'100%', gap:'0', flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                            {/* Card */}
                            <div
                                onClick={() => onSelect(ev)}
                                style={{
                                    flex:1,
                                    background: isSelected ? `linear-gradient(135deg,${catInfo.color}18,${catInfo.color}08)` : 'rgba(6,8,15,0.85)',
                                    border:`1px solid ${isSelected ? catInfo.color + '80' : 'rgba(0,229,255,0.15)'}`,
                                    borderRadius:'8px',
                                    padding:'10px 12px',
                                    cursor:'pointer',
                                    boxShadow: isSelected ? `0 0 14px ${catInfo.color}25` : 'none',
                                    transition:'all 0.25s',
                                    fontFamily:"'Orbitron',monospace",
                                }}
                            >
                                <div style={{ fontSize:'7px', color: catInfo.color, letterSpacing:'0.25em', marginBottom:'3px', opacity:0.65 }}>
                                    {ev.time} // {ev.category.toUpperCase()}
                                </div>
                                <div style={{ fontSize:'11px', fontWeight:900, color:'#FFF', letterSpacing:'0.06em', marginBottom:'2px' }}>
                                    {catInfo.icon} {ev.title}
                                </div>
                                <div style={{ fontSize:'7px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em' }}>
                                    {ev.subtitle}
                                </div>
                            </div>

                            {/* Arm to node */}
                            <div style={{ width:'20px', height:'2px', background:`linear-gradient(${isLeft?'90deg':'270deg'},transparent,${catInfo.color}60)`, flexShrink:0 }} />

                            {/* Node dot */}
                            <div style={{
                                width:'28px', height:'28px', borderRadius:'50%',
                                border:`2px solid ${catInfo.color}`,
                                background:`radial-gradient(circle,${catInfo.color}25,transparent)`,
                                boxShadow: isSelected ? `0 0 14px ${catInfo.color}` : `0 0 5px ${catInfo.color}50`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'12px', flexShrink:0,
                                animation:'nodePulse 2s ease-in-out infinite',
                            }}>
                                {catInfo.icon}
                            </div>
                        </div>

                        {/* Vertical connector */}
                        {i < events.length - 1 && (
                            <div style={{ width:'2px', height:'24px', background:`linear-gradient(to bottom,${catInfo.color}50,rgba(0,229,255,0.15))`, boxShadow:`0 0 4px ${catInfo.color}30`, borderRadius:'1px', marginLeft: isLeft ? 'auto' : undefined, marginRight: !isLeft ? 'auto' : undefined, marginInline: '14px' }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function TimelinePage() {
    const navigate = useNavigate();
    const [booted, setBooted] = useState(false);
    const [activeDay, setActiveDay] = useState(0);
    const [selectedEv, setSelectedEv] = useState(null);
    const [transitioning, setTransitioning] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const now24 = useMemo(() => {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
    }, []);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleBoot = useCallback(() => {
        setBooted(true);
        setTimeout(() => setContentVisible(true), 200);
    }, []);

    const switchDay = useCallback((idx) => {
        if (idx === activeDay || transitioning) return;
        setTransitioning(true);
        setContentVisible(false);
        setSelectedEv(null);
        setTimeout(() => {
            setActiveDay(idx);
            setTransitioning(false);
            setTimeout(() => setContentVisible(true), 50);
        }, 350);
    }, [activeDay, transitioning]);

    const day = DAYS[activeDay];

    return (
        <div style={{ position:'fixed', inset:0, background:'#06080F', zIndex:100, overflowY:'auto', overflowX:'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes nodePulse { 0%,100%{opacity:0.9}50%{opacity:1;box-shadow:0 0 18px currentColor} }
                @keyframes slotPulse { 0%,100%{opacity:0.8}50%{opacity:1;transform:scale(1.3)} }
                @keyframes rippleOut { 0%{transform:scale(1);opacity:0.7}100%{transform:scale(2.5);opacity:0} }
                @keyframes railParticle {
                    0%{transform:translate(-50%,-50%) translateX(-6px);opacity:0}
                    50%{opacity:0.9}
                    100%{transform:translate(-50%,-50%) translateX(6px);opacity:0}
                }
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>

            <BgCanvas />
            {!booted && <BootSeq onDone={handleBoot} />}

            {/* ── Navbar — always visible, not faded by boot ── */}
            <div style={{ position:'relative', zIndex:20 }}>
                <TimelineNav />
            </div>

            <div style={{
                position:'relative', zIndex:10,
                minHeight:'calc(100vh - 88px)',
                padding: isMobile ? '0 14px 40px' : '0 40px 50px',
                opacity: contentVisible ? 1 : 0,
                transition:'opacity 0.4s ease',
                display:'flex',
                flexDirection:'column',
                gap: isMobile ? '20px' : '28px',
            }}>

                {/* ── System Status Bar ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', flexWrap:'wrap', gap:'10px' }}>
                    <div style={{
                        display:'flex', alignItems:'center', gap:'20px',
                        fontFamily:"'Orbitron',monospace", fontSize:'7px', letterSpacing:'0.3em',
                        color:'rgba(0,229,255,0.45)',
                        border:'1px solid rgba(0,229,255,0.1)', borderRadius:'6px',
                        padding:'6px 16px', background:'rgba(0,229,255,0.03)',
                    }}>
                        <span>SYSTEM STATUS</span>
                        <span style={{ color: day.color, textShadow:`0 0 6px ${day.color}` }}>{day.label}</span>
                        <span style={{ color:'rgba(0,229,255,0.35)' }}>{day.events.length} EVENTS</span>
                        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                            <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#1FFF76', animation:'slotPulse 1.5s ease-in-out infinite', boxShadow:'0 0 5px #1FFF76' }} />
                            <span style={{ color:'#1FFF76' }}>ONLINE</span>
                        </div>
                    </div>
                </div>

                {/* ── Title ── */}
                <div style={{ textAlign:'center' }}>
                    <div style={{
                        fontFamily:"'Orbitron',monospace",
                        fontSize:'clamp(24px,5.5vw,58px)', fontWeight:900,
                        letterSpacing:'clamp(0.08em,1.5vw,0.35em)',
                        color:'#FFF',
                        textShadow:'0 0 28px rgba(0,229,255,0.55), 0 0 55px rgba(0,229,255,0.18)',
                        lineHeight:1, marginBottom:'10px',
                    }}>
                        MISSION CONTROL
                    </div>
                    <div style={{
                        fontFamily:"'Orbitron',monospace",
                        fontSize:'clamp(7px,1.4vw,11px)', letterSpacing:'clamp(0.3em,1vw,0.6em)',
                        color:'rgba(0,229,255,0.45)', marginBottom:'14px',
                    }}>
                        SELECT MISSION DAY → CHOOSE NODE → VIEW BRIEFING
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                        <div style={{ height:'1px', width:'clamp(40px,8vw,100px)', background:'linear-gradient(90deg,transparent,rgba(0,229,255,0.4))' }} />
                        <div style={{ color:'rgba(0,229,255,0.3)', fontSize:'10px' }}>◆</div>
                        <div style={{ height:'1px', width:'clamp(40px,8vw,100px)', background:'linear-gradient(270deg,transparent,rgba(0,229,255,0.4))' }} />
                    </div>
                </div>

                {/* ── Day Slot Selectors ── */}
                <div style={{ display:'flex', gap:'clamp(10px,2vw,20px)', justifyContent:'center', flexWrap:'wrap' }}>
                    {DAYS.map((d, i) => (
                        <DaySlot key={d.slot} day={d} isActive={i === activeDay} onClick={() => switchDay(i)} revealed={contentVisible} />
                    ))}
                </div>

                {/* ── Main Content: Desktop (Snake + Right Panel) / Mobile (list + bottom) ── */}
                {!isMobile ? (
                    <div style={{ display:'flex', gap:'28px', alignItems:'flex-start' }}>
                        {/* Snake Map */}
                        <div style={{
                            flex:1,
                            background:'rgba(0,229,255,0.02)',
                            border:'1px solid rgba(0,229,255,0.08)',
                            borderRadius:'12px',
                            padding:'28px',
                            backdropFilter:'blur(8px)',
                            opacity: transitioning ? 0.3 : 1,
                            transform: transitioning ? 'scale(0.98)' : 'scale(1)',
                            transition:'opacity 0.35s, transform 0.35s',
                        }}>
                            {/* Day heading inside map */}
                            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'11px', fontWeight:900, color: day.color, letterSpacing:'0.2em', textShadow:`0 0 10px ${day.color}` }}>
                                    {day.label} — {day.date}
                                </div>
                                <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${day.color}50, transparent)` }} />
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.2em' }}>
                                    MISSION ROUTE
                                </div>
                            </div>
                            <SnakeMap
                                events={day.events}
                                selectedId={selectedEv?.id}
                                onSelect={setSelectedEv}
                                revealed={contentVisible && !transitioning}
                                dayColor={day.color}
                                now24={now24}
                            />
                        </div>

                        {/* Right HUD Panel */}
                        <div style={{ width:'260px', flexShrink:0, position:'sticky', top:'28px' }}>
                            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', color:'rgba(0,229,255,0.35)', letterSpacing:'0.3em', marginBottom:'10px' }}>
                                MISSION BRIEFING
                            </div>
                            <EventPanel ev={selectedEv} dayColor={day.color} visible={!!selectedEv && !transitioning} />
                        </div>
                    </div>
                ) : (
                    /* ── MOBILE LAYOUT ── */
                    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                        {/* Mobile snake (vertical) */}
                        <div style={{
                            background:'rgba(0,229,255,0.02)', border:'1px solid rgba(0,229,255,0.08)',
                            borderRadius:'10px', padding:'16px',
                            opacity: transitioning ? 0.3 : 1, transition:'opacity 0.3s',
                        }}>
                            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color: day.color, letterSpacing:'0.2em', marginBottom:'16px', textShadow:`0 0 8px ${day.color}` }}>
                                {day.label} — MISSION ROUTE
                            </div>
                            <MobileNodeList
                                events={day.events}
                                selectedId={selectedEv?.id}
                                onSelect={setSelectedEv}
                                revealed={contentVisible && !transitioning}
                                dayColor={day.color}
                                now24={now24}
                            />
                        </div>

                        {/* Mobile detail panel */}
                        {selectedEv && (
                            <div>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'8px', color:'rgba(0,229,255,0.35)', letterSpacing:'0.3em', marginBottom:'10px' }}>
                                    MISSION BRIEFING
                                </div>
                                <EventPanel ev={selectedEv} dayColor={day.color} visible={!!selectedEv && !transitioning} />
                            </div>
                        )}
                    </div>
                )}

                {/* ── Category Legend ── */}
                <div style={{
                    display:'flex', gap:'clamp(10px,2vw,18px)', flexWrap:'wrap', justifyContent:'center',
                    padding:'14px', background:'rgba(0,229,255,0.02)', borderRadius:'8px',
                    border:'1px solid rgba(0,229,255,0.07)',
                    opacity: contentVisible ? 1 : 0, transition:'opacity 0.5s ease 1s',
                }}>
                    {Object.entries(CATEGORY_ICONS).map(([cat, { icon, color }]) => (
                        <div key={cat} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                            <span style={{ fontSize:'12px' }}>{icon}</span>
                            <span style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.15em' }}>
                                {cat.toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
