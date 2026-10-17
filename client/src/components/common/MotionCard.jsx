/**
 * MotionCard.jsx: TRIAL. Gives any card life without changing the card itself:
 *   - reveal: fades and rises into place the first time it scrolls into view (staggered by `delay`)
 *   - float:  a very slow, tiny idle bob so a page of cards never feels frozen
 *   - tilt:   follows the pointer in 3D (desktop only) with a soft light glare that tracks the cursor
 * Pure CSS transforms; the pointer handler writes straight to the element (no React re-renders).
 * Respects "reduce motion". Self-contained styles on purpose (see CLAUDE.md note on shared CSS).
 */
import { useEffect, useMemo, useRef, useState } from 'react';

const canHover = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function MotionCard({
    children,
    delay = 0,          // ms before this card's reveal starts
    reveal = true,
    float = true,
    tilt = true,
    maxTilt = 7,        // degrees
    radius = 14,        // for the glare overlay to match the card's corners
    style,
    className,
}) {
    const outer = useRef(null);
    const inner = useRef(null);
    const glare = useRef(null);
    const reduce = useMemo(reducedMotion, []);
    const [shown, setShown] = useState(!reveal || reduce);
    const floatDelay = useMemo(() => `${(-Math.random() * 6).toFixed(2)}s`, []);

    // Scroll-in reveal
    useEffect(() => {
        if (shown || !outer.current) return;
        if (typeof IntersectionObserver === 'undefined') { setShown(true); return; }
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setShown(true); io.disconnect(); }
        }, { threshold: 0.12 });
        io.observe(outer.current);
        return () => io.disconnect();
    }, [shown]);

    // Pointer tilt + glare
    useEffect(() => {
        const el = inner.current;
        if (!el || !tilt || reduce || !canHover()) return;
        let raf = 0;
        const move = (e) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                el.style.transition = 'transform 0.08s linear';
                el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * maxTilt * 2).toFixed(2)}deg) rotateY(${((px - 0.5) * maxTilt * 2).toFixed(2)}deg) translateZ(0) scale(1.018)`;
                if (glare.current) {
                    glare.current.style.opacity = '1';
                    glare.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.16), rgba(255,255,255,0) 55%)`;
                }
            });
        };
        const leave = () => {
            cancelAnimationFrame(raf);
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
            if (glare.current) glare.current.style.opacity = '0';
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    }, [tilt, maxTilt, reduce]);

    return (
        <div
            ref={outer}
            className={`mc-outer ${float && !reduce ? 'mc-float' : ''} ${className || ''}`}
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.965)',
                transition: reduce ? 'none' : `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                animationDelay: floatDelay,
                willChange: 'transform, opacity',
                ...style,
            }}
        >
            <style>{`
                @keyframes mc-bob { 0% { margin-top: 0px; } 100% { margin-top: -5px; } }
                .mc-float { animation: mc-bob 5.5s ease-in-out infinite alternate; }
            `}</style>
            <div ref={inner} style={{ position: 'relative', height: '100%', transformStyle: 'preserve-3d' }}>
                {children}
                {tilt && !reduce && (
                    <div ref={glare} aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease', mixBlendMode: 'screen' }} />
                )}
            </div>
        </div>
    );
}
