import { slugify } from '../../data/events';
import { whatsappGroupFor } from '../../data/whatsappGroups';

// "Join the WhatsApp group" button for an event. Renders nothing when the event has no group link, so it can never
// leave an empty or broken button behind. Styles are inline on purpose (no other component's CSS is relied on).
export default function WhatsAppJoin({ eventTitle, compact = false }) {
    const url = whatsappGroupFor(slugify(eventTitle || ''));
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box', width: '100%',
                padding: compact ? '10px 14px' : '14px 24px', background: 'rgba(37,211,102,0.14)', border: '1px solid #25D366', color: '#25D366',
                fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: compact ? '11px' : '12px', letterSpacing: '0.1em',
                textDecoration: 'none', textAlign: 'center', cursor: 'pointer',
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2C2.1 6.5 6.5 2.1 12 2.1c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.8 9.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" /></svg>
            JOIN WHATSAPP GROUP ↗
        </a>
    );
}
