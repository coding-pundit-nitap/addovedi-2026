import { useNavigate } from 'react-router-dom';
import CommonNav from '../common/CommonNav';

// Shown instead of the whole Events/Arena section while an admin has it switched off.
export default function EventsComingSoon() {
    const navigate = useNavigate();
    return (
        <div style={{ position: 'fixed', inset: 0, background: '#010307', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <CommonNav />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14, padding: 24 }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', border: '2px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00E5FF', fontSize: 26, boxShadow: '0 0 22px rgba(0,229,255,0.4)' }}>⏳</div>
                <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(20px, 4vw, 34px)', fontWeight: 900, letterSpacing: '0.12em', color: '#fff', margin: 0, textShadow: '0 0 18px rgba(0,229,255,0.5)' }}>EVENTS COMING SOON</h1>
                <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.55)', maxWidth: 400, lineHeight: 1.7, margin: 0 }}>
                    The Addovedi 2026 arena is being prepared. The full list of events will appear here very soon. Create your Addovedi ID in the meantime and check back shortly.
                </p>
                <button
                    type="button"
                    onClick={() => navigate('/home')}
                    style={{ marginTop: 8, padding: '10px 26px', background: 'transparent', border: '1px solid #00E5FF', color: '#00E5FF', fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', cursor: 'pointer' }}
                >
                    BACK TO HOME
                </button>
            </div>
        </div>
    );
}
