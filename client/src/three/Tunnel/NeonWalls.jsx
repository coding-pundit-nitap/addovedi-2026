import { useMemo } from 'react';
import { BufferAttribute, BufferGeometry } from 'three';

// Procedurally calculates massive bounding walls with explicit single-buffer geometries
function WallLines({ side }) {
    const geometry = useMemo(() => {
        const points = [];
        const x = side * 25;
        const zStart = 14;
        const zEnd = -156;
        const yTop = 24;
        const yBottom = -1.1;

        for (let z = zStart; z >= zEnd; z -= 8) {
            points.push(x, yBottom, z, x, yTop, z);
        }

        for (let y = yBottom; y <= yTop; y += 4) {
            points.push(x, y, zStart, x, y, zEnd);
        }

        const lineGeometry = new BufferGeometry();
        lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(points), 3));
        return lineGeometry;
    }, [side]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color={side < 0 ? '#24d9ff' : '#ff345f'} transparent opacity={0.24} />
        </lineSegments>
    );
}

// Replaces the chaotic TunnelFrame arrays entirely with clean left/right split rendering
export default function NeonWalls() {
    return (
        <group>
            <WallLines side={-1} />
            <WallLines side={1} />
        </group>
    );
}
