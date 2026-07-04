import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Spaceship() {
    const shipRef = useRef();

    // Slow organic floating/breathing rotation for the spaceship
    useFrame(({ clock }) => {
        if (!shipRef.current) return;
        const t = clock.elapsedTime;
        shipRef.current.position.y = 38 + Math.sin(t * 0.5) * 1.5;
        shipRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;
        shipRef.current.rotation.z = Math.cos(t * 0.3) * 0.02;
    });

    // Build a tighter hollow octagonal hangar corridor in the center of the spaceship (radius 6.5)
    const hangarPanels = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        hangarPanels.push(
            <mesh 
                key={i} 
                position={[Math.sin(angle) * 6.5, Math.cos(angle) * 6.5, 0]} 
                rotation={[0, 0, -angle]}
            >
                <boxGeometry args={[6, 0.8, 50]} />
                <meshBasicMaterial color={i % 2 === 0 ? "#080c16" : "#04060b"} />
            </mesh>
        );
    }

    return (
        <group ref={shipRef} position={[0, 38, -235]}>
            {/* 1. Hollow Hangar Tunnel in the Center */}
            <group>
                {hangarPanels}
            </group>

            {/* 2. Large Hexagonal Backing Plate to Eclipse the Sun & Cast GodRays */}
            {/* Opaque outer shield (blocks the sun) */}
            <mesh position={[0, 0, -15]} rotation={[0, 0, Math.PI / 6]}>
                <ringGeometry args={[4, 25, 6]} />
                <meshBasicMaterial color="#020305" />
            </mesh>
            {/* Glowing Reactor Core / Portal center */}
            <mesh position={[0, 0, -14.9]}>
                <circleGeometry args={[4, 32]} />
                <meshBasicMaterial color="#ff1f4f" toneMapped={false} />
            </mesh>

            {/* 3. Massive Left Wing Structure */}
            <mesh position={[-25, 0, -5]} rotation={[0.05, 0.1, -0.06]}>
                <boxGeometry args={[28, 3, 30]} />
                <meshBasicMaterial color="#03050a" />
            </mesh>
            {/* Wing Detail Panels - Left */}
            <mesh position={[-18, 2.0, -2]} rotation={[0.05, 0.1, -0.06]}>
                <boxGeometry args={[12, 1.2, 18]} />
                <meshBasicMaterial color="#070a14" />
            </mesh>

            {/* 4. Massive Right Wing Structure */}
            <mesh position={[25, 0, -5]} rotation={[0.05, -0.1, 0.06]}>
                <boxGeometry args={[28, 3, 30]} />
                <meshBasicMaterial color="#03050a" />
            </mesh>
            {/* Wing Detail Panels - Right */}
            <mesh position={[18, 2.0, -2]} rotation={[0.05, -0.1, 0.06]}>
                <boxGeometry args={[12, 1.2, 18]} />
                <meshBasicMaterial color="#070a14" />
            </mesh>

            {/* 5. Giant Spires / Antennas */}
            <mesh position={[-38, 0, -18]} rotation={[0, 0, -0.15]}>
                <cylinderGeometry args={[0.15, 0.6, 20, 8]} />
                <meshBasicMaterial color="#020305" />
            </mesh>
            <mesh position={[38, 0, -18]} rotation={[0, 0, 0.15]}>
                <cylinderGeometry args={[0.15, 0.6, 20, 8]} />
                <meshBasicMaterial color="#020305" />
            </mesh>

            {/* 6. Glowing Neon Markings on Hull */}
            <mesh position={[-16, 1.8, 6]} rotation={[-Math.PI / 2, 0, -0.08]}>
                <planeGeometry args={[10, 0.3]} />
                <meshBasicMaterial color="#ff1f4f" toneMapped={false} />
            </mesh>
            <mesh position={[16, 1.8, 6]} rotation={[-Math.PI / 2, 0, 0.08]}>
                <planeGeometry args={[10, 0.3]} />
                <meshBasicMaterial color="#00d9ff" toneMapped={false} />
            </mesh>

            {/* 7. Glowing "ADDOVEDI 2026" Text on the Hull Face */}
            <Text
                position={[0, 8.2, 16.1]}
                fontSize={3.2}
                fontWeight="black"
                letterSpacing={0.12}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
            >
                ADDOVEDI 2026
                <meshBasicMaterial color="#ff1f4f" toneMapped={false} />
            </Text>
        </group>
    );
}
