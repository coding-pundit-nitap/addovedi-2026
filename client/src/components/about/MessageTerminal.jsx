import { useState } from 'react';
import { API_BASE, TURNSTILE_SITE_KEY } from '../../constants/api';
import TurnstileWidget from '../common/TurnstileWidget';

export default function MessageTerminal({ heading = 'MESSAGE TERMINAL' }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [captchaToken, setCaptchaToken] = useState('');
    const [captchaKey, setCaptchaKey] = useState(0); // bumping it re-mounts the widget (Turnstile tokens are single use)
    const [error, setError] = useState('');
    const [focusFields, setFocusFields] = useState({ name: false, email: false, subject: false, message: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (TURNSTILE_SITE_KEY && !captchaToken) {
            setError('Please complete the security check first.');
            return;
        }
        setSending(true);
        try {
            const res = await fetch(`${API_BASE}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message, turnstileToken: captchaToken }),
            });
            if (res.ok) {
                setSent(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(res.status === 429 ? 'You have sent several messages recently. Please try again later.' : (data.message || 'Could not send your message. Please try again.'));
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setCaptchaToken('');
            setCaptchaKey(k => k + 1);
            setSending(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: '9.5px',
                fontWeight: 900,
                letterSpacing: '0.22em',
                color: '#7A5CFF',
                borderBottom: '1px solid rgba(122,92,255,0.15)',
                paddingBottom: '10px',
            }}>
                {heading}
            </div>

            <div style={{
                background: '#0D1320',
                border: '1.2px solid rgba(122, 92, 255, 0.15)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}>
                {sent ? (
                    <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                        <div style={{
                            display: 'inline-flex', width: '56px', height: '56px', borderRadius: '50%',
                            background: 'rgba(31,255,118,0.12)', border: '1.5px solid #1FFF76',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                            boxShadow: '0 0 15px rgba(31,255,118,0.2)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1FFF76" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h4 style={{ fontFamily: "'Orbitron', monospace", fontSize: '15px', fontWeight: 900, color: '#1FFF76', letterSpacing: '0.12em', margin: '0 0 6px 0' }}>
                            ✓ MESSAGE SENT
                        </h4>
                        <p style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#9CA3AF', margin: 0 }}>
                            We'll get back to you soon.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {['name', 'email', 'subject', 'message'].map(field => {
                            const isText = field === 'message';
                            const val = field === 'name' ? name : field === 'email' ? email : field === 'subject' ? subject : message;
                            const setVal = field === 'name' ? setName : field === 'email' ? setEmail : field === 'subject' ? setSubject : setMessage;
                            const isFocused = focusFields[field];

                            return (
                                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                                    <label
                                        htmlFor={field}
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: '8px',
                                            color: isFocused ? '#00E5FF' : 'rgba(255,255,255,0.4)',
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                            transition: 'color 0.25s',
                                        }}
                                    >
                                        {field}
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        {isText ? (
                                            <textarea
                                                id={field}
                                                required
                                                rows={3}
                                                placeholder={`Enter ${field}...`}
                                                value={val}
                                                onChange={e => setVal(e.target.value)}
                                                onFocus={() => setFocusFields(prev => ({ ...prev, [field]: true }))}
                                                onBlur={() => setFocusFields(prev => ({ ...prev, [field]: false }))}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(0,0,0,0.4)',
                                                    border: '1.2px solid rgba(255,255,255,0.06)',
                                                    borderBottom: isFocused ? '1.2px solid #00E5FF' : '1.2px solid rgba(255,255,255,0.06)',
                                                    color: '#FFF',
                                                    padding: '10px 14px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '11px',
                                                    outline: 'none',
                                                    borderRadius: '4px',
                                                    transition: 'border-color 0.25s, box-shadow 0.25s',
                                                    resize: 'none',
                                                }}
                                            />
                                        ) : (
                                            <input
                                                id={field}
                                                type={field === 'email' ? 'email' : 'text'}
                                                required
                                                placeholder={`Enter ${field}...`}
                                                value={val}
                                                onChange={e => setVal(e.target.value)}
                                                onFocus={() => setFocusFields(prev => ({ ...prev, [field]: true }))}
                                                onBlur={() => setFocusFields(prev => ({ ...prev, [field]: false }))}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(0,0,0,0.4)',
                                                    border: '1.2px solid rgba(255,255,255,0.06)',
                                                    borderBottom: isFocused ? '1.2px solid #00E5FF' : '1.2px solid rgba(255,255,255,0.06)',
                                                    color: '#FFF',
                                                    padding: '8px 14px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '11px',
                                                    outline: 'none',
                                                    borderRadius: '4px',
                                                    transition: 'border-color 0.25s, box-shadow 0.25s',
                                                }}
                                            />
                                        )}

                                        {isFocused && (
                                            <div style={{
                                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px',
                                                background: 'linear-gradient(90deg, #00E5FF, #7A5CFF, #00E5FF)',
                                                backgroundSize: '200% auto',
                                                animation: 'inputBorderTravel 1.5s linear infinite',
                                            }} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {TURNSTILE_SITE_KEY && (
                            <TurnstileWidget
                                key={captchaKey}
                                onVerify={setCaptchaToken}
                                onExpire={() => setCaptchaToken('')}
                                onError={() => setCaptchaToken('')}
                            />
                        )}

                        {error && (
                            <div style={{ color: '#f87171', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.5 }}>{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={sending}
                            style={{
                                position: 'relative',
                                width: '100%',
                                padding: '12px 0',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: '9.5px',
                                fontWeight: 900,
                                letterSpacing: '0.25em',
                                color: '#FFF',
                                background: 'linear-gradient(90deg, #7A5CFF 0%, #00E5FF 100%)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.25)',
                                transition: 'all 0.25s',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 229, 255, 0.45)';
                                e.currentTarget.style.transform = 'scale(1.01)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 229, 255, 0.25)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {sending ? 'SENDING...' : 'SEND MESSAGE'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
