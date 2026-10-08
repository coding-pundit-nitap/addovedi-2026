import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HeroOverlay from "../components/hero/HeroOverlay";
const EventsPage = lazy(() => import("../components/events/EventsPage"));
const TimelinePage = lazy(() => import("../components/timeline/TimelinePage"));
const CrewPage = lazy(() => import("../components/crew/CrewPage"));
const AlliancesPage = lazy(() => import("../components/alliances/AlliancesPage"));
const AboutPage = lazy(() => import("../components/about/AboutPage"));
const AdminPage = lazy(() => import("../components/admin/AdminPage"));
const MerchPage = lazy(() => import("../components/merch/MerchPage"));

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
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/event" element={<EventsPage />} />
            <Route path="/event/:categoryName" element={<EventsPage />} />
            <Route path="/event/:categoryName/:eventName" element={<EventsPage />} />
        </Routes>
        </Suspense>
    );
}
