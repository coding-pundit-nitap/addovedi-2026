import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import gsap from 'gsap';

export default function CameraRig() {
    const { camera } = useThree();
    const cameraSpeed = useStore((state) => state.cameraSpeed);
    const isEntered = useStore((state) => state.isEntered);
    const setPortalFlash = useStore((state) => state.setPortalFlash);

    // Refs to track state transitions smoothly
    const transitionActive = useRef(false);
    const insideHangarActive = useRef(false);
    const basePos = useRef(new THREE.Vector3(0, 0, 8));

    useEffect(() => {
        if (!isEntered) {
            // Reset state if exited
            if (insideHangarActive.current) {
                insideHangarActive.current = false;
                transitionActive.current = true;
                
                const tl = gsap.timeline({
                    onComplete: () => {
                        transitionActive.current = false;
                    }
                });

                // Animated return to the tunnel start
                tl.to(camera.position, {
                    x: 0,
                    y: 0,
                    z: 8,
                    duration: 3.0,
                    ease: "power2.inOut",
                });
                
                tl.to(camera.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 2.8,
                    ease: "power2.inOut"
                }, 0);

                // Animate cameraSpeed back down
                tl.to({ val: 4.0 }, {
                    val: 0,
                    duration: 3.0,
                    ease: "power2.inOut",
                    onUpdate: function() {
                        useStore.getState().setCameraSpeed(this.targets()[0].val);
                    }
                }, 0);
            }
            return;
        }

        transitionActive.current = true;
        basePos.current.copy(camera.position);

        const tl = gsap.timeline({
            onComplete: () => {
                insideHangarActive.current = true;
                transitionActive.current = false;
            }
        });

        // 1. Warp Speed zoom-in: fly straight past the logo, lift up, and enter the hangar
        tl.to(camera.position, {
            x: 0,
            y: 38,
            z: -235,
            duration: 3.5,
            ease: "power2.inOut",
        });

        // 2. Align rotations perfectly with the hangar corridor
        tl.to(camera.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3.0,
            ease: "power2.out"
        }, 0.5);

        // 3. Animate cameraSpeed to drive environmental dimming & motion blur during warp!
        tl.to({ val: 0 }, {
            val: 8.0, // High speed warp
            duration: 1.75,
            ease: "power2.in",
            onUpdate: function() {
                useStore.getState().setCameraSpeed(this.targets()[0].val);
            }
        }, 0);

        tl.to({ val: 8.0 }, {
            val: 0,
            duration: 1.75,
            ease: "power2.out",
            onUpdate: function() {
                useStore.getState().setCameraSpeed(this.targets()[0].val);
            }
        }, 1.75);

        // 4. White flash overlay: triggers right before entry inside hangar (Z around -210)
        tl.to({}, {
            duration: 0.3,
            onStart: () => setPortalFlash(true),
            onComplete: () => {
                gsap.to({}, {
                    duration: 0.8,
                    onStart: () => setPortalFlash(false),
                });
            }
        }, 2.6);

        return () => {
            tl.kill();
        };
    }, [isEntered, camera, setPortalFlash]);

    useFrame((state) => {
        // If we are actively transitioning (flying in/out), let GSAP control camera completely
        if (transitionActive.current) return;

        const time = state.clock.elapsedTime;

        // If inside the spaceship hangar, apply a gentle handheld breathing drift
        if (insideHangarActive.current) {
            // Slow, claustrophobic breathing motion inside the hangar tunnel
            const driftX = Math.sin(time * 0.4) * 0.4;
            const driftY = 38 + Math.cos(time * 0.5) * 0.3;
            const driftZ = -235 + Math.sin(time * 0.3) * 0.8;

            camera.position.x = THREE.MathUtils.lerp(camera.position.x, driftX, 0.05);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, driftY, 0.05);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, driftZ, 0.05);

            // Subtle rotation sway inside the metal hangar corridor
            camera.rotation.z = Math.sin(time * 0.2) * 0.005;
            camera.rotation.x = Math.sin(time * 0.3) * 0.006;
            camera.rotation.y = Math.cos(time * 0.25) * 0.008;
            return;
        }

        // Default state: straight tunnel zoom-in and smooth swaying
        // 1. Move camera forward blindly along the Z-axis based on GSAP speed
        camera.position.z -= cameraSpeed * 0.05; // Base scalar for fast zooming

        // 2. Smooth Sweeping Gimbal Sway (Wide travel left/right, up/down)
        const swayX = Math.sin(time * 0.38) * 1.1; // Travels widely left/right
        const swayY = Math.cos(time * 0.46) * 0.7; // Travels widely up/down

        // Smooth lerp positioning
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, swayX, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, swayY, 0.04);

        // 3. Cinematic Banking & Tilt (Roll, Pitch, and Yaw coordinate with sway for drone-like inertia)
        const targetRoll  = -swayX * 0.06; // Roll banking left/right
        const targetPitch = -swayY * 0.04; // Pitch tilt up/down
        const targetYaw   = -swayX * 0.03; // Slight pan rotation

        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRoll, 0.04);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetPitch, 0.04);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetYaw, 0.04);
    });

    return null;
}
