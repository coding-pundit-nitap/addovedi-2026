import { lazy, Suspense } from "react";
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

export default function AppRoutes() {
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
