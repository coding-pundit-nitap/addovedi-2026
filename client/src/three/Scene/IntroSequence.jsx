import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useStore } from '../../store/useStore';

export default function IntroSequence() {
    const { scene } = useThree();
    const setCameraSpeed = useStore((state) => state.setCameraSpeed);
    const setShowLogo = useStore((state) => state.setShowLogo);
    const setShowNavbar = useStore((state) => state.setShowNavbar);
    const setShowButton = useStore((state) => state.setShowButton);
    const setShowTextParticles = useStore((state) => state.setShowTextParticles);

    useEffect(() => {
        // Collect all meshes we uniquely named in TunnelFrame.jsx
        const frameMaterials = [];
        scene.traverse((child) => {
            if (child.isMesh && child.name === "tunnelNeon") {
                frameMaterials.push({ material: child.material, z: child.userData.z });
            }
        });

        // Sort them absolutely precisely by Z axis to ensure stagger perfectly flows downwards
        // Since z is negative, we sort descending to animate closest first
        frameMaterials.sort((a, b) => b.z - a.z);

        // Extract just the material references array for GSAP
        const materialsOnly = frameMaterials.map(f => f.material);

        const tl = gsap.timeline();

        // 1.0s: The tunnel lights power on one after another
        if (materialsOnly.length > 0) {
            // We stagger based on their sorted order (closest to furthest)
            tl.to(materialsOnly, {
                emissiveIntensity: 6,
                stagger: 0.05,
                duration: 0.7,
                ease: "power2.out"
            }, 1.0);
        }

        // 1.5s: The camera begins moving slowly
        tl.to({ speed: 0 }, {
            speed: 0.3,
            duration: 1.0,
            onUpdate: function () { setCameraSpeed(this.targets()[0].speed); }
        }, 1.5);

        // 2.5s: The speed increases slightly
        tl.to({ speed: 0.3 }, {
            speed: 1.2,
            duration: 1.0,
            ease: "power2.in",
            onUpdate: function () { setCameraSpeed(this.targets()[0].speed); }
        }, 2.5);

        // 3.8s: Particles burst from sun and begin converging into letter shapes
        tl.call(() => setShowTextParticles(true), [], 3.8);

        // 4.0s: The ADDOVEDI logo starts materializing (React state flip)
        tl.call(() => setShowLogo(true), [], 4.0);

        // 5.0s: The camera eases to a stop
        tl.to({ speed: 1.2 }, {
            speed: 0,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () { setCameraSpeed(this.targets()[0].speed); }
        }, 5.0);

        // 5.5s: Navbar fades in
        tl.call(() => setShowNavbar(true), [], 5.5);

        // 6.0s: "ENTER THE ARENA" button glows
        tl.call(() => setShowButton(true), [], 6.0);

        // Cleanup on unmount (prevent massive memory leaks during HMR reloading)
        return () => {
            tl.kill();
        };
    }, [scene, setCameraSpeed, setShowLogo, setShowNavbar, setShowButton, setShowTextParticles]);

    return null;
}
