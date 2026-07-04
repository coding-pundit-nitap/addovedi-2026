import { Edges } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { memo } from 'react';
import * as THREE from 'three';

// ─── Gaming colour palette ────────────────────────────────────────────────────
const BLUE  = '#00d9ff';
const PINK  = '#ff2ea6';
const CYAN  = '#18ffc8';
const PURP  = '#9b5cff';

// Shared geometries (one per component instance — memo keeps it single)
const boxGeo = new THREE.BoxGeometry(1, 1, 1);

// ─────────────────────────────────────────────────────────────────────────────

function Building({ position, scale, colorIndex, side }) {
    const accent   = side < 0 ? BLUE : PINK;
    const altColor = (colorIndex % 2 === 0) ? CYAN : PURP;

    // Refs for animated parts
    const topBandRef    = useRef();
    const midBandRef    = useRef();
    const scanRef       = useRef();
    const windowsRef    = useRef([]);

    // Per-building random phase offset so every building pulses differently
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);
    const scanSpeed = useMemo(() => 0.4 + Math.random() * 0.6, []);

    // Window grid: random lit/unlit pattern across the face
    const windowData = useMemo(() => {
        const cols = Math.max(2, Math.round(scale[0] / 1.4));
        const rows = Math.max(3, Math.round(scale[1] / 1.8));
        const data = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const lit = Math.random() > 0.35;
                const color = Math.random() > 0.5 ? accent : altColor;
                data.push({ r, c, rows, cols, lit, color });
            }
        }
        return data;
    }, [scale, accent, altColor]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;

        // Pulsing top neon band
        if (topBandRef.current) {
            topBandRef.current.emissiveIntensity =
                1.6 + Math.sin(t * 2.2 + phase) * 0.8;
        }

        // Slower mid band with different rhythm
        if (midBandRef.current) {
            midBandRef.current.emissiveIntensity =
                1.0 + Math.sin(t * 1.4 + phase + 1.1) * 0.6;
        }

        // Animated scan-line panel moves up the building face
        if (scanRef.current) {
            const yOff = ((t * scanSpeed + phase) % 1.0) * scale[1];
            scanRef.current.position.y = -scale[1] * 0.5 + yOff;
            scanRef.current.material.opacity =
                0.08 + Math.sin(t * 3 + phase) * 0.04;
        }

        // Randomly flicker some windows
        windowsRef.current.forEach((mat, idx) => {
            if (!mat) return;
            if (Math.random() > 0.998) {
                mat.emissiveIntensity = mat.emissiveIntensity > 0.5 ? 0.0 : 1.4;
            }
        });
    });

    return (
        <group position={position}>

            {/* ── Main skyscraper body — highly metallic, low roughness ── */}
            <mesh scale={scale} castShadow receiveShadow geometry={boxGeo}>
                <meshStandardMaterial
                    color="#08091a"
                    roughness={0.18}
                    metalness={0.92}
                    emissive={accent}
                    emissiveIntensity={0.04}
                    envMapIntensity={1.2}
                />
                <Edges color={accent} threshold={15} scale={1.005} renderOrder={1} lineWidth={0.8} />
            </mesh>

            {/* ── Glowing top neon crown ── */}
            <mesh
                position={[0, scale[1] * 0.51, 0]}
                scale={[scale[0] * 1.04, 0.06, scale[2] * 1.04]}
                geometry={boxGeo}
            >
                <meshStandardMaterial
                    ref={topBandRef}
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={1.6}
                    toneMapped={false}
                />
            </mesh>

            {/* ── Secondary mid neon band ── */}
            <mesh
                position={[0, scale[1] * 0.18, 0]}
                scale={[scale[0] * 1.01, 0.04, scale[2] * 1.01]}
                geometry={boxGeo}
            >
                <meshStandardMaterial
                    ref={midBandRef}
                    color={altColor}
                    emissive={altColor}
                    emissiveIntensity={1.0}
                    toneMapped={false}
                />
            </mesh>

            {/* ── Vertical neon edge stripe on inner face ── */}
            <mesh
                position={[side * scale[0] * -0.51, 0, 0]}
                scale={[0.045, scale[1] * 0.72, scale[2] * 0.98]}
                geometry={boxGeo}
            >
                <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={0.9}
                    transparent
                    opacity={0.35}
                    toneMapped={false}
                    depthWrite={false}
                />
            </mesh>

            {/* ── Holographic scan-line panel that slides up the face ── */}
            <mesh
                ref={scanRef}
                position={[side * scale[0] * -0.505, 0, 0]}
                scale={[0.02, scale[1] * 0.12, scale[2] * 0.96]}
                geometry={boxGeo}
            >
                <meshStandardMaterial
                    color={altColor}
                    emissive={altColor}
                    emissiveIntensity={3.0}
                    transparent
                    opacity={0.1}
                    toneMapped={false}
                    depthWrite={false}
                />
            </mesh>

            {/* ── Window grid on the inner face ── */}
            {windowData.map(({ r, c, rows, cols, lit, color }, idx) => {
                if (!lit) return null;
                const wx = (c / (cols - 1 || 1) - 0.5) * scale[0] * 0.82;
                const wy = (r / (rows - 1 || 1) - 0.5) * scale[1] * 0.76;
                const winW = (scale[0] / cols) * 0.45;
                const winH = (scale[1] / rows) * 0.52;
                return (
                    <mesh
                        key={idx}
                        position={[
                            side * scale[0] * -0.502 + wx * (side < 0 ? 0 : 0),
                            wy,
                            0,
                        ]}
                        scale={[0.01, winH, winW]}
                        geometry={boxGeo}
                    >
                        <meshStandardMaterial
                            ref={(el) => { windowsRef.current[idx] = el; }}
                            color={color}
                            emissive={color}
                            emissiveIntensity={1.2}
                            toneMapped={false}
                            depthWrite={false}
                        />
                    </mesh>
                );
            })}

            {/* ── Rooftop antenna spike ── */}
            <mesh
                position={[0, scale[1] * 0.54 + 0.3, 0]}
                scale={[0.08, 0.6, 0.08]}
                geometry={boxGeo}
            >
                <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={2.5}
                    toneMapped={false}
                />
            </mesh>

        </group>
    );
}

export default memo(Building);
