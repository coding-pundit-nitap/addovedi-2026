import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import Building from './Building';

export default function SideWalls() {
    const buildingData = useMemo(() => {
        const buildings = [];
        // Start buildings at -26 to keep the foreground open so that the ADDOVEDI title text is never hidden
        for (let z = -26; z >= -222; z -= 7) {
            for (const side of [-1, 1]) {
                const depth = 4.5 + ((Math.abs(z) * 13) % 4); // Solid variations
                const width = 4.5 + ((Math.abs(z) * 7) % 4);  // Solid variations
                const height = 3.5 + ((Math.abs(z) * 11) % 12);
                const lane = 12.0 + ((Math.abs(z) * 5) % 3);   // Align outward to clear sways and outer letters

                buildings.push({
                    key: `${side}-${z}`,
                    position: [side * lane, height / 2 - 1.28, 0], // Z stripped locally!
                    zPos: z, // Passed natively to parent group controller!
                    scale: [width, height, depth],
                    colorIndex: side < 0 ? Math.abs(z) % 2 : 1 + (Math.abs(z) % 2),
                    side,
                });
            }
        }
        return buildings;
    }, []);

    const buildingsRef = useRef([]);
    const speedRef = useRef({ value: 18 }); // Softer initial speed (18 units/sec)

    useEffect(() => {
        // Perfectly matches the sun dim and camera fly-in! Drives speed smoothly down to 2.
        gsap.to(speedRef.current, {
            value: 2,
            duration: 5.5,
            ease: "power2.out"
        });
    }, []);

    useFrame((state, delta) => {
        const speed = speedRef.current.value;
        // Share speed globally to eliminate any micro-frame drift between buildings and billboards
        window.tunnelSpeed = speed;

        buildingsRef.current.forEach((bldg) => {
            if (bldg) {
                // Apply dynamic GSAP controlled momentum explicitly here!
                bldg.position.z += speed * delta;

                // When explicitly passing behind user's view, silently map it back seamlessly
                if (bldg.position.z > 20) {
                    // Total arrays length mathematically is (31 slices * 7 distance = 217)
                    bldg.position.z -= 217;
                }
            }
        });
    });

    return (
        <group>
            {buildingData.map((data, i) => (
                <group key={data.key} ref={(el) => buildingsRef.current[i] = el} position={[0, 0, data.zPos]}>
                    <Building
                        position={data.position}
                        scale={data.scale}
                        side={data.side}
                    />
                </group>
            ))}
        </group>
    );
}
