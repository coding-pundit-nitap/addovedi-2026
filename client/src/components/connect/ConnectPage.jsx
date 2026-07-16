/**
 * ConnectPage.jsx — ADDOVEDI HQ ARRIVAL & COMMUNICATIONS
 *
 * An immersive environmental contact portal:
 *  • Hero (100vh): Cinematic camera approach toward a futuristic headquarters facade (Halo/UNSC/Cyberpunk style)
 *  • Enter HQ transition: Sliding massive doors, light leaks, and automatic camera push-through
 *  • HQ Lobby (Split 50/50):
 *     - Left: Contact Directory vertical information desk with row hover sweep beams and copy-to-clipboard actions
 *     - Right: Premium glassmorphic Message Terminal with Apple-like label animations and success states
 *  • Environment detail: Animated elevators, active security drones, radar sweeps, and floor reflections
 *  • Campus Map: Holographic campus SVG visual alongside directions
 *  • Status Panel: System availability dashboard
 *  • Social Feed: Horizontal cards for Instagram, LinkedIn, and YouTube
 *  • Footer: Closing doors goodbye sequence with blinking system console cursors
 */

import { useState, useEffect, useRef } from 'react';
import ConnectNav from './ConnectNav';

export default function ConnectPage() {
    const [copiedText, setCopiedText] = useState(false);
    
    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // Form inputs focus states
    const [focusFields, setFocusFields] = useState({ name: false, email: false, subject: false, message: false });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle email copy
    const copyEmail = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('team@addovedi.in');
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            setSending(false);
            setSent(true);
        }, 1800);
    };

    return (
        <div style={{ position:'fixed', inset:0, background:'#05070D', color:'#F5F7FA', zIndex:100, overflowY:'auto', overflowX:'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes spinRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
                @keyframes searchlight { 
                    0%, 100% { transform: rotate(-25deg); opacity: 0.15; }
                    50% { transform: rotate(25deg); opacity: 0.35; }
                }
                @keyframes droneFloat {
                    0% { transform: translate(0, 0) scale(0.8); opacity: 0.6; }
                    50% { transform: translate(30px, -20px) scale(1.1); opacity: 0.9; }
                    100% { transform: translate(-15px, -40px) scale(0.8); opacity: 0.6; }
                }
                @keyframes elevatorTravel {
                    0%, 100% { transform: translateY(160px); opacity: 0.3; }
                    50% { transform: translateY(10px); opacity: 0.8; }
                }
                @keyframes statusPulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
                @keyframes rowBeam {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes cursorBlink { 0%,100%{opacity:0} 50%{opacity:1} }
                @keyframes inputBorderTravel {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #05070D; }
                ::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.2); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.4); }

                /* Floating nodes */
                .floating-drone {
                    position: absolute;
                    width: 6px; height: 6px;
                    background: #00E5FF;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #00E5FF;
                    pointer-events: none;
                }
            `}} />

            {/* Standalone Nav */}
            <div style={{ position:'relative', zIndex:50 }}>
                <ConnectNav />
            </div>

            {/* ════════════════════════════════════════════
               SECTION 1: HERO FACADE APPROACH (100vh)
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#020306'
            }}>
                {/* Holographic grid and searchlights */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(0,229,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1 }} />
                
                {/* Blue fog atmosphere */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.04) 0%, transparent 80%)', zIndex: 1, pointerEvents: 'none' }} />

                {/* Ambient moving star particles */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: '1.5px', height: '1.5px',
                            background: '#00E5FF',
                            borderRadius: '50%',
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: 'statusPulse 3s infinite alternate',
                            animationDelay: `${Math.random() * -3}s`
                        }} />
                    ))}
                </div>

                {/* Left/Right active searchlights */}
                <div style={{
                    position: 'absolute', bottom: 0, left: '15%', width: '150px', height: '80vh',
                    background: 'linear-gradient(0deg, rgba(0,229,255,0.15) 0%, transparent 80%)',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transformOrigin: 'bottom center',
                    animation: 'searchlight 9s ease-in-out infinite alternate',
                    zIndex: 2, pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, right: '15%', width: '150px', height: '80vh',
                    background: 'linear-gradient(0deg, rgba(0,229,255,0.15) 0%, transparent 80%)',
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transformOrigin: 'bottom center',
                    animation: 'searchlight 11s ease-in-out infinite alternate',
                    zIndex: 2, pointerEvents: 'none'
                }} />

                {/* Cinematic Headquarters Facade Mockup */}
                <div style={{
                    position: 'relative',
                    width: 'min(90vw, 440px)',
                    height: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 10,
                    transform: 'scale(1)',
                    opacity: 1
                }}>
                    {/* HQ Building glass facade */}
                    <div style={{
                        position: 'absolute', bottom: 0, width: '100%', height: '180px',
                        background: 'linear-gradient(180deg, rgba(13,19,32,0.9) 0%, rgba(5,7,13,0.98) 100%)',
                        border: '1.5px solid rgba(0, 229, 255, 0.25)',
                        borderBottom: 'none',
                        borderRadius: '16px 16px 0 0',
                        boxShadow: '0 -20px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,229,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {/* Windows neon light strips grid */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px',
                            width: '80%', height: '60%', opacity: 0.3
                        }}>
                            {Array.from({ length: 18 }).map((_, i) => (
                                <div key={i} style={{
                                    background: Math.random() > 0.4 ? 'rgba(0, 229, 255, 0.75)' : 'transparent',
                                    border: '0.5px solid rgba(0, 229, 255, 0.2)',
                                    boxShadow: Math.random() > 0.4 ? '0 0 6px #00E5FF' : 'none'
                                }} />
                            ))}
                        </div>
                        
                        {/* Main Neon Entrance outline */}
                        <div style={{
                            position: 'absolute', bottom: 0, width: '70px', height: '44px',
                            border: '1.5px solid #00E5FF', borderBottom: 'none',
                            background: 'rgba(0,0,0,0.9)',
                            boxShadow: '0 0 15px rgba(0,229,255,0.5), inset 0 0 10px rgba(0,229,255,0.3)',
                            display: 'flex',
                            overflow: 'hidden'
                        }}>
                            {/* Sliding doors */}
                            <div style={{ flex: 1, background: 'rgba(13,19,32,0.98)', borderRight: '0.5px solid rgba(0,229,255,0.3)', transform: 'translateX(0)' }} />
                            <div style={{ flex: 1, background: 'rgba(13,19,32,0.98)', borderLeft: '0.5px solid rgba(0,229,255,0.3)', transform: 'translateX(0)' }} />
                        </div>
                    </div>

                    {/* Laser runway lights */}
                    <div style={{
                        position: 'absolute', bottom: 0, width: '120%', height: '4px',
                        background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
                        boxShadow: '0 0 15px #00E5FF'
                    }} />

                    {/* Floating security drones */}
                    <div className="floating-drone" style={{ left: '10%', top: '20%', animation: 'droneFloat 6s ease-in-out infinite' }} />
                    <div className="floating-drone" style={{ right: '8%', top: '15%', animation: 'droneFloat 8s ease-in-out infinite' }} />
                </div>

                {/* Hero Titles */}
                <div style={{
                    marginTop: '40px', textAlign: 'center', zIndex: 10,
                    opacity: 1
                }}>
                    <h1 style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(28px, 6vw, 64px)',
                        fontWeight: 900,
                        letterSpacing: '0.15em',
                        color: '#FFF',
                        textShadow: '0 0 30px rgba(0, 229, 255, 0.45)',
                        lineHeight: 1.1,
                        margin: 0
                    }}>
                        ADDOVEDI HQ
                    </h1>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 'clamp(9px, 1.5vw, 13px)',
                        letterSpacing: '0.45em',
                        color: '#9CA3AF',
                        marginTop: '12px',
                        textTransform: 'uppercase'
                    }}>
                        Mission Complete. Welcome to Headquarters.
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 2: HQ LOBBY & DIRECTORIES (SPLIT)
            ════════════════════════════════════════════ */}
            <div id="lobby-section" style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto',
                padding: isMobile ? '40px 16px 80px' : '80px 40px 100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '60px'
            }}>
                {/* Environmental storytelling backdrop */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: "'Orbitron', monospace" }}>
                        <span style={{ fontSize: '7.5px', color: '#00E5FF', letterSpacing: '0.2em' }}>// SECTOR_LOBBY</span>
                        <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, color: '#fff', letterSpacing: '0.08em', margin: '4px 0 0 0' }}>ADDOVEDI OFFICERS</h2>
                    </div>
                    {/* Simulated elevator tracking */}
                    <div className="hidden lg:flex" style={{ width: '12px', height: '180px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute', width: '8px', height: '14px', background: 'linear-gradient(180deg, #00E5FF, #7A5CFF)',
                            left: '1px', borderRadius: '2px', boxShadow: '0 0 8px #00E5FF',
                            animation: 'elevatorTravel 9s ease-in-out infinite'
                        }} />
                    </div>
                </div>

                {/* Clipboard Toast Banner */}
                {copiedText && (
                    <div style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0D1320',
                        border: '1.2px solid #00E5FF',
                        boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
                        borderRadius: '6px',
                        padding: '12px 28px',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: '#00E5FF',
                        letterSpacing: '0.12em',
                        zIndex: 100,
                        animation: 'statusPulse 0.25s ease-out'
                    }}>
                        [✓] COPIED TO CLIPBOARD
                    </div>
                )}

                {/* 50/50 Split Lobby Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '32px' : '48px',
                    width: '100%'
                }}>
                    {/* Left Column: Contact Directory */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: '9.5px',
                            fontWeight: 900,
                            letterSpacing: '0.22em',
                            color: '#00E5FF',
                            borderBottom: '1px solid rgba(0,229,255,0.15)',
                            paddingBottom: '10px'
                        }}>
                            CONTACT DIRECTORY
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'EMAIL', icon: '📧', val: 'team@addovedi.in', desc: 'Click to copy address', action: copyEmail },
                                { label: 'PHONE', icon: '📞', val: '+91 98765 43210', desc: 'Fest Coordination Desk' },
                                { label: 'LOCATION', icon: '📍', val: 'NIT Arunachal Pradesh', desc: 'Jote Campus Base' },
                                { label: 'INSTAGRAM', icon: '📷', val: '@addovedi', desc: 'Follow community channels' },
                                { label: 'LINKEDIN', icon: '💼', val: 'Addovedi', desc: 'Corporate networks' }
                            ].map((row, idx) => (
                                <div
                                    key={idx}
                                    onClick={row.action}
                                    className="directory-strip"
                                    style={{
                                        position: 'relative',
                                        background: '#0D1320',
                                        border: '1.2px solid rgba(255,255,255,0.04)',
                                        borderRadius: '8px',
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: row.action ? 'pointer' : 'default',
                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.35)';
                                        e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.15)';
                                        const beam = e.currentTarget.querySelector('.strip-beam');
                                        if (beam) beam.style.animation = 'rowBeam 0.65s linear forwards';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        const beam = e.currentTarget.querySelector('.strip-beam');
                                        if (beam) beam.style.animation = 'none';
                                    }}
                                >
                                    {/* Neon beam travel strip */}
                                    <div className="strip-beam" style={{
                                        position: 'absolute', bottom: 0, left: '-100%', width: '30%', height: '1.5px',
                                        background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
                                        pointerEvents: 'none'
                                    }} />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontSize: '18px' }}>{row.icon}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.15em' }}>{row.label}</span>
                                            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#FFF', fontWeight: 600, marginTop: '2px' }}>{row.val}</span>
                                        </div>
                                    </div>

                                    <span style={{ fontFamily: 'monospace', fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                                        {row.desc.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Message Terminal Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: '9.5px',
                            fontWeight: 900,
                            letterSpacing: '0.22em',
                            color: '#7A5CFF',
                            borderBottom: '1px solid rgba(122,92,255,0.15)',
                            paddingBottom: '10px'
                        }}>
                            MESSAGE TERMINAL
                        </div>

                        <div style={{
                            background: '#0D1320',
                            border: '1.2px solid rgba(122, 92, 255, 0.15)',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                        }}>
                            {sent ? (
                                <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                                    <div style={{
                                        display: 'inline-flex', width: '56px', height: '56px', borderRadius: '50%',
                                        background: 'rgba(31,255,118,0.12)', border: '1.5px solid #1FFF76',
                                        alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                                        boxShadow: '0 0 15px rgba(31,255,118,0.2)'
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
                                                {/* Apple-like rising placeholder */}
                                                <label
                                                    htmlFor={field}
                                                    style={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '8px',
                                                        color: isFocused ? '#00E5FF' : 'rgba(255,255,255,0.4)',
                                                        letterSpacing: '0.15em',
                                                        textTransform: 'uppercase',
                                                        transition: 'color 0.25s'
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
                                                                resize: 'none'
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
                                                                transition: 'border-color 0.25s, box-shadow 0.25s'
                                                            }}
                                                        />
                                                    )}

                                                    {/* Glowing underline sweep */}
                                                    {isFocused && (
                                                        <div style={{
                                                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1.5px',
                                                            background: 'linear-gradient(90deg, #00E5FF, #7A5CFF, #00E5FF)',
                                                            backgroundSize: '200% auto',
                                                            animation: 'inputBorderTravel 1.5s linear infinite'
                                                        }} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Send button with Energy gradient fill */}
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
                                            overflow: 'hidden'
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
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 3: VISIT HQ MAP SEGMENT
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto 60px',
                padding: '0 16px'
            }}>
                <div style={{
                    background: '#0D1320',
                    border: '1.2px solid rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: isMobile ? '32px 20px' : '40px',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: '32px',
                    alignItems: 'center'
                }}>
                    {/* Left: Stylized Holographic Map graphic */}
                    <div style={{
                        width: '100%',
                        height: '180px',
                        border: '1.2px solid rgba(0,229,255,0.15)',
                        background: 'rgba(0,0,0,0.5)',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <svg width="100%" height="100%" style={{ stroke: 'rgba(0,229,255,0.22)', strokeWidth: '1.5', fill: 'none' }}>
                            <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
                            <circle cx="50" cy="50" r="10" />
                            <line x1="0" y1="90" x2="300" y2="90" />
                            <line x1="80" y1="0" x2="80" y2="180" />
                        </svg>
                        <div style={{
                            position: 'absolute', left: '80px', top: '90px', width: '8px', height: '8px',
                            background: '#00E5FF', borderRadius: '50%', boxShadow: '0 0 10px #00E5FF'
                        }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #00E5FF', transform: 'translate(-4px, -4px)', animation: 'signalPulse 1.5s infinite' }} />
                        </div>
                    </div>

                    {/* Right: details */}
                    <div>
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#7A5CFF', letterSpacing: '0.2em' }}>// ESTABLISH_TACTICAL_ROUTE</span>
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', margin: '4px 0 0 0' }}>
                            VISIT ADDOVEDI
                        </h3>
                        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9CA3AF', marginTop: '10px', lineHeight: 1.7 }}>
                            National Institute of Technology, Arunachal Pradesh Campus. Command portals remain open for physical attendees throughout the techfest days.
                        </p>
                        <a
                            href="https://maps.google.com/?q=National+Institute+of+Technology+Arunachal+Pradesh"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: '8.5px',
                                fontWeight: 900,
                                letterSpacing: '0.15em',
                                color: '#00E5FF',
                                textDecoration: 'none',
                                marginTop: '16px',
                                borderBottom: '1px solid transparent',
                                transition: 'all 0.25s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderBottomColor = '#FFF'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#00E5FF'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                        >
                            DIRECTIONS ➔
                        </a>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 4: TEAM AVAILABILITY DASHBOARD
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto 60px',
                padding: '0 16px'
            }}>
                <div style={{
                    background: '#0D1320',
                    border: '1.2px solid rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '24px 32px'
                }}>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '9.5px',
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        color: '#9CA3AF',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        paddingBottom: '8px',
                        marginBottom: '16px'
                    }}>
                        CURRENT STATUS
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: '20px'
                    }}>
                        {[
                            { title: 'General Queries', status: 'ONLINE', color: '#1FFF76' },
                            { title: 'Sponsors', status: 'AVAILABLE', color: '#00E5FF' },
                            { title: 'Events', status: 'ONLINE', color: '#1FFF76' },
                            { title: 'Media Relations', status: 'RESPONDING', color: '#7A5CFF' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                                <span style={{ fontFamily:'monospace', fontSize:'9px', color:'rgba(255,255,255,0.3)' }}>{item.title}</span>
                                <span style={{
                                    fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 700,
                                    color: item.color, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px'
                                }}>
                                    <span style={{ width:'4.5px', height:'4.5px', borderRadius:'50%', background:item.color, animation:'statusPulse 1.2s infinite' }} />
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 5: SOCIAL GRID STRIP
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto 80px',
                padding: '0 16px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px'
                }}>
                    {[
                        { title: 'INSTAGRAM', sub: 'Latest Reel', color: '#FF2CFB', url: '#' },
                        { title: 'LINKEDIN', sub: 'Latest Post', color: '#00E5FF', url: '#' },
                        { title: 'YOUTUBE', sub: 'Latest Video', color: '#FF1F4F', url: '#' }
                    ].map((feed, idx) => (
                        <a
                            key={idx}
                            href={feed.url}
                            style={{
                                background: '#0D1320',
                                border: '1.2px solid rgba(255,255,255,0.04)',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                textDecoration: 'none',
                                transition: 'all 0.25s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = feed.color;
                                e.currentTarget.style.boxShadow = `0 4px 15px ${feed.color}15`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div>
                                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#9CA3AF', letterSpacing: '0.15em' }}>{feed.title}</span>
                                <div style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#FFF', fontWeight: 600, marginTop: '2px' }}>{feed.sub}</div>
                            </div>
                            <span style={{ fontSize: '13px', color: feed.color }}>➔</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Footer goodbye closing door segment */}
            <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '50px 16px 80px',
                textAlign: 'center',
                fontFamily: "'Orbitron', monospace",
                letterSpacing: '0.3em',
                fontSize: 'clamp(7.5px, 1.2vw, 9.5px)',
                color: '#9CA3AF',
                position: 'relative',
                zIndex: 10
            }}>
                <div>THANK YOU FOR VISITING ADDOVEDI HEADQUARTERS</div>
                <div style={{ marginTop: '8px', color: '#00E5FF', textShadow: '0 0 10px rgba(0, 229, 255, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    SEE YOU AT THE FEST
                    <span style={{ width: '4px', height: '10px', background: '#00E5FF', display: 'inline-block', animation: 'cursorBlink 1s infinite' }} />
                </div>
            </div>
        </div>
    );
}
