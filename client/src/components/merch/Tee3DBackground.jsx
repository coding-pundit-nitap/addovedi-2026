import { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingTee({ img, color }) {
    const texture = useLoader(THREE.TextureLoader, img);
    const meshRef = useRef(null);
    const aspect = texture.image ? texture.image.width / texture.image.height : 1;
    const height = 2.3;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!meshRef.current) return;
        meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.7;
        meshRef.current.rotation.x = -0.06 + Math.sin(t * 0.45) * 0.05;
        meshRef.current.position.y = Math.sin(t * 0.6) * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[height * aspect, height]} />
            <meshBasicMaterial
                map={texture}
                color={color}
                transparent
                opacity={0.5}
                alphaTest={0.05}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export default function Tee3DBackground({ img, color }) {
    return (
        <Canvas
            className="pointer-events-none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 4], fov: 35 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 1.5]}
        >
            <Suspense fallback={null}>
                <RotatingTee img={img} color={color} />
            </Suspense>
        </Canvas>
    );
}
