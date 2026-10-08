import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Pages scroll inside their own containers (root is overflow-hidden), so we
// listen for scroll events in the capture phase and remember which large
// element was scrolled most recently.
export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const targetRef = useRef(null);
    const { pathname } = useLocation();

    useEffect(() => {
        targetRef.current = null;
        setVisible(false);
    }, [pathname]);

    useEffect(() => {
        const onScroll = (e) => {
            const el = e.target === document ? document.scrollingElement : e.target;
            if (!el || el.clientHeight < window.innerHeight * 0.5) return;
            targetRef.current = el;
            setVisible(el.scrollTop > 300);
        };
        document.addEventListener('scroll', onScroll, true);
        return () => document.removeEventListener('scroll', onScroll, true);
    }, []);

    if (!visible) return null;

    return (
        <>
            <style>{`@keyframes stt-pulse { 0%,100% { box-shadow: 0 0 14px rgba(0,217,255,0.45), 0 4px 18px rgba(0,0,0,0.5) } 50% { box-shadow: 0 0 28px rgba(0,217,255,0.85), 0 4px 18px rgba(0,0,0,0.5) } }
.stt-btn { transition: transform .2s } .stt-btn:hover { transform: translateY(-3px) scale(1.06) }`}</style>
            <button
                type="button"
                className="stt-btn"
                aria-label="Scroll to top"
                onClick={() => targetRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                    position: 'fixed', right: 'max(28px, env(safe-area-inset-right))', bottom: 'max(28px, env(safe-area-inset-bottom))', zIndex: 9990,
                    width: 54, height: 54, borderRadius: '50%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 1, cursor: 'pointer',
                    background: 'linear-gradient(145deg, #00e5ff, #0090ff)', color: '#020617',
                    border: '2px solid rgba(255,255,255,0.7)', animation: 'stt-pulse 2.4s ease-in-out infinite',
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                </svg>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 8, fontWeight: 900, letterSpacing: '0.1em' }}>TOP</span>
            </button>
        </>
    );
}
