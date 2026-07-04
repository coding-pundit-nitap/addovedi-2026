import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL, COLORS } from '../Tunnel/constants';

export default function Particles({ count = 300 }) {
    const pointsRef = useRef();

    // Use useMemo to generate the massive arrays of random positions and colors only once
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color1 = new THREE.Color(COLORS.blue);
        const color2 = new THREE.Color(COLORS.pink);

        for (let i = 0; i < count; i++) {
            // X: Spread dynamically from left wall to right wall
            positions[i * 3] = (Math.random() - 0.5) * (TUNNEL.WIDTH - 2);
            // Y: Spread from floor to ceiling
            positions[i * 3 + 1] = (Math.random() - 0.5) * (TUNNEL.HEIGHT - 2);
            // Z: Spread deeply down the tunnel strictly scaling with the frames
            positions[i * 3 + 2] = -(Math.random() * (TUNNEL.FRAME_COUNT * TUNNEL.SPACING));

            // Randomly interpolate between blue and pink for absolute cyberpunk aesthetics
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        return [positions, colors];
    }, [count]);

    // Very slow ambient rotation to make the entire starfield drift organically
    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.elapsedTime * 0.05;
        pointsRef.current.rotation.z = time * 0.5;
        // Float upwards exceptionally slowly
        pointsRef.current.position.y = Math.sin(time) * 1.5;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
}
