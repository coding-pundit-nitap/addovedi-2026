import { Tunnel } from "../Tunnel";
import { EffectComposer, Bloom, GodRays } from "@react-three/postprocessing";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import CameraRig from "../Camera/CameraRig";
import Particles from "./Particles";
import IntroSequence from "./IntroSequence";
import TextParticles from "./TextParticles";
import Spaceship from "./Spaceship";
import HologramCards from "./HologramCards";
import { useStore } from "../../store/useStore";

// ─── Apocalyptic Background Mountains (flanking the portal for massive scale) ───
function ApocalypticMountains() {
    return (
        <group>
            {/* Left Mountain Range */}
            <mesh position={[-65, 12, -260]} rotation={[0, Math.PI / 4, 0]} scale={[55, 75, 25]}>
                <coneGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color="#020203" roughness={0.9} metalness={0.1} />
            </mesh>
            <mesh position={[-40, 6, -250]} rotation={[0, -Math.PI / 6, 0]} scale={[35, 45, 15]}>
                <coneGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color="#010203" roughness={0.9} metalness={0.1} />
            </mesh>
            
            {/* Right Mountain Range */}
            <mesh position={[65, 12, -260]} rotation={[0, -Math.PI / 4, 0]} scale={[55, 75, 25]}>
                <coneGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color="#020203" roughness={0.9} metalness={0.1} />
            </mesh>
            <mesh position={[40, 6, -250]} rotation={[0, Math.PI / 6, 0]} scale={[35, 45, 15]}>
                <coneGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color="#010203" roughness={0.9} metalness={0.1} />
            </mesh>
        </group>
    );
}

// ─── Floating Holographic Cyber-Gizmos (rotating in the sky, carrying the dark theme) ───
function FloatingCyberGizmos() {
    const groupRef = useRef();
    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.elapsedTime;
            groupRef.current.children.forEach((child, idx) => {
                child.rotation.x = t * 0.15 + idx;
                child.rotation.y = t * 0.22 - idx;
                child.position.y = child.userData.initialY + Math.sin(t * 0.5 + idx) * 2;
            });
        }
    });
    
    return (
        <group ref={groupRef}>
            {/* Left side floating cyber-cube (dim cobalt blue) */}
            <mesh position={[-25, 48, -130]} userData={{ initialY: 48 }}>
                <octahedronGeometry args={[5, 1]} />
                <meshStandardMaterial color="#000000" wireframe emissive="#0055ff" emissiveIntensity={0.6} transparent opacity={0.25} />
            </mesh>
            {/* Right side floating cyber-cube (dim volcanic crimson) */}
            <mesh position={[25, 52, -150]} userData={{ initialY: 52 }}>
                <octahedronGeometry args={[6, 1]} />
                <meshStandardMaterial color="#000000" wireframe emissive="#ff0033" emissiveIntensity={0.6} transparent opacity={0.25} />
            </mesh>
            {/* Center far floating cyber-gizmo */}
            <mesh position={[0, 60, -180]} userData={{ initialY: 60 }}>
                <dodecahedronGeometry args={[4, 1]} />
                <meshStandardMaterial color="#000000" wireframe emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

export default function HeroScene() {
    const [sun, setSun] = useState(null);
    const sunMaterialRef = useRef();

    useEffect(() => {
        // Cinematic page-load blinding sun effect! 
        if (sunMaterialRef.current) {
            // Initiate at a much softer flash
            sunMaterialRef.current.emissiveIntensity = 20;
            // Over roughly the length of the fly-in intro sequence, relax smoothly to a deeply dim state!
            gsap.to(sunMaterialRef.current, {
                emissiveIntensity: 0.5,
                duration: 5.5,
                ease: "power2.out"
            });
        }
    }, []);

    const fogTargetColor = useMemo(() => new THREE.Color(), []);

    useFrame((state) => {
        const speed = useStore.getState().cameraSpeed;
        const sunDimFactor = useStore.getState().sunDimFactor;
        const time = state.clock.elapsedTime;

        // dimFactor ranges from 1.0 (stopped) down to 0.25 (fast movement)
        const dimFactor = 1.0 - Math.min(speed / 1.2, 1.0) * 0.75;

        // Natural cloud cover simulation using multi-layered slow sine waves
        const cloudNoise = Math.sin(time * 0.22) * 0.35 + Math.sin(time * 0.53 + 1.5) * 0.15;
        const cloudFactor = THREE.MathUtils.clamp(0.8 + cloudNoise, 0.45, 1.0);

        // Combined dimming (movement dim + cloud cover dim)
        const finalDim = dimFactor * cloudFactor;

        // 1. Fog far distance: tighter when moving, wider when stopped
        if (state.scene.fog) {
            state.scene.fog.far = THREE.MathUtils.lerp(state.scene.fog.far, 120 + finalDim * 230, 0.08);

            // 2. Fog color: dim down to black during movement or clouds (reuse object, no allocation)
            fogTargetColor.setRGB(0.027 * finalDim, 0.039 * finalDim, 0.102 * finalDim);
            state.scene.fog.color.lerp(fogTargetColor, 0.08);
        }

        // 3. Sun material color & emissive — sunDimFactor drives it to near-zero during arena entrance
        if (sunMaterialRef.current) {
            const sunBrightness = finalDim * sunDimFactor;
            sunMaterialRef.current.color.setRGB(sunBrightness, sunBrightness, sunBrightness);
            sunMaterialRef.current.emissive.setRGB(sunBrightness, sunBrightness, sunBrightness);
        }
    });

    const isEventPage = useStore(s => s.isEventPage);
    const showSun = useStore(s => s.showSun);

    return (
        <>
            <color attach="background" args={['#03050c']} />
            <fog attach="fog" args={['#070a1a', 20, 350]} />

            {/* Twinkling starry sky background (optimized count) */}
            <Stars radius={300} depth={60} count={1500} factor={14} saturation={0.5} fade={false} speed={1} />

            {/* A physical sun structure is removed; the circular portal itself replaces it and acts as the 'O' in ADDOVEDI */}

            {/* Directional light positioned near the portal in the background (shadows disabled for maximum performance) */}
            {!isEventPage && (
                <directionalLight
                    position={[0, 65, -220]}
                    intensity={0.85}
                    color="#ffffff"
                />
            )}

            <IntroSequence />
            <CameraRig />
            <Particles count={200} />
            {/* Text particles burst from sun and converge into ADDVEDI letters */}
            {!isEventPage && (
                <Suspense fallback={null}>
                    <TextParticles />
                </Suspense>
            )}

            {/* Magic Portal floating in space acting as the 'O' in ADDOVEDI (passes setSun to feed GodRays) */}
            {!isEventPage && (
                <Suspense fallback={null}>
                    <Spaceship setPortalMesh={setSun} />
                </Suspense>
            )}

            {/* Tunnel (runway and buildings) */}
            {!isEventPage && <Tunnel />}

            {/* Apocalyptic mountain range silhouette at the end of the runway */}
            {!isEventPage && <ApocalypticMountains />}

            {/* Floating holographic wireframe cyber-gizmos in the sky */}
            {!isEventPage && <FloatingCyberGizmos />}

            {/* Render Hologram Cards when in Event Page */}
            {isEventPage && (
                <Suspense fallback={null}>
                    <HologramCards />
                </Suspense>
            )}

            {/* Set multisampling={0} to bypass heavy AA buffer calculations for major frame rate performance gains */}
            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2.0} />
            </EffectComposer>
        </>
    );
}
