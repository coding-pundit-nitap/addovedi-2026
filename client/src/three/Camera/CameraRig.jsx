import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export default function CameraRig() {
    const { camera } = useThree();
    const cameraSpeed = useStore((state) => state.cameraSpeed);

    useFrame((state) => {
        // 1. Move camera forward blindly along the Z-axis based on GSAP speed
        camera.position.z -= cameraSpeed * 0.05; // Base scalar for fast zooming

        // 2. Smooth Sweeping Gimbal Sway (Wide travel left/right, up/down)
        const time = state.clock.elapsedTime;

        // Wider, slower wave math to make the camera glide smoothly
        const swayX = Math.sin(time * 0.38) * 1.1; // Travels widely left/right
        const swayY = Math.cos(time * 0.46) * 0.7; // Travels widely up/down

        // Smooth lerp positioning
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, swayX, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, swayY, 0.04);

        // 3. Cinematic Banking & Tilt (Roll, Pitch, and Yaw coordinate with sway for drone-like inertia)
        const targetRoll  = -swayX * 0.06; // Roll banking left/right
        const targetPitch = -swayY * 0.04; // Pitch tilt up/down
        const targetYaw   = -swayX * 0.03; // Slight pan rotation

        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRoll, 0.04);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetPitch, 0.04);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetYaw, 0.04);
    });

    return null;
}
