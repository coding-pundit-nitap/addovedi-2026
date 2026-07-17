import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroCanvas from "./components/hero/HeroCanvas";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./store/useStore";
import { AnimatePresence, motion } from "framer-motion";


export default function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const portalFlash = useStore(s => s.portalFlash);
    const isEventPage = useStore(s => s.isEventPage);

    const isStandalonePage = location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/connect' || location.pathname === '/admin';

    // 1. Sync URL path modifications to global Zustand store states on load / refresh
    useEffect(() => {
        const isEvent = location.pathname.startsWith('/event');
        const isHome = location.pathname === '/home' || location.pathname === '/';
        const isStandalone = location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/connect' || location.pathname === '/admin';

        if (location.pathname === '/') {
            navigate('/home', { replace: true });
            return;
        }

        // Bypass store-sync for standalone pages like /timeline, /crew, /alliances, /connect or /admin
        if (isStandalone) return;

        // Set store parameters
        useStore.getState().setIsEventPage(isEvent);
        if (isEvent) {
            useStore.getState().setIsEntered(true);
        } else if (isHome) {
            useStore.getState().setIsEntered(false);
        }
    }, [location.pathname, navigate]);

    // 2. Listen to state changes from inside the Canvas (Zustand) and update browser routing history
    useEffect(() => {
        // Don't redirect away from standalone pages
        if (location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/connect' || location.pathname === '/admin') return;
        if (isEventPage && !location.pathname.startsWith('/event')) {
            navigate('/event');
        } else if (!isEventPage && location.pathname !== '/home' && location.pathname !== '/') {
            navigate('/home');
        }
    }, [isEventPage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-[#020617]">
            {/* Common background 3D Canvas — hidden on standalone pages like /timeline or /crew */}
            {!isStandalonePage && <HeroCanvas />}

            {/* Black Portal Flash (barrel entry blackout) */}
            <AnimatePresence>
                {portalFlash && (
                    <motion.div
                        key="portal-flash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Route overlays (HTML templates) */}
            <AppRoutes />
        </section>
    );
}
