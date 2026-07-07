/**
 * Building.jsx — Renders a highly structured, realistic sci-fi monolith
 * built with greebled panels, flared bases, and heavy structural corner columns
 * matching the apocalyptic visual reference, with flickering post-apocalyptic window arrays.
 * Optimized to remove shadow maps for silky-smooth performance while keeping high geometry detail.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { memo } from 'react';
import * as THREE from 'three';

// ─── Apocalyptic Cyberpunk Neon Color Palettes ──────────────────────────────
const RED_NEON   = '#ff0033'; // Left buildings accent (apocalyptic crimson)
const BLUE_NEON  = '#0055ff'; // Right buildings accent (deep cyan blue)
const AMBER_NEON = '#ff6600'; // Left alternate (magma orange)
const CYAN_NEON  = '#00ffff'; // Right alternate (high-tech cyan)

// Shared box geometry across ALL building instances
const boxGeo = new THREE.BoxGeometry(1, 1, 1);

function Building({ position, scale, side }) {
    // Aligns neon outlines with the swapped split: left is blue/cyan, right is red/amber
    const accent   = side < 0 ? BLUE_NEON : RED_NEON;
    const altColor = side < 0 ? CYAN_NEON : AMBER_NEON;

    // Refs for animated pulsing neon lines
    const topBandRef = useRef();

    // Per-building random phase offset for visual variety and independent flickering
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Create a building-specific window material so each building flickers independently (dimmed for realism)
    const winMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.5,
        toneMapped: false,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
    }), [accent]);

    // Window grid: random lit/unlit pattern mapped along the depth (Z) and height (Y) of the building face
    const windowData = useMemo(() => {
        const cols = Math.max(2, Math.round(scale[2] / 2.0)); // columns along depth
        const rows = Math.max(3, Math.round(scale[1] / 2.5)); // rows along height
        const data = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const lit = Math.random() > 0.6; // 40% active window meshes
                data.push({ r, c, rows, cols, lit });
            }
        }
        return data;
    }, [scale]);

    // Throttle animation checks to keep rendering performance high
    const frameSkip = useRef(0);
    useFrame(({ clock }) => {
        frameSkip.current++;
        if (frameSkip.current % 2 !== 0) return;

        const t = clock.elapsedTime;

        // 1. Pulsing top neon band (dimmed for soft outlining)
        if (topBandRef.current) {
            topBandRef.current.emissiveIntensity =
                0.8 + Math.sin(t * 2.5 + phase) * 0.25;
        }

        // 2. Realistic flickering power grid brownout effect for windows
        if (winMat) {
            const noise = Math.sin(t * 15 + phase) * 0.5 + Math.sin(t * 33 + phase * 2.2) * 0.3;
            const brownout = Math.random() > 0.97 ? 0.12 : 1.0; // occasional power brownout drop
            winMat.emissiveIntensity = Math.max(0.04, (0.5 + noise * 0.15) * brownout);
            winMat.opacity = Math.max(0.15, (0.75 + noise * 0.1) * brownout);
        }
    });

    // ── Pre-build Shared Materials for Greebled Blocks ───────────────────────
    
    // Main building plating: highly reflective dark obsidian/charcoal metal (captures reflections)
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#030304',
        roughness: 0.16,
        metalness: 0.95,
        emissive: '#000000'
    }), []);

    // Heavy vertical structural corner armor pillars
    const pillarMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#08080c',
        roughness: 0.22,
        metalness: 0.92
    }), []);

    // Flared bottom heavy base block
    const baseMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#020203',
        roughness: 0.2,
        metalness: 0.96
    }), []);

    // Horizontal armor bands/greebles
    const panelMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.14,
        metalness: 0.95
    }), []);

    // Glowing neon outline crown (dimmed)
    const topBandMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.8, toneMapped: false
    }), [accent]);

    // Secondary mid neon band
    const midBandMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: altColor, emissive: altColor, emissiveIntensity: 0.4, toneMapped: false
    }), [altColor]);

    // Sharp vertical neon stripe running along the front edge (dimmed)
    const stripeMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.4,
        transparent: true, opacity: 0.35, toneMapped: false, depthWrite: false
    }), [accent]);

    const antennaMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: accent, emissive: accent, emissiveIntensity: 0.5, toneMapped: false
    }), [accent]);

    return (
        <group position={position}>

            {/* 1. Main Skyscraper Body Core (Disabled heavy dynamic shadows for optimal performance) */}
            <mesh scale={[scale[0] * 0.82, scale[1], scale[2] * 0.82]} geometry={boxGeo} material={bodyMat} />

            {/* 2. Flared Bottom Base */}
            <mesh
                position={[0, -scale[1] * 0.42, 0]}
                scale={[scale[0] * 1.05, scale[1] * 0.18, scale[2] * 1.05]}
                geometry={boxGeo}
                material={baseMat}
            />

            {/* 3. Protruding Horizontal Armor Panels (Greeble details) */}
            <mesh
                position={[0, scale[1] * 0.22, 0]}
                scale={[scale[0] * 0.92, scale[1] * 0.08, scale[2] * 0.92]}
                geometry={boxGeo}
                material={panelMat}
            />
            <mesh
                position={[0, -scale[1] * 0.12, 0]}
                scale={[scale[0] * 0.92, scale[1] * 0.08, scale[2] * 0.92]}
                geometry={boxGeo}
                material={panelMat}
            />

            {/* 4. Heavy Vertical Corner Armor Columns */}
            <mesh position={[scale[0] * 0.42, 0, scale[2] * 0.42]} scale={[0.18, scale[1] * 1.01, 0.18]} geometry={boxGeo} material={pillarMat} />
            <mesh position={[-scale[0] * 0.42, 0, scale[2] * 0.42]} scale={[0.18, scale[1] * 1.01, 0.18]} geometry={boxGeo} material={pillarMat} />
            <mesh position={[scale[0] * 0.42, 0, -scale[2] * 0.42]} scale={[0.18, scale[1] * 1.01, 0.18]} geometry={boxGeo} material={pillarMat} />
            <mesh position={[-scale[0] * 0.42, 0, -scale[2] * 0.42]} scale={[0.18, scale[1] * 1.01, 0.18]} geometry={boxGeo} material={pillarMat} />

            {/* ── Glowing top neon crown ── */}
            <mesh
                position={[0, scale[1] * 0.51, 0]}
                scale={[scale[0] * 1.04, 0.06, scale[2] * 1.04]}
                geometry={boxGeo}
            >
                <meshStandardMaterial ref={topBandRef} {...topBandMat} />
            </mesh>

            {/* ── Secondary mid neon band (static) ── */}
            <mesh
                position={[0, scale[1] * 0.18, 0]}
                scale={[scale[0] * 1.01, 0.04, scale[2] * 1.01]}
                geometry={boxGeo}
                material={midBandMat}
            />

            {/* ── Vertical neon edge stripe on inner face (static, sharp neon line) ── */}
            <mesh
                position={[side * scale[0] * -0.51, 0, 0]}
                scale={[0.045, scale[1] * 0.72, scale[2] * 0.98]}
                geometry={boxGeo}
                material={stripeMat}
            />

            {/* ── Rich window grid on the inner face (restored for high detail, shadows disabled) ── */}
            {windowData.map(({ r, c, rows, cols, lit }, idx) => {
                if (!lit) return null;
                const wz = (c / (cols - 1 || 1) - 0.5) * scale[2] * 0.82;
                const wy = (r / (rows - 1 || 1) - 0.5) * scale[1] * 0.76;
                const winH = (scale[1] / rows) * 0.35;
                const winZ = (scale[2] / cols) * 0.35;
                return (
                    <mesh
                        key={idx}
                        position={[side * scale[0] * -0.502, wy, wz]}
                        scale={[0.015, winH, winZ]}
                        geometry={boxGeo}
                        material={winMat}
                    />
                );
            })}

            {/* ── Rooftop antenna spike ── */}
            <mesh
                position={[0, scale[1] * 0.54 + 0.3, 0]}
                scale={[0.08, 0.6, 0.08]}
                geometry={boxGeo}
                material={antennaMat}
            />

        </group>
    );
}

export default memo(Building);
