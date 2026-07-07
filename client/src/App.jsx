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

    // 1. Sync URL path modifications to global Zustand store states on load / refresh
    useEffect(() => {
        const isEvent = location.pathname.startsWith('/event');
        const isHome = location.pathname === '/home' || location.pathname === '/';
        
        if (location.pathname === '/') {
            navigate('/home', { replace: true });
            return;
        }

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
        if (isEventPage && !location.pathname.startsWith('/event')) {
            navigate('/event');
        } else if (!isEventPage && location.pathname !== '/home' && location.pathname !== '/') {
            navigate('/home');
        }
    }, [isEventPage, location.pathname, navigate]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#020617]">
            {/* Common background 3D Canvas (persists WebGL context across routes) */}
            <HeroCanvas />

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
