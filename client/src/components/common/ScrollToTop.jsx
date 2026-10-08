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
        <button
            type="button"
            aria-label="Scroll to top"
            onClick={() => targetRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
                position: 'fixed', right: 16, bottom: 16, zIndex: 9990,
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(2,6,23,0.85)', color: '#00d9ff', cursor: 'pointer',
                border: '1px solid rgba(0,217,255,0.5)', boxShadow: '0 0 12px rgba(0,217,255,0.3)',
                backdropFilter: 'blur(6px)',
            }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
    );
}
