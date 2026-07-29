import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { EVENT_RULES, GENERAL_RULES, slugify, EVENT_COORDINATORS } from '../../data/events';
import RegistrationForm from './RegistrationForm';

function EventDetailsModal({
    activeEvent,
    activeCategory,
    onClose,
    teamName,
    setTeamName,
    leaderName,
    setLeaderName,
    leaderUID,
    setLeaderUID,
    leaderPhone,
    setLeaderPhone,
    teamSize,
    setTeamSize,
    members,
    setMembers,
    handleRegisterSubmit,
    isRegistered
}) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('register'); // Default to register
    const isMobileModal = window.innerWidth < 768;

    const btnThemeStyles = {
        '--btn-color-light': activeEvent?.color ? '#ffffff' : '#67e8f9',
        '--btn-color-mid': activeEvent?.color ? activeEvent.color : '#06b6d4',
        '--btn-color-dark': activeEvent?.color ? `${activeEvent.color}cc` : '#0891b2',
        '--btn-color-glow': activeEvent?.color ? activeEvent.color : '#00D9FF',
        '--glow-color-35': activeEvent?.color ? `${activeEvent.color}59` : 'rgba(0,217,255,0.35)',
        '--glow-color-15': activeEvent?.color ? `${activeEvent.color}26` : 'rgba(0,217,255,0.15)',
    };

    useEffect(() => {
        if (location.state?.initialTab) {
            setActiveTab(location.state.initialTab);
        } else {
            setActiveTab('register');
        }
    }, [location.state, activeEvent]);

    const TAB_STYLE = (tab) => ({
        color: activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.35)',
        borderBottom: activeTab === tab ? `2px solid ${activeEvent.color}` : '2px solid transparent',
        background: activeTab === tab ? `${activeEvent.color}18` : 'transparent',
        padding: isMobileModal ? '6px 2px' : '8px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: isMobileModal ? '8px' : '10px',
        textTransform: 'uppercase',
        letterSpacing: isMobileModal ? '0.04em' : '0.15em',
        fontWeight: 900,
        border: 'none',
        outline: 'none',
        whiteSpace: 'nowrap',
        boxShadow: activeTab === tab ? `0 0 12px ${activeEvent.color}30` : 'none',
        flex: isMobileModal ? 1 : 'none',
        textAlign: 'center',
    });



    const handleDownloadPDF = () => {
        const rules = EVENT_RULES[slugify(activeEvent.title)] || GENERAL_RULES;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Popup blocked! Please allow popups to download rules PDF.');
            return;
        }
        printWindow.document.write(`
            <html>
            <head>
                <title>${activeEvent.title} Rules Protocol</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;700&display=swap');
                    body {
                        background-color: #02050c;
                        color: #f3f4f6;
                        font-family: 'Rajdhani', sans-serif;
                        padding: 40px;
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        border: 2px solid ${activeEvent.color || '#00d9ff'};
                        padding: 35px;
                        position: relative;
                        background-color: #02050c;
                        box-shadow: 0 0 30px ${activeEvent.color || '#00d9ff'}15;
                    }
                    h1 {
                        font-family: 'Orbitron', sans-serif;
                        color: ${activeEvent.color || '#00d9ff'};
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        margin-top: 0;
                        border-bottom: 2px solid ${(activeEvent.color || '#00d9ff')}40;
                        padding-bottom: 15px;
                        font-size: 26px;
                    }
                    .meta {
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        color: rgba(255,255,255,0.6);
                        margin: 15px 0 30px;
                        font-family: monospace;
                        text-transform: uppercase;
                    }
                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    li {
                        margin-bottom: 12px;
                        padding: 12px 18px;
                        background: rgba(255,255,255,0.02);
                        border-left: 3px solid ${activeEvent.color || '#00d9ff'};
                        font-size: 15px;
                        line-height: 1.6;
                        display: flex;
                        gap: 12px;
                    }
                    .index {
                        color: ${activeEvent.color || '#00d9ff'};
                        font-weight: 700;
                        font-family: monospace;
                        flex-shrink: 0;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: rgba(255,255,255,0.3);
                        font-family: monospace;
                        border-top: 1px solid rgba(255,255,255,0.05);
                        padding-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${activeEvent.title}</h1>
                    <div class="meta">
                        <div>XP BOUNTY: ${activeEvent.xp || 'N/A'}</div>
                        <div>DIFFICULTY: ${activeEvent.difficulty || 'N/A'}</div>
                        <div>STATUS: REGISTRATION OPEN</div>
                    </div>
                    <ul>
                        ${rules.map((rule, idx) => `
                            <li>
                                <span class="index">[${String(idx + 1).padStart(2, '0')}]</span>
                                <span>${rule}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="footer">
                        ADDOVEDI 2026 // SYSTEM SECURE RULES TRANSMISSION
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 300);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const coordinators = (activeEvent.heads && activeEvent.heads.length > 0)
        ? activeEvent.heads
        : (EVENT_COORDINATORS[activeEvent.title?.toUpperCase()] || []);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes blink-cyber {
                    0%, 100% { opacity: 0.35; }
                    50% { opacity: 1; text-shadow: 0 0 8px ${activeEvent.color}; }
                }
                .cyber-rules-scrollbar::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                    display: none;
                }
                .cyber-rules-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-none::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            ` }} />
            <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: isMobileModal ? '16px' : '24px', fontFamily: "'Rajdhani', sans-serif", height: '100%', maxHeight: '100%', overflowY: 'hidden', overflowX: 'hidden' }} className="scrollbar-none">
                {/* Left Panel / Top Panel on Mobile */}
                <div style={{
                    width: isMobileModal ? '100%' : '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobileModal ? '10px' : '20px',
                    borderRight: isMobileModal ? 'none' : `1px solid ${activeEvent.color}30`,
                    borderBottom: isMobileModal ? `1px solid ${activeEvent.color}20` : 'none',
                    paddingRight: isMobileModal ? '0' : '24px',
                    paddingBottom: isMobileModal ? '12px' : '0',
                    height: isMobileModal ? 'auto' : '100%',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    <div>
                        <div style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', color: activeEvent.color, fontWeight: 900, marginBottom: '4px' }}>
                            {'// MISSION_DATA › SECTOR_'}{activeEvent.categoryTitle?.toUpperCase().replace(/\s/g, '_')}
                        </div>
                        <h2 style={{ fontSize: isMobileModal ? '18px' : '26px', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: 0, textShadow: `0 0 15px ${activeEvent.color}50`, lineHeight: 1.1 }}>
                            {activeEvent.title}
                        </h2>
                        <p style={{ fontSize: isMobileModal ? '11px' : '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: '6px' }}>
                            {activeEvent.desc}
                        </p>

                        {/* Event Heads Contact - Inline on Mobile */}
                        {isMobileModal && (
                            <div style={{ marginTop: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '8px', flexWrap: 'wrap', fontFamily: "'Rajdhani', sans-serif", borderTop: `1px solid ${activeEvent.color}15`, paddingTop: '6px' }}>
                                <span style={{ color: activeEvent.color, fontWeight: 900 }}>[ COMMS ]:</span>
                                {coordinators.map((c, i) => (
                                    <span key={i} style={{ color: 'rgba(255,255,255,0.75)' }}>{c.name}: <span style={{ color: activeEvent.color, fontWeight: 700 }}>{c.phone}</span></span>
                                ))}
                            </div>
                        )}

                        {/* Event Heads Contact - Desktop Only */}
                        {!isMobileModal && (
                            <div style={{ marginTop: '16px', borderTop: `1px solid ${activeEvent.color}20`, paddingTop: '12px' }}>
                                <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', color: activeEvent.color, fontWeight: 900, marginBottom: '6px' }}>
                                    {'// DIRECT_COMMS'}
                                </div>
                                {coordinators.map((c, i) => (
                                    <div key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontFamily: "'Rajdhani', sans-serif" }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{c.name}</span>
                                            <span style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", color: activeEvent.color, marginLeft: '6px', opacity: 0.8, letterSpacing: '0.05em' }}>({i === 0 ? 'HEAD' : 'COORD'})</span>
                                        </div>
                                        <span style={{ color: activeEvent.color, fontWeight: 700 }}>{c.phone}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats Grid — 2x2 grid on mobile with tiny size & padding, vertical stacked column on desktop */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobileModal ? '1fr 1fr' : '1fr',
                        gap: isMobileModal ? '3px' : '6px',
                        marginTop: isMobileModal ? '4px' : 'auto'
                    }}>
                        <div style={{ background: `${activeEvent.color}10`, border: `1px solid ${activeEvent.color}30`, padding: isMobileModal ? '2px 6px' : '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: isMobileModal ? '7px' : '8px', fontFamily: "'Orbitron', sans-serif", color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ FEE ]</span>
                            <span style={{ fontSize: isMobileModal ? '9px' : '13px', fontFamily: "'Orbitron', sans-serif", color: activeEvent.color, fontWeight: 900 }}>FREE</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: isMobileModal ? '2px 6px' : '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: isMobileModal ? '7px' : '8px', fontFamily: "'Orbitron', sans-serif", color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ BOUNTY ]</span>
                            <span style={{ fontSize: isMobileModal ? '9px' : '13px', fontFamily: "'Orbitron', sans-serif", color: '#fff', fontWeight: 900 }}>{activeEvent.xp}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: isMobileModal ? '2px 6px' : '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: isMobileModal ? '7px' : '8px', fontFamily: "'Orbitron', sans-serif", color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ DIFFICULTY ]</span>
                            <span style={{ fontSize: isMobileModal ? '9px' : '13px', fontFamily: "'Orbitron', sans-serif", color: '#ff1f4f', fontWeight: 900 }}>{activeEvent.difficulty}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: isMobileModal ? '2px 6px' : '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: isMobileModal ? '7px' : '8px', fontFamily: "'Orbitron', sans-serif", color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ STATUS ]</span>
                            <span style={{ fontSize: isMobileModal ? '9px' : '13px', fontFamily: "'Orbitron', sans-serif", color: '#28c840', fontWeight: 900 }}>OPEN</span>
                        </div>
                    </div>

                    {/* ABORT button — hidden on mobile */}
                    {!isMobileModal && (
                        <button
                            onClick={onClose}
                            style={{
                                marginTop: '10px',
                                background: 'transparent',
                                border: '1px solid #ff1f4f50',
                                color: '#ff1f4f',
                                padding: '12px',
                                fontSize: '10px',
                                fontFamily: "'Orbitron', sans-serif",
                                letterSpacing: '0.25em',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#ff1f4f15'; e.currentTarget.style.boxShadow = '0 0 15px #ff1f4f30'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            ABORT_MISSION
                        </button>
                    )}
                </div>

                {/* Right Panel - Segments (Scrollable tab pages) */}
                <div style={{
                    width: isMobileModal ? '100%' : '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '0',
                    scrollBehavior: 'smooth'
                }} className="cyber-rules-scrollbar">

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${activeEvent.color}20`, paddingBottom: '10px', marginBottom: '14px', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: activeEvent.color, flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57', boxShadow: '0 0 6px #ff5f57' }} />
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 6px #febc2e' }} />
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#28c840', boxShadow: '0 0 6px #28c840' }} />
                            <span style={{ marginLeft: '8px', opacity: 0.7, fontSize: isMobileModal ? '7px' : '9px' }}>ADDOVEDI_OS // TERMINAL</span>
                        </div>
                        {!isMobileModal && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900 }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28c840', boxShadow: '0 0 8px #28c840', display: 'inline-block' }} />
                                SECURE_COMM_ESTABLISHED
                            </div>
                        )}
                    </div>
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: isMobileModal ? '14px' : '22px', width: '100%', flexShrink: 0 }} className="scrollbar-none">
                        <button style={TAB_STYLE('register')} onClick={() => setActiveTab('register')}>⬡ Register</button>
                        <button style={TAB_STYLE('overview')} onClick={() => setActiveTab('overview')}>◈ Overview</button>
                        <button style={TAB_STYLE('rules')} onClick={() => setActiveTab('rules')}>⊞ Rules</button>
                        <button style={TAB_STYLE('coords')} onClick={() => setActiveTab('coords')}>⊕ Coords</button>
                    </div>

                    {/* ── Tab: Overview ── */}
                    {activeTab === 'overview' && (
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', scrollBehavior: 'smooth', display: 'flex', flexDirection: 'column', gap: isMobileModal ? '12px' : '20px', fontFamily: "'Rajdhani', sans-serif" }} className="cyber-rules-scrollbar">
                            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${activeEvent.color}20`, padding: isMobileModal ? '14px' : '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: isMobileModal ? '11px' : '13px' }}>
                                <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: activeEvent.color, marginBottom: '8px' }}>// ESTIMATED TIMELINE</div>
                                {['10:00 AM — PRE-FLIGHT CHECKS', '12:30 PM — MAIN ENGAGEMENT', '04:30 PM — EVALUATION'].map((t, i) => (
                                    <div key={i} style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '10px', fontSize: isMobileModal ? '11px' : '13px', lineHeight: 1.6 }}>
                                        <span style={{ color: activeEvent.color }}>{'>'}</span>{t}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '10px', fontSize: '10px' }}>
                                {[['DIVISION', activeEvent.categoryTitle, '#fff'], ['XP BOUNTY', activeEvent.xp, activeEvent.color], ['DIFFICULTY', activeEvent.difficulty, '#ff1f4f']].map(([k, v, c]) => (
                                    <div key={k} style={{ flex: 1, padding: isMobileModal ? '12px' : '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: isMobileModal ? 'row' : 'column', justifycontent: isMobileModal ? 'space-between' : 'flex-start', alignItems: isMobileModal ? 'center' : 'flex-start', gap: '8px' }}>
                                        <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', letterSpacing: '0.15em' }}>{k}</div>
                                        <div style={{ color: c, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: isMobileModal ? '12px' : '14px' }}>{v}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Tab: Rules Directives ── */}
                    {activeTab === 'rules' && (
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', scrollBehavior: 'smooth', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Rajdhani', sans-serif" }} className="cyber-rules-scrollbar">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: `1px solid ${activeEvent.color}20`, paddingBottom: '8px' }}>
                                <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: activeEvent.color }}>⊞ DIRECTIVE CODES — MISSION CONSTRAINTS</div>
                                <button
                                    onClick={handleDownloadPDF}
                                    style={{
                                        background: `linear-gradient(135deg, ${activeEvent.color}d0 0%, ${activeEvent.color}90 100%)`,
                                        color: '#000000',
                                        border: 'none',
                                        padding: '5px 10px',
                                        fontSize: '8px',
                                        fontWeight: 900,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                                        boxShadow: `0 0 10px ${activeEvent.color}25`,
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#ffffff';
                                        e.currentTarget.style.boxShadow = '0 0 12px #ffffff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${activeEvent.color}d0 0%, ${activeEvent.color}90 100%)`;
                                        e.currentTarget.style.boxShadow = `0 0 10px ${activeEvent.color}25`;
                                    }}
                                >
                                    DOWNLOAD RULES PDF ⭳
                                </button>
                            </div>
                            <div style={{ overflowY: 'visible', maxHeight: 'none', paddingRight: '8px' }}>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
                                    {(EVENT_RULES[slugify(activeEvent.title)] || GENERAL_RULES).map((rule, idx) => (
                                        <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: isMobileModal ? '12px' : '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, padding: isMobileModal ? '10px 12px' : '12px 16px', background: 'rgba(0,0,0,0.3)', borderLeft: `2px solid ${activeEvent.color}40` }}>
                                            <span style={{ color: activeEvent.color, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, flexShrink: 0 }}>[{String(idx + 1).padStart(2, '0')}]</span>
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div style={{ padding: isMobileModal ? '10px 12px' : '12px 16px', background: 'rgba(255,31,79,0.05)', border: '1px solid rgba(255,31,79,0.15)', color: 'rgba(255,31,79,0.7)', fontSize: isMobileModal ? '11px' : '12px', letterSpacing: '0.05em' }}>
                                ⚠ All participants must strictly adhere to these directives. Violations result in immediate disqualification.
                            </div>
                        </div>
                    )}

                    {/* ── Tab: Register Quest ── */}
                    {activeTab === 'register' && (
                        <RegistrationForm
                            activeEvent={activeEvent}
                            activeCategory={activeCategory}
                            onClose={onClose}
                            teamName={teamName}
                            setTeamName={setTeamName}
                            leaderName={leaderName}
                            setLeaderName={setLeaderName}
                            leaderUID={leaderUID}
                            setLeaderUID={setLeaderUID}
                            leaderPhone={leaderPhone}
                            setLeaderPhone={setLeaderPhone}
                            teamSize={teamSize}
                            setTeamSize={setTeamSize}
                            members={members}
                            setMembers={setMembers}
                            handleRegisterSubmit={handleRegisterSubmit}
                            isRegistered={isRegistered}
                            isMobileModal={isMobileModal}
                            btnThemeStyles={btnThemeStyles}
                        />
                    )}



                    {/* ── Tab: Coordinators ── */}
                    {activeTab === 'coords' && (
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', scrollBehavior: 'smooth', display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Rajdhani', sans-serif" }} className="cyber-rules-scrollbar">
                            <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: activeEvent.color }}>⊕ SECURITY TELEMETRY OFFICERS</div>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobileModal ? '1fr' : '1fr 1fr', gap: '12px' }}>
                                {coordinators.map((c, idx) => (
                                    <div key={idx} style={{ border: `1px solid ${activeEvent.color}20`, background: 'rgba(0,0,0,0.5)', padding: isMobileModal ? '14px' : '20px', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: `3px solid ${activeEvent.color}60` }}>
                                        <div style={{ fontWeight: 900, color: '#ffffff', fontSize: isMobileModal ? '12px' : '14px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>{c.name}</div>
                                        <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: activeEvent.color, marginBottom: '6px' }}>{c.role || (idx === 0 ? 'EVENT HEAD' : 'EVENT COORDINATOR')}</div>
                                        <div style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.5)' }}>✉  {c.email || `${c.name.toLowerCase().replace(/[^a-z]/g, '')}@addovedi.org`}</div>
                                        <div style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.5)' }}>☏  {c.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default function EventModal({
    activeEvent,
    activeCategory,
    handleCloseModal,
    teamName,
    setTeamName,
    leaderName,
    setLeaderName,
    leaderUID,
    setLeaderUID,
    leaderPhone,
    setLeaderPhone,
    teamSize,
    setTeamSize,
    members,
    setMembers,
    handleRegisterSubmit,
    isRegistered
}) {
    return (
        <AnimatePresence>
            {activeEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseModal}
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-2 md:p-4 pointer-events-auto overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-6xl bg-[#020202] text-white p-4 md:p-8 relative shadow-[0_0_60px_rgba(0,0,0,0.95)] rounded-none h-[580px] md:h-[620px] max-h-[92vh] md:max-h-[85vh] overflow-hidden border border-white/10 md:border-0"
                        style={{
                            clipPath: window.innerWidth >= 768 ? 'polygon(2.2% 0, 97.8% 0, 100% 2.2%, 100% 97.8%, 97.8% 100%, 2.2% 100%, 0 97.8%, 0 2.2%)' : 'none',
                            boxShadow: `0 0 55px ${activeEvent.color}25`,
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%)',
                            backgroundSize: '100% 4px'
                        }}
                    >
                        {/* Glowing SVG outline matching chamfered clipPath */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polygon
                                points="2.2 0, 97.8 0, 100 2.2, 100 97.8, 97.8 100, 2.2 100, 0 97.8, 0 2.2"
                                fill="none"
                                stroke={activeEvent.color}
                                strokeWidth="0.8"
                                style={{ filter: `drop-shadow(0 0 5px ${activeEvent.color})` }}
                                className="opacity-75"
                            />
                        </svg>

                        <div
                            className="absolute pointer-events-none opacity-20 inset-2 border"
                            style={{ borderColor: activeEvent.color, clipPath: 'polygon(2.2% 0, 97.8% 0, 100% 2.2%, 100% 97.8%, 97.8% 100%, 2.2% 100%, 0 97.8%, 0 2.2%)' }}
                        />
                        <div className="absolute top-0 left-[2.2%] w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full z-20" style={{ backgroundColor: activeEvent.color, boxShadow: `0 0 10px 2px ${activeEvent.color}` }}>
                            <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: activeEvent.color }} />
                        </div>
                        <div className="absolute top-0 right-[2.2%] w-1.5 h-1.5 translate-x-1/2 -translate-y-1/2 rounded-full z-20" style={{ backgroundColor: activeEvent.color, boxShadow: `0 0 10px 2px ${activeEvent.color}` }}>
                            <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: activeEvent.color }} />
                        </div>
                        <div className="absolute bottom-0 left-[2.2%] w-1.5 h-1.5 -translate-x-1/2 translate-y-1/2 rounded-full z-20" style={{ backgroundColor: activeEvent.color, boxShadow: `0 0 10px 2px ${activeEvent.color}` }}>
                            <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: activeEvent.color }} />
                        </div>
                        <div className="absolute bottom-0 right-[2.2%] w-1.5 h-1.5 translate-x-1/2 translate-y-1/2 rounded-full z-20" style={{ backgroundColor: activeEvent.color, boxShadow: `0 0 10px 2px ${activeEvent.color}` }}>
                            <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: activeEvent.color }} />
                        </div>

                        {/* Mobile close button (top-right corner) */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 z-30 md:hidden w-8 h-8 flex items-center justify-center rounded-full border-0 cursor-pointer"
                            aria-label="Close Registration Modal"
                            style={{
                                background: 'rgba(0,0,0,0.8)',
                                border: `1px solid ${activeEvent.color}50`,
                                boxShadow: `0 0 10px ${activeEvent.color}30`,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeEvent.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <EventDetailsModal
                            activeEvent={activeEvent}
                            activeCategory={activeCategory}
                            onClose={handleCloseModal}
                            teamName={teamName}
                            setTeamName={setTeamName}
                            leaderName={leaderName}
                            setLeaderName={setLeaderName}
                            leaderUID={leaderUID}
                            setLeaderUID={setLeaderUID}
                            leaderPhone={leaderPhone}
                            setLeaderPhone={setLeaderPhone}
                            teamSize={teamSize}
                            setTeamSize={setTeamSize}
                            members={members}
                            setMembers={setMembers}
                            handleRegisterSubmit={handleRegisterSubmit}
                            isRegistered={isRegistered}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
