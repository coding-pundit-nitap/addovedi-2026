import { useEffect, useRef } from 'react';

export default function BgCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.5 + 0.8,
            color: Math.random() > 0.5 ? '#00e5ff' : '#ff2cfb'
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Faint Grid Backing
            ctx.strokeStyle = 'rgba(0,217,255,0.015)';
            ctx.lineWidth = 1;
            const GRID = 70;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Draw Plexus lines first
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.12;
                        ctx.strokeStyle = p1.color === '#00e5ff' ? `rgba(0, 229, 255, ${alpha})` : `rgba(255, 44, 251, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw Floating Particles
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                
                // Draw glowing dot
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                
                // Small inner core
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1.0;

            // Faint system diagnostic terminal feeds in background
            if (frame % 150 === 0) {
                const logs = ['NODE_SYS_ACTIVE', 'DATABASE_SYNCED', 'SECURE_CONN', 'MISSION_STATUS_NOMINAL', 'AUTH_LEVEL_3', 'HUD_INITIALIZED'];
                ctx.globalAlpha = 0.04;
                ctx.fillStyle = '#00E5FF';
                ctx.font = '8px monospace';
                ctx.fillText(logs[Math.floor(Math.random() * logs.length)], Math.random() * W, Math.random() * H);
            }

            frame++;
            requestAnimationFrame(tick);
        };
        const handle = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(handle); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity: 0.8 }} />;
}
