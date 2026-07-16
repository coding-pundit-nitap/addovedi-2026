import { Routes, Route, Navigate } from "react-router-dom";
import HeroOverlay from "../components/hero/HeroOverlay";
import EventsPage from "../components/hero/EventsPage";
import TimelinePage from "../components/timeline/TimelinePage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HeroOverlay />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/event" element={<EventsPage />} />
            <Route path="/event/:categoryName" element={<EventsPage />} />
            <Route path="/event/:categoryName/:eventName" element={<EventsPage />} />
        </Routes>
    );
}

