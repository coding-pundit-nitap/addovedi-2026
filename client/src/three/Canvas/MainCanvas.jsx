import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import HeroScene from "../Scene/HeroScene";

export default function MainCanvas() {
    return (
        <Canvas
            shadows
            camera={{
                position: [0, 0, 8],
                fov: 60
            }}
            gl={{
                antialias: true
            }}
            onCreated={({ scene }) => {
                scene.background = new THREE.Color("#020617");
            }}
        >
            <HeroScene />
        </Canvas>
    );
}
