import { Tunnel } from "../Tunnel";
import { EffectComposer, Bloom, GodRays } from "@react-three/postprocessing";
import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import CameraRig from "../Camera/CameraRig";
import Particles from "./Particles";
import IntroSequence from "./IntroSequence";
import TextParticles from "./TextParticles";
import { useStore } from "../../store/useStore";

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

    useFrame((state) => {
        const speed = useStore.getState().cameraSpeed;
        const time = state.clock.elapsedTime;
        
        // dimFactor ranges from 1.0 (stopped) down to 0.25 (fast movement)
        const dimFactor = 1.0 - Math.min(speed / 1.2, 1.0) * 0.75;

        // Natural cloud cover simulation using multi-layered slow sine waves
        const cloudNoise = Math.sin(time * 0.22) * 0.35 + Math.sin(time * 0.53 + 1.5) * 0.15;
        const cloudFactor = THREE.MathUtils.clamp(0.8 + cloudNoise, 0.45, 1.0);

        // Combined dimming (movement dim + cloud cover dim)
        const finalDim = dimFactor * cloudFactor;
        
        // 1. Fog far distance: tighter when moving (mysterious shadow/tunnel depth), wider when stopped
        if (state.scene.fog) {
            state.scene.fog.far = THREE.MathUtils.lerp(state.scene.fog.far, 120 + finalDim * 230, 0.08);
            
            // 2. Fog color: dim down to black during movement or clouds
            const targetFogColor = new THREE.Color('#070a1a').multiplyScalar(finalDim);
            state.scene.fog.color.lerp(targetFogColor, 0.08);
        }
        
        // 3. Background color: dim down during movement or clouds
        if (state.scene.background) {
            const targetColor = new THREE.Color('#03050c').multiplyScalar(finalDim);
            state.scene.background.lerp(targetColor, 0.08);
        }

        // 4. Sun material color & emissive: reacts dynamically to cloud cover and movement
        if (sunMaterialRef.current) {
            sunMaterialRef.current.color.setRGB(finalDim, finalDim, finalDim);
            sunMaterialRef.current.emissive.setRGB(finalDim, finalDim, finalDim);
        }
    });

    return (
        <>
            <color attach="background" args={['#03050c']} />
            <fog attach="fog" args={['#070a1a', 20, 350]} />

            {/* Twinkling starry sky background (larger size factor and fade disabled for high brightness) */}
            <Stars radius={300} depth={60} count={3000} factor={16} saturation={0.5} fade={false} speed={2} />

            {/* A geometrically tighter flawless physical sun structure directly mathematically mapped onto the absolute 3D scene center natively */}
            <mesh ref={setSun} position={[0, 38, -280]}>
                {/* Geometrically tightened to 15 to perfectly physically map seamlessly into the typographical layout constraints */}
                <sphereGeometry args={[15, 32, 32]} />
                <meshStandardMaterial ref={sunMaterialRef} color="#ffffff" emissive="#ffffff" emissiveIntensity={20} />
            </mesh>

            {/* Point light rigorously removed to absolutely guarantee zero physical specular glare on buildings */}

            <IntroSequence />
            <CameraRig />
            <Particles count={500} />
            {/* Text particles burst from sun and converge into ADDVEDI letters */}
            <TextParticles />
            <Tunnel />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.8} />
                {/* Dynamically hooking the physical mesh into GodRays generates highly realistic, cinematic sunbeams structurally */}
                {sun && (
                    <GodRays
                        sun={sun}
                        samples={30}
                        density={0.8}
                        decay={0.94}
                        weight={0.65}
                        exposure={0.45}
                        clampMax={1}
                    />
                )}
            </EffectComposer>
        </>
    );
}
