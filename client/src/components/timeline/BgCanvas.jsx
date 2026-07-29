import { useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';

const PART_ANIMS = {
    Object003:  { axis: 'z', speed:  0.18, dir:  1 },
    Object007:  { axis: 'z', speed: -0.28, dir: -1 },
    Object008:  { axis: 'z', speed:  0.28, dir:  1 },
    Object006:  { axis: 'z', speed: -0.45, dir: -1 },
    Object005:  { axis: 'z', speed:  0.45, dir:  1 },
    Object001:  { axis: 'z', speed: -0.85, dir: -1 },
    Object002:  { axis: 'z', speed:  1.10, dir:  1 },
    Object010:  { axis: 'z', speed: -0.60, dir: -1 },
    Object004:  { axis: 'z', speed:  0.22, dir:  1 },
    Object009:  { axis: 'z', speed:  0.75, dir:  1 },
    Object012:  { axis: 'z', speed: -(2 * Math.PI / 3600), dir: 1, realTime: true, hand: 'minute' },
    Object013:  { axis: 'z', speed: -(2 * Math.PI / 43200), dir: 1, realTime: true, hand: 'hour' },
    Object015:  { axis: 'z', speed: -(2 * Math.PI / 60), dir: 1, realTime: true, hand: 'second' },
    Sphere002:  { axis: 'x', speed: 1.2, dir: 1, pendulum: true, amp: 0.35 },
    Sphere004:  { axis: 'x', speed: 1.8, dir:-1, pendulum: true, amp: 0.20 },
    Sphere005:  { axis: 'x', speed: 1.8, dir: 1, pendulum: true, amp: 0.20 },
    Cylinder004:    { axis: 'z', speed: 0.06, dir: 1 },
    outerdecoration:{ axis: 'z', speed:-0.04, dir: 1 },
};

function getHandAngle(hand) {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (hand === 'second') return -(s / 60) * 2 * Math.PI;
    if (hand === 'minute') return -(m / 60) * 2 * Math.PI;
    if (hand === 'hour')   return -(h / 12) * 2 * Math.PI;
    return 0;
}

function HolographicClock() {
    const { scene } = useGLTF('/models/steampunk_clock/scene.glb');
    const time = useRef(0);
    const partsRef = useRef({});

    const holoMat = useMemo(() => new THREE.MeshStandardMaterial({
        color:            new THREE.Color('#00E5FF'),
        emissive:         new THREE.Color('#00E5FF'),
        emissiveIntensity: 0.65,
        metalness:   0.0,
        roughness:   1.0,
        transparent: true,
        opacity:     0.20,
        side:        THREE.DoubleSide,
        depthWrite:  false,
    }), []);

    const secondMat = useMemo(() => new THREE.MeshStandardMaterial({
        color:            new THREE.Color('#FF2CFB'),
        emissive:         new THREE.Color('#FF2CFB'),
        emissiveIntensity: 0.9,
        metalness:   0.0,
        roughness:   1.0,
        transparent: true,
        opacity:     0.35,
        side:        THREE.DoubleSide,
        depthWrite:  false,
    }), []);

    useEffect(() => {
        if (!scene) return;

        scene.traverse(obj => {
            if (!obj.isObject3D) return;
            const anim = PART_ANIMS[obj.name];
            if (anim) {
                partsRef.current[obj.name] = obj;
                if (anim.hand) {
                    const initAngle = getHandAngle(anim.hand);
                    if (anim.axis === 'z') obj.rotation.z = initAngle;
                }
            }
            if (obj.isMesh) {
                obj.material = (obj.parent?.name === 'Object015' || obj.name === 'Object015_Material #3_0')
                    ? secondMat
                    : holoMat;
                obj.renderOrder = 1;
            }
        });

        scene.scale.set(1, 1, 1);
        scene.position.set(0, 0, 0);
        scene.rotation.set(0, 0, 0);
        scene.updateMatrixWorld(true);

        const box  = new THREE.Box3().setFromObject(scene);
        const ctr  = new THREE.Vector3();
        const sz   = new THREE.Vector3();
        box.getCenter(ctr);
        box.getSize(sz);
        const maxD   = Math.max(sz.x, sz.y, sz.z);
        const scale  = 7 / maxD;

        scene.scale.setScalar(scale);
        scene.position.set(-ctr.x * scale, -ctr.y * scale - 0.5, -ctr.z * scale);
    }, [scene, holoMat, secondMat]);

    useFrame((_, delta) => {
        time.current += delta;
        const t = time.current;

        Object.entries(partsRef.current).forEach(([name, obj]) => {
            const anim = PART_ANIMS[name];
            if (!anim) return;

            if (anim.pendulum) {
                obj.rotation.x = Math.sin(t * anim.speed) * anim.amp;
            } else if (anim.realTime) {
                obj.rotation[anim.axis] += delta * anim.speed * anim.dir;
            } else {
                obj.rotation[anim.axis] += delta * anim.speed * anim.dir;
            }
        });

        if (holoMat) {
            holoMat.emissiveIntensity = 0.45 + Math.sin(t * 1.4) * 0.28;
            holoMat.opacity           = 0.16 + Math.sin(t * 1.8) * 0.05;
        }
        if (secondMat) {
            secondMat.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.3;
        }
    });

    return <primitive object={scene} />;
}

function HoloLights() {
    return (
        <>
            <ambientLight intensity={0.1} color="#000820" />
            <pointLight position={[0, 4, 2]} intensity={3.0} color="#00E5FF" distance={20} decay={2} />
            <pointLight position={[-4, -2, 3]} intensity={1.5} color="#7A5CFF" distance={15} decay={2} />
            <pointLight position={[4, 2, -2]} intensity={1.0} color="#FF2CFB" distance={12} decay={2} />
        </>
    );
}

function HoloBg() {
    return (
        <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }}>
            <Canvas
                camera={{ fov: 45, position: [0, 0, 12], near: 0.1, far: 100 }}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
                style={{ background: 'transparent' }}
            >
                <AdaptiveDpr pixelRatio={[1, 1.5]} />
                <AdaptiveEvents />
                <HoloLights />
                <Suspense fallback={null}>
                    <HolographicClock />
                </Suspense>
            </Canvas>
        </div>
    );
}

