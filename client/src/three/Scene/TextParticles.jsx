/**
 * TextParticles.jsx — ADDOVEDI + 2026 form from sun-burst particles
 * and solidify into bright, bold, clean text meshes in front of the camera.
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';

// Gaming palette matching the buildings
const COL_RED  = new THREE.Color('#ff1f4f'); // ADD side (left) - neon electric red/pink
const COL_BLUE = new THREE.Color('#00d9ff'); // VEDI side (right) - neon blue

// Pre-allocated THREE.Color instances for warm/cool dynamic shading palettes (bright bold red/blue with touch of black)
const morphWarmColors = [
    new THREE.Color('#ff0000'), // Bright Bold Red
    new THREE.Color('#110000'), // Touch of Black
    new THREE.Color('#ff0044'), // Bright Neon Crimson
    new THREE.Color('#ff3300')  // Bold Red-Orange
];

const morphCoolColors = [
    new THREE.Color('#0066ff'), // Bright Bold Blue
    new THREE.Color('#00001a'), // Touch of Black
    new THREE.Color('#00bfff'), // Bright Cyber Cyan
    new THREE.Color('#0022ff')  // Vibrant Indigo-Blue
];

// ─── Tunables ─────────────────────────────────────────────────────────────────

const COUNT_MAIN   = 1800;  // particles for ADDOVEDI (halved for perf)
const COUNT_2026   =  300;  // particles for 2026 tagline
const TOTAL        = COUNT_MAIN + COUNT_2026;

// 3D plane where particles settle (extremely close, ahead of all buildings)
const TEXT_Z       = -5.2;

// ADDOVEDI layout
const MAIN_SCALE   = 0.010;   // canvas px → world units (smaller)
const MAIN_Y       = 0.80;    // raised so the sun sits in the centre gap

// 2026 layout
const Y2026_SCALE  = 0.0055;
const Y2026_Y      = MAIN_Y - 0.95;  // Shifted down and scaled smaller

// Burst origin — exactly the sun's position deep in Z space
const BURST_X      = 0;
const BURST_Y      = 38;
const BURST_Z      = -280;
const BURST_JITTER = 15.0;    // spread around the sun

// Stagger: particles whose targets are closer to center launch first.
const STAGGER_WINDOW = 1.8;   // seconds

// Per-particle flight duration
const TRAVEL_DUR   = 1.5;     // seconds to reach target

// ─────────────────────────────────────────────────────────────────────────────

/** Sample white-pixel coordinates from canvas text, returns centred XY pairs */
function sampleCanvas(str, fontPx, W, H, step = 2) {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${fontPx}px "Arial Black", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, W / 2, H / 2);
    const { data } = ctx.getImageData(0, 0, W, H);
    const pts = [];
    for (let y = 0; y < H; y += step)
        for (let x = 0; x < W; x += step)
            if (data[(y * W + x) * 4] > 128)
                pts.push([x - W / 2, -(y - H / 2)]);
    return pts;
}

// easeOutExpo gives a solid snap-in effect
function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }

// ─────────────────────────────────────────────────────────────────────────────

