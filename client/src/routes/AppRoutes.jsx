import { Routes, Route, Navigate } from "react-router-dom";
import HeroOverlay from "../components/hero/HeroOverlay";
import EventsPage from "../components/events/EventsPage";
import TimelinePage from "../components/timeline/TimelinePage";
import CrewPage from "../components/crew/CrewPage";
import AlliancesPage from "../components/alliances/AlliancesPage";
import AboutPage from "../components/about/AboutPage";
import AdminPage from "../components/admin/AdminPage";
import MerchPage from "../components/merch/MerchPage";

export default function AppRoutes() {
    return (
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
    );
}
