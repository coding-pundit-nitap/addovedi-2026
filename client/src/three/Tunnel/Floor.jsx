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
        
        if (leftMatRef.current) leftMatRef.current.emissiveIntensity = 0.06 * finalDim;
        if (rightMatRef.current) rightMatRef.current.emissiveIntensity = 0.06 * finalDim;
        if (centerMatRef.current) centerMatRef.current.emissiveIntensity = 10 * finalDim;
    });

    return (
        <group>
            {/* ---------------- LEFT SIDE: STRICTLY BLUE ---------------- */}
            <group position={[-15, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -105]} receiveShadow>
                    <planeGeometry args={[28, 260]} />
                    <meshStandardMaterial ref={leftMatRef} color="#06080f" roughness={0.20} metalness={0.88} emissive="#24d9ff" emissiveIntensity={0.06} />
                </mesh>
            </group>

            {/* ---------------- RIGHT SIDE: STRICTLY PINK ---------------- */}
            <group position={[15, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, -105]} receiveShadow>
                    <planeGeometry args={[28, 260]} />
                    <meshStandardMaterial ref={rightMatRef} color="#06080f" roughness={0.20} metalness={0.88} emissive="#ff345f" emissiveIntensity={0.06} />
                </mesh>
            </group>

            {/* Absolutely pristine single un-duplicated core central white neon strip natively drawn onto track */}
            <mesh position={[0, -1.08, -130]}>
                <boxGeometry args={[0.3, 0.1, 260]} />
                <meshStandardMaterial ref={centerMatRef} color="#ffffff" emissive="#ffffff" emissiveIntensity={10} toneMapped={false} />
            </mesh>

            {/* Dynamically tracking grids visually generating infinite speed physics */}
            <group ref={gridGroupRef}>
                <Grid
                    position={[-15, -1.1, -105]}
                    args={[28, 260]}
                    cellSize={2.5}
                    cellThickness={0.5}
                    cellColor="#146ca6"
                    sectionSize={10}
                    sectionThickness={1.4}
                    sectionColor="#24d9ff"
                    fadeDistance={145}
                    fadeStrength={1.45}
                    infiniteGrid={false}
                />

                <Grid
                    position={[15, -1.1, -105]}
                    args={[28, 260]}
                    cellSize={2.5}
                    cellThickness={0.5}
                    cellColor="#a6144e"
                    sectionSize={10}
                    sectionThickness={1.4}
                    sectionColor="#ff345f"
                    fadeDistance={145}
                    fadeStrength={1.45}
                    infiniteGrid={false}
                />
            </group>
        </group>
    );
}
