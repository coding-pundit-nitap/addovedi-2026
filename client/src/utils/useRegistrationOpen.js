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

export default function useRegistrationOpen() {
    const { on, loaded } = useSiteFlag('registration', 'registrationOpen');
    return { open: on, loaded };
}
