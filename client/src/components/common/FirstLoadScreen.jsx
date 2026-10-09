import { useEffect, useRef, useState } from 'react';
import { useProgress, useGLTF } from '@react-three/drei';
import addovediLogo from '../../assets/images/addovedi-logo-white.png';

// Shown once per browser session. Pure DOM + CSS (transform/opacity only), so it
// keeps animating on the compositor even while the main thread is busy parsing
// 3D models. Progress comes from the real asset loading manager.
const MIN_MS = 2400;      // never flash by, even on a fast connection
const MAX_MS = 15000;     // never trap the visitor on a slow one
const SETTLE_MS = 500;    // loading must be idle this long before we dismiss
const NO_ASSETS_MS = 1800; // pages with no 3D scene have nothing to wait for

// Heavier models, fetched quietly after the loader is dismissed so later pages open instantly.
const BACKGROUND_MODELS = ['mecha', 'electrical', 'ai', 'civil', 'controller', 'coding', 'steampunk_clock'];

const STATUS = ['Booting arena systems', 'Charging the tunnel', 'Loading holograms', 'Syncing the arena', 'Almost there'];

export default function FirstLoadScreen({ onDone }) {
    const { progress, active, total } = useProgress();
    const [leaving, setLeaving] = useState(false);
    const [statusIdx, setStatusIdx] = useState(0);
    const start = useRef(Date.now());
    const idleSince = useRef(null);
    const finished = useRef(false);
    const exited = useRef(false);

    // Start fetching the models the first screens need.
    useEffect(() => {
        useGLTF.preload('/models/gun/scene.glb');
        useGLTF.preload('/models/portal/scene.glb');
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            if (finished.current) return;
            const elapsed = Date.now() - start.current;
            if (active) idleSince.current = null;
            else if (idleSince.current === null) idleSince.current = Date.now();
            const settled = idleSince.current !== null && Date.now() - idleSince.current >= SETTLE_MS;
            const loaded = total > 0 ? settled && progress >= 100 : elapsed > NO_ASSETS_MS;
            if ((loaded && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
                finished.current = true;
                setLeaving(true);
            }
        }, 150);
        return () => clearInterval(id);
    }, [active, progress, total]);

    useEffect(() => {
        const id = setInterval(() => setStatusIdx(i => Math.min(i + 1, STATUS.length - 1)), 1800);
        return () => clearInterval(id);
    }, []);

    const handleExited = () => {
        if (exited.current) return;
        exited.current = true;
        try { sessionStorage.setItem('addovedi_loaded', '1'); } catch { /* private mode */ }
        onDone();
        const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
        idle(() => BACKGROUND_MODELS.forEach(m => useGLTF.preload(`/models/${m}/scene.glb`)));
    };

    // Safety net in case the fade's transitionend never fires (e.g. background tab)
    useEffect(() => {
        if (!leaving) return;
        const t = setTimeout(handleExited, 1200);
        return () => clearTimeout(t);
    }, [leaving]); // eslint-disable-line react-hooks/exhaustive-deps

    const pct = leaving ? 100 : Math.min(99, Math.round(progress));

    return (
        <div
            className={`fls-root${leaving ? ' fls-leaving' : ''}`}
            onTransitionEnd={(e) => { if (leaving && e.target === e.currentTarget) handleExited(); }}
            role="status"
            aria-label="Loading Addovedi 2026"
        >
            <style>{`
                .fls-root { position: fixed; inset: 0; z-index: 100000; background: #020617; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; opacity: 1; transition: opacity .7s ease; padding: 24px; box-sizing: border-box; overflow: hidden; }
                .fls-root.fls-leaving { opacity: 0; pointer-events: none; }
                .fls-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(0,229,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.05) 1px, transparent 1px); background-size: 48px 48px; -webkit-mask-image: radial-gradient(circle at center, #000 0%, transparent 70%); mask-image: radial-gradient(circle at center, #000 0%, transparent 70%); }
                .fls-core { position: relative; width: min(60vw, 240px); height: min(60vw, 240px); display: flex; align-items: center; justify-content: center; }
                .fls-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; border-top-color: #00e5ff; border-right-color: rgba(0,229,255,.25); animation: fls-spin 1.8s linear infinite; will-change: transform; }
                .fls-ring2 { inset: 14px; border-top-color: #ff2cfb; border-right-color: rgba(255,44,251,.2); animation-duration: 2.8s; animation-direction: reverse; }
                .fls-glow { position: absolute; inset: 22%; border-radius: 50%; background: radial-gradient(circle, rgba(0,229,255,.35), transparent 70%); animation: fls-pulse 2.2s ease-in-out infinite; will-change: transform, opacity; }
                .fls-logo { position: relative; width: 62%; height: auto; filter: drop-shadow(0 0 14px rgba(0,229,255,.55)); }
                .fls-bar { position: relative; width: min(78vw, 360px); height: 4px; background: rgba(255,255,255,.08); border-radius: 4px; overflow: hidden; }
                .fls-fill { position: absolute; inset: 0; background: linear-gradient(90deg, #00e5ff, #7a5cff, #ff2cfb); transform-origin: left center; transition: transform .45s ease-out; will-change: transform; box-shadow: 0 0 12px rgba(0,229,255,.7); }
                .fls-meta { display: flex; justify-content: space-between; width: min(78vw, 360px); font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: .2em; color: rgba(255,255,255,.55); text-transform: uppercase; }
                .fls-pct { color: #00e5ff; font-weight: 700; }
                .fls-tag { font-family: monospace; font-size: 11px; letter-spacing: .18em; color: rgba(255,255,255,.35); text-align: center; }
                @keyframes fls-spin { to { transform: rotate(360deg); } }
                @keyframes fls-pulse { 0%, 100% { transform: scale(.85); opacity: .6; } 50% { transform: scale(1.15); opacity: 1; } }
                @media (prefers-reduced-motion: reduce) { .fls-ring, .fls-glow { animation: none; } }
            `}</style>
            <div className="fls-grid" />
            <div className="fls-core">
                <div className="fls-ring" />
                <div className="fls-ring fls-ring2" />
                <div className="fls-glow" />
                <img className="fls-logo" src={addovediLogo} alt="Addovedi 2026" />
            </div>
            <div>
                <div className="fls-bar"><div className="fls-fill" style={{ transform: `scaleX(${pct / 100})` }} /></div>
                <div className="fls-meta" style={{ marginTop: 12 }}>
                    <span>{STATUS[statusIdx]}</span>
                    <span className="fls-pct">{String(pct).padStart(2, '0')}%</span>
                </div>
            </div>
            <div className="fls-tag">Arunachal Pradesh's biggest technical fest</div>
            <div className="fls-tag" style={{ color: 'rgba(251,191,36,.7)', fontSize: 10 }}>Note: the website does not work after 10 PM.</div>
        </div>
    );
}
