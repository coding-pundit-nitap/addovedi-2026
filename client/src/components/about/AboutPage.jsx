/**
 * AboutPage.jsx — ADDOVEDI HQ, ABOUT, ARCHIVE & FAQ
 *
 * An immersive environmental contact/about portal:
 *  • Hero (100vh): Cinematic camera approach toward a futuristic headquarters facade (Halo/UNSC/Cyberpunk style)
 *  • About Addovedi: festival theme & mission copy
 *  • Past Editions: year-tabbed photo archive (2025 / 2024 / ...)
 *  • FAQ: registration walkthrough accordion
 *  • Query Terminal: message form
 *  • Campus Map, Status Panel, Social Feed (all unchanged from the original Connect Hub, moved to the bottom)
 *  • Footer: Closing doors goodbye sequence with blinking system console cursors
 */

import { useState, useEffect, useRef } from 'react';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';
import MessageTerminal from './MessageTerminal';
import { API_BASE } from '../../constants/api';
import { PAST_EDITIONS } from '../../data/pastEditions';
import { FAQ_ITEMS, QUICK_REGISTRATION_GUIDE } from '../../data/faq';
import addovediLogo from '../../assets/images/addovedi-logo-white.png';

export default function AboutPage() {
    const pageRef = useRef(null);
    const [booted, setBooted] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Past editions tab + FAQ accordion state
    const [activeYear, setActiveYear] = useState(PAST_EDITIONS[0]?.year);
    const [openFaq, setOpenFaq] = useState(0);

    // Sector Availability states
    const [generalQueries, setGeneralQueries] = useState('ONLINE');
    const [sponsors, setSponsors] = useState('AVAILABLE');
    const [events, setEvents] = useState('ONLINE');
    const [media, setMedia] = useState('RESPONDING');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load status settings from backend
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_BASE}/status-settings`);
                if (res.ok) {
                    const data = await res.json();
                    setGeneralQueries(data.generalQueries);
                    setSponsors(data.sponsors);
                    setEvents(data.events);
                    setMedia(data.media);
                }
            } catch (err) {
                console.log('Connect status fetch failed, using fallback static config');
            }
        };
        fetchStatus();
    }, []);

    const activeEdition = PAST_EDITIONS.find(ed => ed.year === activeYear) || PAST_EDITIONS[0];

    return (
        <>
            <CommonLoader onDone={() => setBooted(true)} pageName="About" />
            <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{ position:'fixed', inset:0, background:'#05070D', color:'#F5F7FA', zIndex:100, overflowY:'auto', overflowX:'hidden', opacity: booted ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: booted ? 'auto' : 'none' }}>
            <ScrollIndicator scrollRef={pageRef} />
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
                @keyframes faqChevron { from{transform:rotate(0deg)} to{transform:rotate(180deg)} }

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

                .about-year-tab {
                    font-family: 'Orbitron', monospace;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 0.15em;
                    padding: 10px 22px;
                    border: 1.2px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.02);
                    color: rgba(255,255,255,0.45);
                    cursor: pointer;
                    transition: all 0.25s;
                    border-radius: 6px;
                }
                .about-year-tab:hover { color: #fff; border-color: rgba(0,229,255,0.3); }
                .about-year-tab-active {
                    color: #00E5FF !important;
                    border-color: #00E5FF !important;
                    background: rgba(0,229,255,0.08) !important;
                    box-shadow: 0 0 15px rgba(0,229,255,0.2);
                }

                .about-photo-tile {
                    aspect-ratio: 4/3;
                    border: 1.2px dashed rgba(255,255,255,0.12);
                    background: rgba(255,255,255,0.015);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                }

                .about-marquee-viewport {
                    overflow: hidden;
                    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
                }
                .about-marquee-track {
                    display: flex;
                    gap: 14px;
                    width: max-content;
                    animation: about-marquee-scroll 32s linear infinite;
                }
                .about-marquee-viewport:hover .about-marquee-track {
                    animation-play-state: paused;
                }
                .about-marquee-tile {
                    flex: 0 0 auto;
                    width: 260px;
                    aspect-ratio: 4/3;
                }
                @keyframes about-marquee-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }

                .about-faq-row {
                    border: 1.2px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    overflow: hidden;
                    background: #0D1320;
                    transition: border-color 0.25s;
                }
                .about-faq-row:hover { border-color: rgba(0,229,255,0.2); }
                .about-faq-question {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    padding: 16px 20px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    font-family: 'Orbitron', monospace;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    color: #fff;
                }
            `}} />

            {/* Standalone Nav */}
            <div style={{ position:'relative', zIndex:50 }}>
                <CommonNav />
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
                    <img
                        src={addovediLogo}
                        alt="Addovedi"
                        style={{
                            display: 'block',
                            margin: '0 auto',
                            height: 'clamp(44px, 8vw, 84px)',
                            width: 'auto',
                            filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.45))',
                        }}
                    />
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
               SECTION 2: ABOUT ADDOVEDI
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto 80px',
                padding: '0 16px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#00E5FF', letterSpacing: '0.2em' }}>SECTOR_ABOUT</span>
                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '0.07em', margin: '6px 0 0 0' }}>
                        ABOUT ADDOVEDI
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: '20px',
                }}>
                    {[
                        {
                            tag: 'THE FEST', title: 'WHAT IS ADDOVEDI', color: '#00E5FF',
                            body: "ADDOVEDI is Arunachal Pradesh's biggest technical fest, hosted by the National Institute of Technology, Arunachal Pradesh. Across three days, engineering, design, and competition collide: participants create a player profile, earn their ADDOVEDI ID, and battle across robotics, esports, web design, coding, and more under one unified mission.",
                            pillars: [
                                { label: 'COMPETE', desc: 'Robotics, esports, coding & design events across three days.' },
                                { label: 'BUILD', desc: 'Hands-on challenges for engineers, designers & builders.' },
                                { label: 'CONNECT', desc: 'One campus, one ID, a community that keeps coming back.' },
                            ],
                        },
                        {
                            tag: 'THE THEME', title: 'ENTER THE ARENA', color: '#FF2CFB',
                            body: 'This edition is built around a futuristic "Enter the Arena" theme. The fest reimagines a campus techfest as a living command center, where every event, every stage, and every signal on this site is part of the same arena. You are not just attending, you are stepping in as a player.',
                            pillars: [
                                { label: 'PLAYER', desc: 'Every participant gets a profile and a unique ADDOVEDI ID.' },
                                { label: 'ARENA', desc: 'Events are stages of one connected battleground.' },
                                { label: 'MISSION', desc: 'One shared goal: build, compete, and rise together.' },
                            ],
                        },
                    ].map((card) => (
                        <div key={card.tag} style={{
                            background: '#0D1320',
                            border: `1.2px solid ${card.color}30`,
                            borderRadius: '12px',
                            padding: isMobile ? '24px 18px' : '32px',
                        }}>
                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', color: card.color, letterSpacing: '0.2em' }}>{card.tag}</span>
                            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(16px, 2.4vw, 22px)', fontWeight: 900, color: '#fff', letterSpacing: '0.07em', margin: '6px 0 16px' }}>{card.title}</h3>
                            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#D1D5DB', lineHeight: 1.9, margin: 0 }}>{card.body}</p>
                            <div style={{ display: 'grid', gap: '10px', marginTop: '22px' }}>
                                {card.pillars.map((p) => (
                                    <div key={p.label} style={{ border: `1.2px solid ${card.color}30`, background: `${card.color}08`, borderRadius: '8px', padding: '12px 14px' }}>
                                        <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '10.5px', fontWeight: 900, letterSpacing: '0.15em', color: card.color }}>{p.label}</div>
                                        <p style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#9CA3AF', marginTop: '6px', lineHeight: 1.6, marginBottom: 0 }}>{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 3: PAST EDITIONS ARCHIVE
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                margin: '0 auto 80px',
                padding: '0 16px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#7A5CFF', letterSpacing: '0.2em' }}>SECTOR_ARCHIVE</span>
                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '0.07em', margin: '6px 0 0 0' }}>
                        PAST EDITIONS
                    </h2>
                </div>

                {PAST_EDITIONS.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
                        {PAST_EDITIONS.map(ed => (
                            <button
                                key={ed.year}
                                onClick={() => setActiveYear(ed.year)}
                                className={`about-year-tab${activeYear === ed.year ? ' about-year-tab-active' : ''}`}
                            >
                                {ed.year}
                            </button>
                        ))}
                    </div>
                )}

                {activeEdition && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '12.5px', color: '#fff', fontWeight: 900, letterSpacing: '0.08em' }}>
                                {activeEdition.tagline}
                            </div>
                            {activeEdition.highlight && (
                                <div style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#7A5CFF', letterSpacing: '0.1em', marginTop: '6px' }}>
                                    {activeEdition.highlight}
                                </div>
                            )}
                        </div>
                        <div className="about-marquee-viewport">
                            <div className="about-marquee-track">
                                {[...activeEdition.photos, ...activeEdition.photos].map((photo, idx) => (
                                    <div key={`${photo.id}-${idx}`} className="about-photo-tile about-marquee-tile">
                                        {photo.img ? (
                                            <>
                                                <img src={photo.img} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div style={{
                                                    position: 'absolute', left: 0, right: 0, bottom: 0,
                                                    background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
                                                    padding: '18px 10px 8px',
                                                }}>
                                                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#fff', letterSpacing: '0.08em', fontWeight: 700 }}>
                                                        {photo.caption}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '8.5px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
                                                {photo.caption}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ════════════════════════════════════════════
               SECTION 4: FAQ
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '920px',
                margin: '0 auto 80px',
                padding: '0 16px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#00E5FF', letterSpacing: '0.2em' }}>SECTOR_FAQ</span>
                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, color: '#fff', letterSpacing: '0.07em', margin: '6px 0 0 0' }}>
                        FREQUENTLY ASKED QUESTIONS
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div key={idx} className="about-faq-row">
                                <button
                                    className="about-faq-question"
                                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                                >
                                    <span>{idx + 1}. {item.q}</span>
                                    <span style={{
                                        flexShrink: 0,
                                        color: '#00E5FF',
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.25s',
                                    }}>▾</span>
                                </button>
                                {isOpen && (
                                    <div style={{ padding: '0 20px 18px' }}>
                                        <p style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
                                            {item.a}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Quick registration guide strip */}
                <div style={{
                    marginTop: '32px',
                    border: '1.2px solid rgba(0,229,255,0.15)',
                    background: 'rgba(0,229,255,0.03)',
                    borderRadius: '10px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                }}>
                    {QUICK_REGISTRATION_GUIDE.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '9.5px', fontWeight: 900, letterSpacing: '0.1em', color: '#00E5FF' }}>
                                {step}
                            </span>
                            {idx < QUICK_REGISTRATION_GUIDE.length - 1 && (
                                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>➔</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════════
               SECTION 5: QUERY TERMINAL
            ════════════════════════════════════════════ */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '640px',
                margin: '0 auto 80px',
                padding: '0 16px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#7A5CFF', letterSpacing: '0.2em' }}>SECTOR_QUERY</span>
                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 900, color: '#fff', letterSpacing: '0.07em', margin: '6px 0 0 0' }}>
                        STILL HAVE A QUESTION?
                    </h2>
                </div>
                <MessageTerminal heading="SUBMIT A QUERY" />
            </div>

            {/* ════════════════════════════════════════════
               SECTION 6: VISIT HQ MAP SEGMENT
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
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '7.5px', color: '#7A5CFF', letterSpacing: '0.2em' }}>ESTABLISH_TACTICAL_ROUTE</span>
                        <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', margin: '4px 0 0 0' }}>
                            VISIT ADDOVEDI
                        </h3>
                        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9CA3AF', marginTop: '10px', lineHeight: 1.7 }}>
                            National Institute of Technology, Arunachal Pradesh Campus. Command portals remain open for physical attendees throughout the techfest days.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', fontFamily: 'monospace', fontSize: '11px', color: '#D1D5DB' }}>
                            <div><span style={{ color: '#9CA3AF' }}>General Enquiry:</span> <a href="tel:9506177693" style={{ color: '#D1D5DB', textDecoration: 'none' }}>9506177693</a></div>
                            <div><span style={{ color: '#9CA3AF' }}>Event Coordination:</span> <a href="tel:+919859040208" style={{ color: '#D1D5DB', textDecoration: 'none' }}>+91 98590 40208</a></div>
                            <div><span style={{ color: '#9CA3AF' }}>Email:</span> <a href="mailto:addovedi@nitap.ac.in" style={{ color: '#D1D5DB', textDecoration: 'none' }}>addovedi@nitap.ac.in</a></div>
                        </div>

                        <a
                            href="https://maps.app.goo.gl/fj7xSiyD9mhyo4Jy5"
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
               SECTION 7: TEAM AVAILABILITY DASHBOARD
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
                            { title: 'General Queries', status: generalQueries, color: generalQueries === 'ONLINE' ? '#1FFF76' : '#ff1f4f' },
                            { title: 'Sponsors', status: sponsors, color: sponsors === 'AVAILABLE' ? '#00E5FF' : '#ff1f4f' },
                            { title: 'Events', status: events, color: events === 'ONLINE' ? '#1FFF76' : '#ff1f4f' },
                            { title: 'Media Relations', status: media, color: '#7A5CFF' }
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
               SECTION 8: SOCIAL GRID STRIP
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
                        { title: 'INSTAGRAM', sub: 'Latest Reel', color: '#FF2CFB', url: 'https://www.instagram.com/addovedi/' },
                        { title: 'LINKEDIN', sub: 'Latest Post', color: '#00E5FF', url: 'https://www.linkedin.com/in/addovedi-nitap/' },
                        { title: 'YOUTUBE', sub: 'Latest Video', color: '#FF1F4F', url: 'https://www.youtube.com/@addovedi' }
                    ].map((feed, idx) => (
                        <a
                            key={idx}
                            href={feed.url}
                            target="_blank"
                            rel="noreferrer"
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
                <div style={{ margin: '0 auto 28px', maxWidth: '520px', padding: '10px 16px', border: '1px solid rgba(251, 191, 36, 0.35)', background: 'rgba(251, 191, 36, 0.06)', borderRadius: '6px', color: '#FBBF24', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.08em', lineHeight: 1.6 }}>
                    Note: the website does not work after 10 PM. Please visit us again the next day.
                </div>
                <div>THANK YOU FOR VISITING ADDOVEDI HEADQUARTERS</div>
                <div style={{ marginTop: '8px', color: '#00E5FF', textShadow: '0 0 10px rgba(0, 229, 255, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    SEE YOU AT THE FEST
                    <span style={{ width: '4px', height: '10px', background: '#00E5FF', display: 'inline-block', animation: 'cursorBlink 1s infinite' }} />
                </div>
            </div>
            </div>
        </>
    );
}
