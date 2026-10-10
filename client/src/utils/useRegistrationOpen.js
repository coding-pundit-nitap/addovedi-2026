import { useEffect, useState } from 'react';
import { API_BASE } from '../constants/api';

// Reads an admin-controlled on/off switch from /settings/<path>. Fails CLOSED:
// until the server says true, visitors see the "coming soon" state.
function useSiteFlag(path, key) {
    const [on, setOn] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/settings/${path}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(String(res.status));
                const data = await res.json();
                if (!cancelled) setOn(data[key] === true);
            } catch { /* keep the last known value (closed by default) */ }
            if (!cancelled) setLoaded(true);
        };
        load();
        const t = setInterval(load, 15000);
        return () => { cancelled = true; clearInterval(t); };
    }, [path, key]);

    return { on, loaded };
}

export function useCrewVisible() {
    const { on, loaded } = useSiteFlag('crew', 'crewVisible');
    return { visible: on, loaded };
}

// 'soon' | 'open' | 'closed'. Fails to 'soon' until the server answers (or if it is an older build).
export default function useRegistrationOpen() {
    const [mode, setMode] = useState('soon');
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/settings/registration`, { cache: 'no-store' });
                if (!res.ok) throw new Error(String(res.status));
                const data = await res.json();
                const m = data.registrationMode || (data.registrationOpen === true ? 'open' : 'soon');
                if (!cancelled) setMode(m);
            } catch { /* keep last known */ }
            if (!cancelled) setLoaded(true);
        };
        load();
        const t = setInterval(load, 15000);
        return () => { cancelled = true; clearInterval(t); };
    }, []);
    return { open: mode === 'open', mode, loaded };
}

// Events section switch. Unlike the flags above this one fails OPEN: if the server can't be reached (or is an
// older build without this setting) the Events section keeps working instead of vanishing. One shared poll serves
// every component that uses it.
const eventsFlag = { visible: true, loaded: false, listeners: new Set(), timer: null };
const loadEventsFlag = async () => {
    try {
        const res = await fetch(`${API_BASE}/settings/events`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            eventsFlag.visible = data.eventsVisible !== false;
        }
    } catch { /* keep the last known value */ }
    eventsFlag.loaded = true;
    eventsFlag.listeners.forEach(fn => fn());
};

export function useEventsVisible() {
    const [, force] = useState(0);
    useEffect(() => {
        const fn = () => force(n => n + 1);
        eventsFlag.listeners.add(fn);
        if (!eventsFlag.timer) {
            loadEventsFlag();
            eventsFlag.timer = setInterval(loadEventsFlag, 15000);
        } else if (eventsFlag.loaded) {
            fn();
        }
        return () => { eventsFlag.listeners.delete(fn); };
    }, []);
    return { visible: eventsFlag.visible, loaded: eventsFlag.loaded };
}
