/**
 * Spaceship.jsx — Loads the Magic Portal GLTF model,
 * adaptively centers and scales it, and floats it in front of the sun
 * with a glowing title above the ring and a cyan energy field.
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

export default function Spaceship({ setPortalMesh }) {
    const portalRef = useRef();
    const horizonRef = useRef();
    const isEntered = useStore(s => s.isEntered);
    const gunRotationY = useStore(s => s.gunRotationY); // Keep rotation hook reference
    const sunDimFactor = useStore(s => s.sunDimFactor); // Fetch dim factor for smooth dimming

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isMobile = width < 768;
    const responsiveScale = isMobile ? 0.45 : 1.0;

    // Load the GLTF portal model
    const { scene } = useGLTF('/models/portal/scene.glb');

    // Auto-scale, center and recolor to titanium sci-fi look
    const customizedModel = useMemo(() => {
        const clone = scene.clone();

        // 1. Calculate size bounds
        const box = new THREE.Box3().setFromObject(clone);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        // 2. Center the geometry at local origin
        clone.position.sub(center);

        // 3. Compute scale factor (target diameter of 44 units)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 44 / (maxDim || 1);
        clone.scale.set(targetScale, targetScale, targetScale);

        // 4. Adaptively rotate upright if model is modeled lying flat
        if (size.y < size.z && size.y < size.x) {
            clone.rotation.x = Math.PI / 2;
        }

        // 5. Transform fantasy stone materials into metallic sci-fi parts with cyan glows
        clone.traverse((child) => {
            if (child.isMesh) {
                const prevMat = child.material;
                if (prevMat) {
                    const mat = prevMat.clone();
                    
                    const isMoss = (mat.name && mat.name.toLowerCase().includes('moss')) ||
                                   (child.name && child.name.toLowerCase().includes('moss'));
                                   
                    if (isMoss) {
                        // Completely strip the green moss textures and glow
                        mat.map = null;
                        mat.emissiveMap = null;
                        mat.color.setHex(0x0c0d12); // clean dark titanium body
                        mat.emissive.setHex(0x000000); // disable green moss emission
                        mat.emissiveIntensity = 0;
                        mat.metalness = 0.9;
                        mat.roughness = 0.2;
                    } else {
                        // Max metallic reflective dark titanium finish
                        mat.metalness = 0.95;
                        mat.roughness = 0.15;
                        mat.color.setHex(0x11131a); // dark carbon slate body
                        
                        // Replace fantasy yellow/warm stone highlights with cold futuristic electric blue/cyan emissive highlights
                        mat.emissive.setHex(0x00d9ff);
                        mat.emissiveIntensity = 15.0;
                    }

                    child.material = mat;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return clone;
    }, [scene]);

    // Animate slow organic floating
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        
        // If we are entering, fade out the float amplitude to 0 to stabilize portal center at Y=38
        const floatAmp = isEntered ? 0.0 : 1.2;
        const targetY = (38 + Math.sin(t * 0.35) * floatAmp) * responsiveScale;
        
        if (portalRef.current) {
            // Smoothly lerp to center Y=38 as camera zoom flight approaches
            portalRef.current.position.y = THREE.MathUtils.lerp(portalRef.current.position.y, targetY, 0.08);
            // No direct Y-axis spin rotation of portal itself: "dont rotate the portal directly go into it"
            portalRef.current.rotation.y = gunRotationY;
        }

        // 1. Programmatically dim emissive elements of rocks & frame to 0
        if (portalRef.current) {
            portalRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.emissiveIntensity = 15.0 * sunDimFactor;
                }
            });
        }

        // 2. Programmatically dim portal event horizon opacity to 0
        if (horizonRef.current) {
            horizonRef.current.material.opacity = 0.65 * sunDimFactor;
        }
    });

    return (
        <group ref={portalRef} position={[0, 38 * responsiveScale, -220]} scale={[responsiveScale, responsiveScale, responsiveScale]}>
            {/* Render centered titanium Magic Portal (shifted down by 7.1 to align circular ring center with Y=38) */}
            <primitive object={customizedModel} position={[0, -7.1, 0]} />

            {/* Glowing cyan inner portal core horizon (perfectly aligned with ring center and feeds GodRays) */}
            <mesh ref={(el) => {
                horizonRef.current = el;
                if (setPortalMesh) setPortalMesh(el);
            }} position={[0, 0, -0.2]}>
                <circleGeometry args={[12.9, 32]} />
                <meshBasicMaterial color="#00d9ff" toneMapped={false} transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>

            {/* Glowing neon title right above the portal core */}
            <Text
                position={[0, 27.0, 0]}
                fontSize={2.5}
                fontWeight="black"
                letterSpacing={0.18}
                textAlign="center"
            >
                ENTER ADDOVEDI ARENA
                <meshBasicMaterial color="#00d9ff" toneMapped={false} />
            </Text>

            {/* Ambient & local fill lights */}
            <pointLight position={[0, 15, 10]} intensity={350} color="#00d9ff" distance={100} decay={1.5} />
            <pointLight position={[0, -15, 10]} intensity={250} color="#ff1f4f" distance={100} decay={1.5} />
        </group>
    );
}

// Pre-load the portal asset to avoid stuttering
useGLTF.preload('/models/portal/scene.glb');
