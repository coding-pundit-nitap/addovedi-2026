// Small "need help?" link to the step-by-step guide. Opens in a NEW tab so a half-filled form is never lost.
// Plain anchor: costs nothing to render and loads nothing until it is clicked. Same-origin, so no rel=noopener:
// the new tab inherits sessionStorage and skips the first-visit loading screen.
export default function GuideLink({ step, label = 'Confused? See the step-by-step guide', style }) {
    return (
        <a
            href={`/how-to-register${step ? `#${step}` : ''}`}
            target="_blank"
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                color: '#00D9FF', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer',
                ...style,
            }}
        >
            <span aria-hidden="true">?</span>{label}<span aria-hidden="true">↗</span>
        </a>
    );
}