export default function TextParticles() {
    const showTextParticles = useStore(s => s.showTextParticles);
    const isEntered         = useStore(s => s.isEntered);

    const geoRef        = useRef();
    const matRef        = useRef();
    const textMatRefA   = useRef();  // "ADD" — blue
    const textMatRefV   = useRef();  // "VEDI" — pink
    const tagMatRef     = useRef();  // "2026"

    // ── Generate Canvas Gradient Textures for the horizontal color split across ADD O VEDI ──
    const leftGradientTex = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 256, 0);
        grad.addColorStop(0, '#ff001e'); // Bold crimson red on the far left
        grad.addColorStop(0.7, '#ff0a35'); // Wider dominant bold red body
        grad.addColorStop(1, '#a81aff'); // Short transition to deep violet purple at the end
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 1);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, []);

    const rightGradientTex = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 256, 0);
        grad.addColorStop(0, '#a81aff'); // Meet at deep violet purple on the left
        grad.addColorStop(0.3, '#5e35ff'); // Quick transition into indigo
        grad.addColorStop(1, '#004cff'); // Electric blue on the far right
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 1);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }, []);
    const textGroupRef  = useRef();  // group containing all solid text refs for floating animation
    const lightARef     = useRef();  // red light ref
    const lightVRef     = useRef();  // blue light ref
    const animStarted  = useRef(false);
    const startTime    = useRef(null);
    const settled      = useRef(new Uint8Array(TOTAL));
    const settledCount = useRef(0);
    const flyoverDone  = useRef(false); // prevent replaying the flyover

    const activeWarmColor = useMemo(() => new THREE.Color(), []);
    const activeCoolColor = useMemo(() => new THREE.Color(), []);

    // ── Sample pixel maps (once) ──────────────────────────────────────────────
    const { mainPixels, pixels2026 } = useMemo(() => ({
        mainPixels: sampleCanvas('ADD    VEDI', 160, 1400, 200, 2),
        pixels2026: sampleCanvas('2026',         65, 600,  120, 2),
    }), []);

    // ── Build all particle arrays once ────────────────────────────────────────
    const { burstPos, targetPos, delays, colArr } = useMemo(() => {
        const burstPos  = new Float32Array(TOTAL * 3);
        const targetPos = new Float32Array(TOTAL * 3);
        const delays    = new Float32Array(TOTAL);
        const colArr    = new Float32Array(TOTAL * 3);

        const rawDist = new Float32Array(TOTAL);

        // ── ADDOVEDI particles ─────────────────────────────────────────────────
        for (let i = 0; i < COUNT_MAIN; i++) {
            // Burst origin: tight cloud at the sun [0, 38, -280]
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * BURST_JITTER;
            burstPos[i * 3]     = BURST_X + Math.cos(theta) * r;
            burstPos[i * 3 + 1] = BURST_Y + Math.sin(theta) * r;
            burstPos[i * 3 + 2] = BURST_Z + (Math.random() - 0.5) * BURST_JITTER * 0.5;

            // Target: letter pixel position at Z = -5.2
            const px = mainPixels[i % mainPixels.length];
            const tx = px[0] * MAIN_SCALE;
            const ty = px[1] * MAIN_SCALE + MAIN_Y;
            targetPos[i * 3]     = tx;
            targetPos[i * 3 + 1] = ty;
            targetPos[i * 3 + 2] = TEXT_Z;

            const dx = tx, dy = ty - MAIN_Y;
            rawDist[i] = Math.sqrt(dx * dx + dy * dy);

            // Colour: red for ADD (negative X), blue for VEDI (positive X)
            const col = tx < 0 ? COL_RED : COL_BLUE;
            colArr[i * 3]     = col.r;
            colArr[i * 3 + 1] = col.g;
            colArr[i * 3 + 2] = col.b;
        }

        // ── 2026 particles ────────────────────────────────────────────────────
        for (let i = COUNT_MAIN; i < TOTAL; i++) {
            const li = i - COUNT_MAIN;

            // Burst from sun
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * BURST_JITTER;
            burstPos[i * 3]     = BURST_X + Math.cos(theta) * r;
            burstPos[i * 3 + 1] = BURST_Y + Math.sin(theta) * r;
            burstPos[i * 3 + 2] = BURST_Z + (Math.random() - 0.5) * BURST_JITTER * 0.5;

            const px = pixels2026[li % pixels2026.length];
            const tx = px[0] * Y2026_SCALE;
            const ty = px[1] * Y2026_SCALE + Y2026_Y;
            targetPos[i * 3]     = tx;
            targetPos[i * 3 + 1] = ty;
            targetPos[i * 3 + 2] = TEXT_Z; // Align with ADD and VEDI depth plane

            const dx = tx, dy = ty - Y2026_Y;
            rawDist[i] = Math.sqrt(dx * dx + dy * dy);

            // Subtle cyan / pink tints for digits
            const charX = (tx + 1.8) / 3.6;  // 0->1 across 2026 width
            const isCyan = charX < 0.25 || (charX > 0.5 && charX < 0.75);
            const tint = isCyan ? new THREE.Color('#c6f5ff') : new THREE.Color('#ffc2e8');
            colArr[i * 3]     = tint.r;
            colArr[i * 3 + 1] = tint.g;
            colArr[i * 3 + 2] = tint.b;
        }

        // ── Normalise radial delays ────────────────────────────────────────────
        let maxDist = 0;
        for (let i = 0; i < TOTAL; i++) if (rawDist[i] > maxDist) maxDist = rawDist[i];

        for (let i = 0; i < TOTAL; i++) {
            const norm = rawDist[i] / (maxDist + 0.001);
            delays[i] = norm * STAGGER_WINDOW + Math.random() * 0.15;
        }

        return { burstPos, targetPos, delays, colArr };
    }, [mainPixels, pixels2026]);

    // ── Trigger particle animation ────────────────────────────────────────────
    useEffect(() => {
        if (!showTextParticles || animStarted.current) return;
        animStarted.current  = true;
        startTime.current    = null;
        settled.current.fill(0);
        settledCount.current = 0;

        const mat = matRef.current;
        if (mat) { mat.visible = true; mat.opacity = 1.0; }

        // Fade in solid text just as particles finish settling
        const fadeDelay = STAGGER_WINDOW + TRAVEL_DUR - 0.4;
        const fadeOpts  = { opacity: 1.0, duration: 1.2, delay: fadeDelay, ease: 'power2.out' };

        [textMatRefA, textMatRefV, tagMatRef].forEach(ref => {
            if (ref.current) {
                ref.current.opacity = 0;
                gsap.to(ref.current, fadeOpts);
            }
        });
    }, [showTextParticles]);

    // ── "ADDOVEDI flies over you" when Enter the Arena is clicked ────────────
    useEffect(() => {
        if (!isEntered || flyoverDone.current) return;
        if (!textGroupRef.current) return;
        flyoverDone.current = true;

        const group = textGroupRef.current;

        // Letters rush toward the camera (z from -5.2 toward +2), scale up, fade out
        gsap.to(group.position, { z: 3.5, duration: 1.1, ease: 'power3.in' });
        gsap.to(group.scale,    { x: 14, y: 14, z: 14, duration: 1.1, ease: 'power3.in' });
        [textMatRefA, textMatRefV, tagMatRef].forEach(ref => {
            if (ref.current) gsap.to(ref.current, { opacity: 0, duration: 0.9, ease: 'power2.in' });
        });
        if (matRef.current) gsap.to(matRef.current, { opacity: 0, duration: 0.7, ease: 'power2.in' });
    }, [isEntered]);

    // ── Reset ADDOVEDI when returning from Events Page ────────────────────────
    useEffect(() => {
        if (isEntered) return;                 // Only fires when isEntered goes false
        if (!flyoverDone.current) return;      // Nothing was changed, skip
        flyoverDone.current = false;

        const group = textGroupRef.current;
        if (!group) return;

        // Gently restore the text group to its original state
        gsap.to(group.position, { z: 0, duration: 1.4, delay: 1.0, ease: 'power2.out' });
        gsap.to(group.scale,    { x: 1, y: 1, z: 1, duration: 1.4, delay: 1.0, ease: 'power2.out' });
        [textMatRefA, textMatRefV, tagMatRef].forEach(ref => {
            if (ref.current) gsap.to(ref.current, { opacity: 1.0, duration: 1.4, delay: 1.2, ease: 'power2.out' });
        });
    }, [isEntered]);

    // ── Per-frame animation ───────────────────────────────────────────────────
    useFrame(({ clock }) => {
        if (!showTextParticles || !animStarted.current) return;
        const geo = geoRef.current;
        const mat = matRef.current;
        if (!geo || !mat) return;

        if (startTime.current === null) startTime.current = clock.elapsedTime;

        const elapsed  = clock.elapsedTime - startTime.current;
        const wallTime = clock.elapsedTime;
        const posAttr  = geo.getAttribute('position');
        const colAttr  = geo.getAttribute('color');
        const arr      = posAttr.array;
        const colors   = colAttr.array;

        // Floating/hover animation for the logo group
        if (textGroupRef.current) {
            textGroupRef.current.position.y = Math.sin(wallTime * 1.5) * 0.05;
            textGroupRef.current.rotation.z = Math.sin(wallTime * 1.0) * 0.015;
            textGroupRef.current.rotation.y = Math.cos(wallTime * 0.8) * 0.02;
        }

        // Specular lights are static to prevent any flashing/blinking glints

        // Once every particle has settled, hide them completely to show only the solid, sharp, non-blinking Text components
        const allDone = settledCount.current >= TOTAL;
        if (allDone) {
            if (mat.visible) mat.visible = false;
            return;
        }

        for (let i = 0; i < TOTAL; i++) {
            const d    = delays[i];
            const tRaw = (elapsed - d) / TRAVEL_DUR;

            // Colors are constant (already baked into colArr) — skip re-writing them every frame

            // Pre-launch: sit at burst position (jitter removed for perf)
            if (tRaw <= 0) {
                arr[i * 3]     = burstPos[i * 3];
                arr[i * 3 + 1] = burstPos[i * 3 + 1];
                arr[i * 3 + 2] = burstPos[i * 3 + 2];
                continue;
            }

            // Settled: position stays in place
            if (settled.current[i] === 1) {
                continue;
            }

            // In flight: flying from Z=-280 to Z=-5.2
            const t  = Math.min(tRaw, 1.0);
            const tE = easeOutExpo(t);

            const sx = burstPos[i * 3];
            const sy = burstPos[i * 3 + 1];
            const sz = burstPos[i * 3 + 2];
            const dx = targetPos[i * 3];
            const dy = targetPos[i * 3 + 1];
            const dz = targetPos[i * 3 + 2];

            // Parabolic path / wobble to look natural
            const wobble  = Math.sin(t * Math.PI) * 1.5;
            const travelX = dx - sx;
            const travelY = dy - sy;
            const tLen    = Math.sqrt(travelX * travelX + travelY * travelY) + 0.001;
            const perpX   = -(travelY / tLen) * wobble;
            const perpY   =  (travelX / tLen) * wobble;

            arr[i * 3]     = sx + travelX * tE + perpX;
            arr[i * 3 + 1] = sy + travelY * tE + perpY;
            arr[i * 3 + 2] = sz + (dz - sz) * tE;

            if (t >= 1.0) {
                settled.current[i] = 1;
                settledCount.current++;
                arr[i * 3]     = dx;
                arr[i * 3 + 1] = dy;
                arr[i * 3 + 2] = dz;
            }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        const settledFrac = settledCount.current / TOTAL;
        mat.size = 0.008 + (1 - settledFrac) * 0.020;

        // ── 3D Text Dynamic Shading (Colors morphing between shades) ──
        const time = clock.elapsedTime;
        
        // Cycle warmth palette for "ADD"
        const valWarm = (time * 0.18) % morphWarmColors.length;
        const idxWarm = Math.floor(valWarm);
        const fracWarm = valWarm - idxWarm;
        const fromWarm = morphWarmColors[idxWarm];
        const toWarm = morphWarmColors[(idxWarm + 1) % morphWarmColors.length];
        
        activeWarmColor.copy(fromWarm).lerp(toWarm, fracWarm);
        
        if (textMatRefA.current) {
            // Emissive color is kept at white #ffffff to allow the gradient emissiveMap to shine in its native colors
            textMatRefA.current.emissive.setHex(0xffffff);
            // Softer emissive intensity to preserve the glossy metallic specular reflections
            textMatRefA.current.emissiveIntensity = 0.45 + Math.sin(time * 2.2) * 0.12;
        }

        // Cycle coolness palette for "VEDI" and "2026"
        const valCool = (time * 0.22) % morphCoolColors.length;
        const idxCool = Math.floor(valCool);
        const fracCool = valCool - idxCool;
        const fromCool = morphCoolColors[idxCool];
        const toCool = morphCoolColors[(idxCool + 1) % morphCoolColors.length];
        
        activeCoolColor.copy(fromCool).lerp(toCool, fracCool);
        
        if (textMatRefV.current) {
            textMatRefV.current.emissive.setHex(0xffffff);
            textMatRefV.current.emissiveIntensity = 0.45 + Math.sin(time * 1.8) * 0.12;
        }
        
        if (tagMatRef.current) {
            tagMatRef.current.emissive.copy(activeCoolColor);
            tagMatRef.current.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.15;
        }
    });

    return (
        <>
            {/* Particles layer */}
            <points frustumCulled={false}>
                <bufferGeometry ref={geoRef}>
                    <bufferAttribute
                        attach="attributes-position"
                        count={TOTAL}
                        array={burstPos}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={TOTAL}
                        array={colArr}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    ref={matRef}
                    size={0.008}
                    vertexColors
                    transparent
                    opacity={0}
                    sizeAttenuation
                    depthWrite={false}
                    depthTest={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            <group ref={textGroupRef}>
                {/* ── "ADD" — solid 3D red, left of sun gap ── */}
                <Center position={[-4.6, MAIN_Y, TEXT_Z + 0.05]}>
                    <Text3D
                        font="/fonts/ethnocentric_bold.typeface.json"
                        size={1.5}
                        height={0.28}
                        curveSegments={5}
                        bevelEnabled
                        bevelThickness={0.03}
                        bevelSize={0.02}
                        bevelSegments={2}
                    >
                        ADD
                        <meshStandardMaterial
                            ref={textMatRefA}
                            color="#e2e8f0"
                            map={leftGradientTex}
                            emissive="#ffffff"
                            emissiveMap={leftGradientTex}
                            emissiveIntensity={0.45}
                            metalness={1.0}
                            roughness={0.05}
                            toneMapped={false}
                            transparent
                            opacity={0}
                        />
                    </Text3D>
                </Center>

                {/* ── "VEDI" — solid 3D blue, right of sun gap ── */}
                <Center position={[5.3, MAIN_Y, TEXT_Z + 0.05]}>
                    <Text3D
                        font="/fonts/ethnocentric_bold.typeface.json"
                        size={1.5}
                        height={0.28}
                        curveSegments={5}
                        bevelEnabled
                        bevelThickness={0.03}
                        bevelSize={0.02}
                        bevelSegments={2}
                    >
                        VEDI
                        <meshStandardMaterial
                            ref={textMatRefV}
                            color="#e2e8f0"
                            map={rightGradientTex}
                            emissive="#ffffff"
                            emissiveMap={rightGradientTex}
                            emissiveIntensity={0.45}
                            metalness={1.0}
                            roughness={0.05}
                            toneMapped={false}
                            transparent
                            opacity={0}
                        />
                    </Text3D>
                </Center>

                {/* ── "2026" — solid 3D tag ── */}
                <Center position={[0, Y2026_Y, TEXT_Z + 0.05]}>
                    <Text3D
                        font="/fonts/ethnocentric_bold.typeface.json"
                        size={0.36}
                        height={0.08}
                        curveSegments={5}
                        bevelEnabled
                        bevelThickness={0.015}
                        bevelSize={0.01}
                        bevelSegments={2}
                    >
                        2026
                        <meshStandardMaterial
                            ref={tagMatRef}
                            color="#ffffff"
                            emissive="#00d9ff"
                            emissiveIntensity={3.0} // High glow visibility
                            metalness={1.0}
                            roughness={0.02}
                            toneMapped={false}
                            transparent
                            opacity={0}
                        />
                    </Text3D>
                </Center>
            </group>
        </>
    );
}
