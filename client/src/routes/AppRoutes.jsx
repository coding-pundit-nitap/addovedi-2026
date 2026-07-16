import { Routes, Route, Navigate } from "react-router-dom";
import HeroOverlay from "../components/hero/HeroOverlay";
import EventsPage from "../components/hero/EventsPage";
import TimelinePage from "../components/timeline/TimelinePage";
import CrewPage from "../components/crew/CrewPage";
import AlliancesPage from "../components/alliances/AlliancesPage";
import ConnectPage from "../components/connect/ConnectPage";
import AdminPage from "../components/admin/AdminPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HeroOverlay />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/crew" element={<CrewPage />} />
            <Route path="/alliances" element={<AlliancesPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/event" element={<EventsPage />} />
            <Route path="/event/:categoryName" element={<EventsPage />} />
            <Route path="/event/:categoryName/:eventName" element={<EventsPage />} />
        </Routes>
    );
}

