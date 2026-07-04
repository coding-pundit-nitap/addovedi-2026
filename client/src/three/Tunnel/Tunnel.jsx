import { Floor, SideWalls, NeonWalls, TunnelLights } from ".";

export default function Tunnel() {
    return (
        <group position={[0, -2, 0]}>
            <Floor />
            <SideWalls />
            <NeonWalls />
            <TunnelLights />
        </group>
    );
}
