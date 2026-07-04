import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import { TUNNEL, COLORS } from './constants';

export default function TunnelLights() {
    const blueRef = useRef();
    const pinkRef = useRef();
    const ambientRef = useRef();
    const rimRef = useRef();

    // Dynamically adjust light intensity based on camera speed and cloud cover
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const speed = useStore.getState().cameraSpeed;
        
        // dimFactor: 1.0 at rest, 0.25 at high speed
        const dimFactor = 1.0 - Math.min(speed / 1.2, 1.0) * 0.75;

        // Natural cloud cover simulation using slow sine waves
        const cloudNoise = Math.sin(t * 0.22) * 0.35 + Math.sin(t * 0.53 + 1.5) * 0.15;
        const cloudFactor = Math.max(0.8 + cloudNoise, 0.45);

        // Combined dimming
        const finalDim = dimFactor * cloudFactor;

        // Pulse logic multiplied by finalDim to reflect both camera movement and cloud cover
        if (blueRef.current) {
            blueRef.current.intensity = (220 + Math.sin(t * 1.3) * 40) * finalDim;
        }
        if (pinkRef.current) {
            pinkRef.current.intensity = (220 + Math.sin(t * 1.7 + 1.0) * 40) * finalDim;
        }
        if (ambientRef.current) {
            ambientRef.current.intensity = 0.12 * finalDim;
        }
        if (rimRef.current) {
            rimRef.current.intensity = 120 * finalDim;
        }
    });

    return (
        <group>
            {/* Slightly raised ambient so metalness has something to reflect */}
            <ambientLight ref={ambientRef} intensity={0.12} color="#1a1a2e" />

            {/* Blue fill — left buildings */}
            <pointLight
                ref={blueRef}
                position={[-6, 8, -20]}
                color={COLORS.blue}
                intensity={220}
                distance={TUNNEL.FRAME_COUNT * TUNNEL.SPACING / 1.2}
                decay={1.4}
            />

            {/* Pink fill — right buildings */}
            <pointLight
                ref={pinkRef}
                position={[6, 8, -20]}
                color={COLORS.pink}
                intensity={220}
                distance={TUNNEL.FRAME_COUNT * TUNNEL.SPACING / 1.2}
                decay={1.4}
            />

            {/* Cyan rim light from far end — hits building tops */}
            <pointLight
                ref={rimRef}
                position={[0, 18, -TUNNEL.FRAME_COUNT * TUNNEL.SPACING + 15]}
                color="#18ffc8"
                intensity={120}
                distance={TUNNEL.FRAME_COUNT * TUNNEL.SPACING}
                decay={1.8}
            />
        </group>
    );
}
