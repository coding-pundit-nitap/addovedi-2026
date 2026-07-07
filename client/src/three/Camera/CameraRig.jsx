/**
 * CameraRig.jsx — Cinematic 4-phase camera entrance into the golden gun.
 *
 * Phase 1a (0–2.5s):  Warp speed DOWN THE MIDDLE of highway, stays near ground (Y≈2)
 * Phase 1b (2.5–3.5s): Rises straight up toward the gun, decelerates
 * Phase 2 (3.5–5.5s): 2s reveal break — full golden gun profile straight ahead
 * Phase 3 (5.5–7.3s): Gun rotates so barrel faces camera head-on
 * Phase 4 (7.3–8.8s): Fly straight into barrel, black flash, Events Page
 */

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import gsap from 'gsap';

export default function CameraRig() {
    const { camera } = useThree();
    const isEntered = useStore(s => s.isEntered);
    const setPortalFlash = useStore(s => s.setPortalFlash);
    const setIsEventPage = useStore(s => s.setIsEventPage);

    const phaseRef = useRef('idle'); // 'idle' | 'warping' | 'inside' | 'returning'
    const tlRef = useRef(null);

    useEffect(() => {
        if (tlRef.current) {
            tlRef.current.kill();
            tlRef.current = null;
        }

        if (isEntered) {
            // Direct load bypass check: if page is loaded directly at /event, position camera instantly inside VR lobby
            if (useStore.getState().isEventPage && phaseRef.current === 'idle') {
                phaseRef.current = 'inside';
                camera.position.set(0, 0.4, 0);
                camera.rotation.set(0.42, 0, 0);
                camera.updateMatrixWorld();
                setPortalFlash(false);
                return;
            }

            phaseRef.current = 'warping';

            const tl = gsap.timeline({
                onComplete: () => {
                    phaseRef.current = 'inside';
                    setIsEventPage(true);

                    // Kill active GSAP timeline to prevent final tick overrides
                    if (tlRef.current) {
                        tlRef.current.kill();
                        tlRef.current = null;
                    }

                    // Reposition camera natively (Y=0.4 is closer to runway floor, X=0.42 tilts more upward)
                    camera.position.set(0, 0.4, 0);
                    camera.rotation.set(0.42, 0, 0);

                    // Force world matrix update immediately for raycasting
                    camera.updateMatrixWorld();

                    setTimeout(() => setPortalFlash(false), 500);
                },
            });
            tlRef.current = tl;

            // ── Sun dims to complete black as we enter ──────────────────────
            tl.to({ val: 1.0 }, {
                val: 0.0,
                duration: 1.8,
                ease: 'power2.in',
                onUpdate: function () {
                    useStore.getState().setSunDimFactor(this.targets()[0].val);
                },
            }, 5.5);

            // ── Phase 1a: Warp — STRAIGHT down the center, near-ground (0 → 2.5s) ──
            // X stays at 0 the whole time — no leftward drift
            tl.to(camera.position, {
                x: 0, y: 2.0, z: -80,
                duration: 2.5,
                ease: 'power3.in',
            }, 0);

            tl.to(camera.rotation, {
                x: 0.0, y: 0.0, z: 0.0,
                duration: 2.5,
                ease: 'power2.out',
            }, 0);

            // Speed lines ramp up (0 → 1.5s)
            tl.to({ val: 0 }, {
                val: 16,
                duration: 1.5,
                ease: 'power2.in',
                onUpdate: function () {
                    useStore.getState().setCameraSpeed(this.targets()[0].val);
                },
            }, 0);

            // Speed lines hold (1.5 → 2.5s)
            tl.to({ val: 16 }, {
                val: 12,
                duration: 1.0,
                ease: 'none',
                onUpdate: function () {
                    useStore.getState().setCameraSpeed(this.targets()[0].val);
                },
            }, 1.5);

            // ── Phase 1b: Rise straight up toward gun (2.5 → 3.5s) ──────────
            tl.to(camera.position, {
                x: 0, y: 36, z: -145,
                duration: 1.0,
                ease: 'power2.out',
            }, 2.5);

            tl.to(camera.rotation, {
                x: -0.02, y: 0.0, z: 0.0,
                duration: 1.0,
                ease: 'power2.inOut',
            }, 2.5);

            // Speed ramp down (2.5 → 3.5s)
            tl.to({ val: 12 }, {
                val: 0,
                duration: 1.0,
                ease: 'power2.out',
                onUpdate: function () {
                    useStore.getState().setCameraSpeed(this.targets()[0].val);
                },
            }, 2.5);

            // ── Phase 2: 2s Reveal Break — gun side profile straight ahead (3.5 → 5.5s) ──
            // Camera is centered at X=0; gun rotation.y = PI/2 shows its side profile perfectly
            tl.to(camera.position, {
                x: 0, y: 38, z: -148,
                duration: 2.0,
                ease: 'sine.inOut',
            }, 3.5);

            tl.to(camera.rotation, {
                x: 0, y: 0, z: 0,
                duration: 2.0,
                ease: 'sine.inOut',
            }, 3.5);

            // ── Phase 3: Gun rotates to face barrel at camera (5.5 → 7.3s) ──
            tl.to(camera.position, {
                x: 0, y: 38, z: -184,
                duration: 1.8,
                ease: 'power2.inOut',
            }, 5.5);

            tl.to(camera.rotation, {
                x: 0, y: 0, z: 0,
                duration: 1.8,
                ease: 'power2.inOut',
            }, 5.5);



            // ── Phase 4: Enter the Barrel (7.3 → 8.8s) ────────────────────
            tl.call(() => useStore.getState().setShowSun(false), [], 7.3);

            tl.to(camera.position, {
                x: 0, y: 38, z: -226,
                duration: 1.5,
                ease: 'power3.in',
            }, 7.3);

            // Black flash just before Events Page
            tl.call(() => setPortalFlash(true), [], 8.7);

        } else {
            // ── Exit path — restore EVERYTHING ───────────────────────────────
            if (phaseRef.current === 'inside') {
                phaseRef.current = 'returning';

                // Trigger black portal flash instantly
                setPortalFlash(true);

                // Wait for black overlay, then reset 3D scene elements and animate camera back
                setTimeout(() => {
                    useStore.getState().setShowSun(true);
                    setIsEventPage(false);

                    // Reset camera position to the barrel muzzle mouth to start exit glide
                    camera.position.set(0, 38, -226);
                    camera.rotation.set(0, 0, 0);

                    const exitTl = gsap.timeline({
                        onComplete: () => {
                            phaseRef.current = 'idle';
                            // Restore UI overlay HUD elements on main page default stage
                            const state = useStore.getState();
                            state.setShowButton(true);
                            state.setShowLogo(true);
                            state.setShowNavbar(true);
                        },
                    });
                    tlRef.current = exitTl;

                    // Fade out the black portal flash overlay after 300ms so we see the glide flight back down the runway!
                    setTimeout(() => setPortalFlash(false), 300);

                    // Sun re-brightens as we return
                    exitTl.to({ val: 0.0 }, {
                        val: 1.0,
                        duration: 2.0,
                        ease: 'power2.out',
                        onUpdate: function () {
                            useStore.getState().setSunDimFactor(this.targets()[0].val);
                        },
                    }, 0);



                    // Camera glides back to runway start
                    exitTl.to(camera.position, {
                        x: 0, y: 0, z: 8,
                        duration: 2.2,
                        ease: 'power2.inOut',
                    }, 0);

                    exitTl.to(camera.rotation, {
                        x: 0, y: 0, z: 0,
                        duration: 2.0,
                        ease: 'power2.inOut',
                    }, 0);
                }, 400);
            }
        }

        return () => {
            if (tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }
        };
    }, [isEntered]); // eslint-disable-line react-hooks/exhaustive-deps

    useFrame(state => {
        if (phaseRef.current === 'inside') {
            const shake = useStore.getState().shakeIntensity;
            if (shake > 0) {
                const time = state.clock.elapsedTime;
                // Strong translation shake (particularly vertical Y)
                const shakeX = (Math.sin(time * 85) + Math.cos(time * 145)) * 0.7 * shake;
                const shakeY = (Math.cos(time * 105) + Math.sin(time * 165)) * 1.3 * shake; // Vertically pronounced
                const shakeZ = Math.sin(time * 125) * 0.6 * shake;

                camera.position.set(shakeX, 0.4 + shakeY, shakeZ);
                camera.rotation.set(
                    0.42 + (Math.sin(time * 95) + Math.cos(time * 135)) * 0.07 * shake, // Vertically pronounced tilt
                    (Math.cos(time * 115) + Math.sin(time * 155)) * 0.05 * shake,
                    (Math.sin(time * 135) * 0.05) * shake
                );
            } else {
                camera.position.set(0, 0.4, 0);
                camera.rotation.set(0.42, 0, 0);
            }
            return;
        }

        if (phaseRef.current !== 'idle') return;

        const time = state.clock.elapsedTime;
        const speed = window.tunnelSpeed || 2;

        // Stiff racing car suspension sways (tighter lateral and vertical float)
        const swayX = Math.sin(time * 0.48) * 0.45;
        const swayY = Math.cos(time * 0.56) * 0.15;

        // Base eye-level Y sits low to the ground (Y = -1.0, which is 1.0 unit above the asphalt) inside the driver's cockpit
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, swayX, 0.06);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -1.0 + swayY, 0.06);

        // High-frequency engine rumble and road vibration (scales up at high velocities)
        const engineRumble = Math.sin(time * 85) * 0.004 * (speed / 18 + 0.25);
        camera.position.y += engineRumble;

        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -swayX * 0.04 + Math.cos(time * 95) * 0.0018 * (speed / 18 + 0.2), 0.06);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -swayY * 0.03, 0.06);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -swayX * 0.02, 0.06);
    });

    return null;
}
