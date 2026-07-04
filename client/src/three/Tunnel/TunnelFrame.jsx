import { COLORS, TUNNEL } from "./constants";

export default function TunnelFrame({ z }) {
    return (
        <group position={[0, 0, z]}>
            {/* --- LEFT HALF ARCH (STRICTLY BLUE) --- */}
            {/* Ceiling Arch Segment */}
            <mesh name="tunnelNeon" userData={{ z }} position={[-TUNNEL.WIDTH / 4 - 0.2, TUNNEL.HEIGHT / 2, 0]}>
                <boxGeometry args={[TUNNEL.WIDTH / 2, 0.4, 0.4]} />
                <meshStandardMaterial
                    color={COLORS.blue}
                    emissive={COLORS.blue}
                    emissiveIntensity={0}
                    transparent
                />
            </mesh>
            {/* Wall Pillar Segment */}
            <mesh name="tunnelNeon" userData={{ z }} position={[-TUNNEL.WIDTH / 2, 0, 0]}>
                <boxGeometry args={[0.4, TUNNEL.HEIGHT, 0.4]} />
                <meshStandardMaterial
                    color={COLORS.blue}
                    emissive={COLORS.blue}
                    emissiveIntensity={0}
                    transparent
                />
            </mesh>


            {/* --- RIGHT HALF ARCH (STRICTLY PINK) --- */}
            {/* Ceiling Arch Segment */}
            <mesh name="tunnelNeon" userData={{ z }} position={[TUNNEL.WIDTH / 4 + 0.2, TUNNEL.HEIGHT / 2, 0]}>
                <boxGeometry args={[TUNNEL.WIDTH / 2, 0.4, 0.4]} />
                <meshStandardMaterial
                    color={COLORS.pink}
                    emissive={COLORS.pink}
                    emissiveIntensity={0}
                    transparent
                />
            </mesh>
            {/* Wall Pillar Segment */}
            <mesh name="tunnelNeon" userData={{ z }} position={[TUNNEL.WIDTH / 2, 0, 0]}>
                <boxGeometry args={[0.4, TUNNEL.HEIGHT, 0.4]} />
                <meshStandardMaterial
                    color={COLORS.pink}
                    emissive={COLORS.pink}
                    emissiveIntensity={0}
                    transparent
                />
            </mesh>

            {/* Note: The precise gap left between them dead-center matches the split-aesthetic exactly */}
        </group>
    );
}