function BgOverlay() {
    const ref = useRef(null);
    const raf = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const onResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        const GRID = 55;
        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.3) * 0.3,
            r: Math.random() * 1.1 + 0.25,
            a: Math.random() * 0.35 + 0.06,
            c: Math.random() > 0.5 ? '#00E5FF' : '#7A5CFF',
        }));
        const streaks = Array.from({ length: 8 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            len: Math.random() * 90 + 40, speed: Math.random() * 1.4 + 0.7,
            a: Math.random() * 0.06 + 0.02,
        }));
        const radars = [
            { x: W * 0.07, y: H * 0.5, r: 140, phase: 0 },
            { x: W * 0.93, y: H * 0.45, r: 120, phase: Math.PI },
        ];

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.strokeStyle = 'rgba(0,229,255,0.03)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            radars.forEach(rd => {
                rd.phase = (rd.phase + 0.007) % (Math.PI * 2);
                ctx.save();
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = '#00E5FF';
                ctx.beginPath();
                ctx.moveTo(rd.x, rd.y);
                ctx.arc(rd.x, rd.y, rd.r, rd.phase - 0.5, rd.phase);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
                for (let k = 1; k <= 3; k++) {
                    ctx.beginPath();
                    ctx.arc(rd.x, rd.y, (rd.r / 3) * k, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(0,229,255,0.04)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.restore();
            });

            streaks.forEach(s => {
                s.x += s.speed;
                if (s.x > W + s.len) s.x = -s.len;
                const g = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
                g.addColorStop(0, 'transparent');
                g.addColorStop(0.5, `rgba(0,229,255,${s.a})`);
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.fillRect(s.x, s.y, s.len, 1.5);
            });

            ctx.save();
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();

            if (frame % 90 === 0) {
                const texts = ['0010110', 'SYSTEM ONLINE', 'SYNCING...', 'MISSION READY', '>>> STANDBY <<<', 'T-MINUS 00:00'];
                ctx.fillStyle = 'rgba(0,229,255,0.04)';
                ctx.font = '9px monospace';
                ctx.fillText(texts[Math.floor(Math.random() * texts.length)],
                    Math.random() * W * 0.8 + W * 0.05,
                    Math.random() * H * 0.85 + H * 0.05);
            }
            frame++;
            raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none' }} />;
}

export default function BgCanvas() {
    return (
        <>
            <HoloBg />
            <BgOverlay />
        </>
    );
}
