import { Grid } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import gsap from 'gsap';

export default function Floor() {
    const gridGroupRef = useRef();
    const speedRef = useRef({ value: 18 }); // Softer initial speed (18 units/sec)
    const leftMatRef = useRef();
    const rightMatRef = useRef();
    const centerMatRef = useRef();

    useEffect(() => {
        // Perfectly matches the sun dim and camera fly-in! Drives track speed smoothly down to exactly 2.
        gsap.to(speedRef.current, {
            value: 2,
            duration: 5.5,
            ease: "power2.out"
        });
    }, []);

    useFrame((state, delta) => {
        if (gridGroupRef.current) {
            // Dynamic GSAP controlled velocity precisely mirrored matching the SideWalls architecture 
            gridGroupRef.current.position.z += speedRef.current.value * delta;

            if (gridGroupRef.current.position.z >= 10) {
                gridGroupRef.current.position.z -= 10;
            }
        }

        // Dim floor lights dynamically according to camera speed and cloud cover
        const speed = useStore.getState().cameraSpeed;
        const time = state.clock.elapsedTime;
        const dimFactor = 1.0 - Math.min(speed / 1.2, 1.0) * 0.75;

        // Natural cloud cover simulation using slow sine waves
        const cloudNoise = Math.sin(time * 0.22) * 0.35 + Math.sin(time * 0.53 + 1.5) * 0.15;
        const cloudFactor = Math.max(0.8 + cloudNoise, 0.45);
        const finalDim = dimFactor * cloudFactor;
        
        if (leftMatRef.current) leftMatRef.current.emissiveIntensity = 0.01 * finalDim;
        if (rightMatRef.current) rightMatRef.current.emissiveIntensity = 0.01 * finalDim;
        if (centerMatRef.current) centerMatRef.current.emissiveIntensity = 0;
    });

    return (
        <group>
            {/* ---------------- LEFT SIDE: WET REFLECTIVE BLUE-BLEED ASPHALT ---------------- */}
            <group position={[-15, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -105]}>
                    <planeGeometry args={[28, 260]} />
                    <meshStandardMaterial ref={leftMatRef} color="#030304" roughness={0.12} metalness={0.96} emissive="#0055ff" emissiveIntensity={0.01} />
                </mesh>
            </group>

            {/* ---------------- RIGHT SIDE: WET REFLECTIVE RED-BLEED ASPHALT ---------------- */}
            <group position={[15, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -105]}>
                    <planeGeometry args={[28, 260]} />
                    <meshStandardMaterial ref={rightMatRef} color="#030304" roughness={0.12} metalness={0.96} emissive="#ff0033" emissiveIntensity={0.01} />
                </mesh>
            </group>

            {/* Center line is kept dark/black to match the visual reference (no bright white neon strip) */}
            <mesh position={[0, -1.08, -130]}>
                <boxGeometry args={[0.3, 0.1, 260]} />
                <meshStandardMaterial ref={centerMatRef} color="#050505" emissive="#000000" emissiveIntensity={0} />
            </mesh>

            {/* Dynamically tracking grids visually generating infinite speed physics (colored dark and subtle) */}
            <group ref={gridGroupRef}>
                <Grid
                    position={[-15, -1.1, -105]}
                    args={[28, 260]}
                    cellSize={2.5}
                    cellThickness={0.3}
                    cellColor="#101016"
                    sectionSize={10}
                    sectionThickness={0.8}
                    sectionColor="#000533"
                    fadeDistance={145}
                    fadeStrength={1.45}
                    infiniteGrid={false}
                />

                <Grid
                    position={[15, -1.1, -105]}
                    args={[28, 260]}
                    cellSize={2.5}
                    cellThickness={0.3}
                    cellColor="#101016"
                    sectionSize={10}
                    sectionThickness={0.8}
                    sectionColor="#330005"
                    fadeDistance={145}
                    fadeStrength={1.45}
                    infiniteGrid={false}
                />
            </group>
        </group>
    );
}
