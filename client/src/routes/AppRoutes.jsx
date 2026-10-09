import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ADMIN_PATH } from "../constants/routes";
import HeroOverlay from "../components/hero/HeroOverlay";
import EventsComingSoon from "../components/events/EventsComingSoon";
import { useEventsVisible } from "../utils/useRegistrationOpen";
const EventsPage = lazy(() => import("../components/events/EventsPage"));
const TimelinePage = lazy(() => import("../components/timeline/TimelinePage"));
const CrewPage = lazy(() => import("../components/crew/CrewPage"));
const AlliancesPage = lazy(() => import("../components/alliances/AlliancesPage"));
const AboutPage = lazy(() => import("../components/about/AboutPage"));
const AdminPage = lazy(() => import("../components/admin/AdminPage"));
const MerchPage = lazy(() => import("../components/merch/MerchPage"));

// While an admin has the Events section switched off, every /event address shows "coming soon".
function EventsGate() {
    const { visible, loaded } = useEventsVisible();
    if (!loaded) return null; // brief blank while the switch is read, so a hidden section never flashes
    return visible ? <EventsPage /> : <EventsComingSoon />;
}

// Page code is split into lazy chunks. Fetch them all in the background once the site is idle, so clicking a page
// never waits on a download (which showed up as a blank dark screen for a second or two).
const preloadPages = () => {
    [
        () => import("../components/events/EventsPage"),
        () => import("../components/timeline/TimelinePage"),
        () => import("../components/crew/CrewPage"),
        () => import("../components/alliances/AlliancesPage"),
        () => import("../components/about/AboutPage"),
        () => import("../components/merch/MerchPage"),
    ].forEach(load => { load().catch(() => {}); });
};

export default function AppRoutes() {
    useEffect(() => {
        const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
        const id = idle(preloadPages);
        return () => { if (window.cancelIdleCallback && typeof id === 'number') window.cancelIdleCallback(id); };
    }, []);

    return (
        <Suspense fallback={null}>
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HeroOverlay />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/crew" element={<CrewPage />} />
            <Route path="/alliances" element={<AlliancesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path={ADMIN_PATH} element={<AdminPage />} />
            <Route path="/event" element={<EventsGate />} />
            <Route path="/event/:categoryName" element={<EventsGate />} />
            <Route path="/event/:categoryName/:eventName" element={<EventsGate />} />
            {/* Unknown addresses (including the old /admin) go home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        </Suspense>
    );
}
