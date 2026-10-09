import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroCanvas from "./components/hero/HeroCanvas";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./store/useStore";
import { ADMIN_PATH } from "./constants/routes";
import { AnimatePresence, motion } from "framer-motion";
import CommonSidebar from "./components/common/CommonSidebar";
import AuthModal from "./components/portal/PortalPage";
import ScrollToTop from "./components/common/ScrollToTop";
import FirstLoadScreen from "./components/common/FirstLoadScreen";
import InviteBar from "./components/common/InviteBar";


export default function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const portalFlash = useStore(s => s.portalFlash);
    const isEventPage = useStore(s => s.isEventPage);
    const isAuthModalOpen = useStore(s => s.isAuthModalOpen);
    const setAuthModalOpen = useStore(s => s.setAuthModalOpen);

    // A player on an admin-issued temporary password can't do anything until they set their own,
    // so bring up their profile (which shows the change-password form) instead of leaving them guessing.
    useEffect(() => {
        if (location.pathname === ADMIN_PATH) return;
        try {
            const u = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
            if (u?.mustChangePassword) setAuthModalOpen(true);
        } catch { /* not logged in */ }
    }, [location.pathname, setAuthModalOpen]);

    // First-visit loading screen: once per browser session.
    const [showLoader, setShowLoader] = useState(() => {
        try { return !sessionStorage.getItem('addovedi_loaded'); } catch { return false; }
    });
    useEffect(() => {
        if (!showLoader) useStore.getState().setAppReady(true);
    }, [showLoader]);

    const isStandalonePage = location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/about' || location.pathname === ADMIN_PATH || location.pathname === '/merch';

    // 1. Sync URL path modifications to global Zustand store states on load / refresh
    useEffect(() => {
        const isEvent = location.pathname.startsWith('/event');
        const isHome = location.pathname === '/home' || location.pathname === '/';
        const isStandalone = location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/about' || location.pathname === ADMIN_PATH || location.pathname === '/merch';

        if (location.pathname === '/') {
            navigate('/home', { replace: true });
            return;
        }

        // Bypass store-sync for standalone pages like /timeline, /crew, /alliances, /connect or the admin portal
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
        if (location.pathname === '/timeline' || location.pathname === '/crew' || location.pathname === '/alliances' || location.pathname === '/about' || location.pathname === ADMIN_PATH || location.pathname === '/merch') return;
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
            <CommonSidebar />
            <ScrollToTop />
            <InviteBar />

            {showLoader && <FirstLoadScreen onDone={() => setShowLoader(false)} />}

            {/* Auth / Register Modal Popup */}
            <AnimatePresence>
                {isAuthModalOpen && <AuthModal />}
            </AnimatePresence>
        </section>
    );
}
