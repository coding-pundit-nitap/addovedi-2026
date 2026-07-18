/**
 * CrewPage.jsx — ADDOVEDI PERSONNEL DATABASE
 *
 * A premium, AAA game character-select screen inspired by modern gaming UIs:
 *  • Hero header (100vh atmosphere) with loading boot and blue energy sweep
 *  • Dual Tabs: Faculty Command (direct cards) & Student Squadron (section headings + cards)
 *  • Stat strip counting up to total members
 *  • Responsive grid (4 cols desktop, 2 cols mobile) of glassmorphic character cards
 *  • Magnetic tilt cursor effect on portraits
 *  • Reveal overlays on hover (desktop) or tap (mobile) showing complete socials & phone/email details
 *  • Slow-moving animated canvas background (opacity 5-10%)
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';

import { FACULTY_CREW, STUDENT_SECTIONS } from '../../data/crew';
import BgCanvas from './BgCanvas';
import CrewCard from './CrewCard';


/* ════════════════════════════════════════════
   STATISTICS COUNT UP STRIP
   ════════════════════════════════════════════ */
function StatStrip({ finalMembers, finalMission }) {
    const [members, setMembers] = useState(0);
    const [mission, setMission] = useState(0);

    useEffect(() => {
        let currentMembers = 0;
        let currentMission = 0;

        const interval = setInterval(() => {
            let done = true;
            if (currentMembers < finalMembers) {
                currentMembers = Math.min(currentMembers + 1, finalMembers);
                setMembers(currentMembers);
                done = false;
            }
            if (currentMission < finalMission) {
                currentMission = Math.min(currentMission + 1, finalMission);
                setMission(currentMission);
                done = false;
            }

            if (done) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [finalMembers, finalMission]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(20px, 8vw, 80px)',
            margin: '24px 0 40px',
            fontFamily: "'Orbitron', monospace",
            letterSpacing: '0.25em',
            padding: '12px 24px',
            borderTop: '1px solid rgba(0, 229, 255, 0.1)',
            borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
            background: 'rgba(0, 229, 255, 0.02)',
            zIndex: 10,
            position: 'relative'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#00E5FF', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}>{members.toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>OPERATIVES</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#1FFF76', textShadow: '0 0 10px rgba(31, 255, 118, 0.5)' }}>{mission.toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>MISSION</div>
            </div>
        </div>
    );
}



/* ════════════════════════════════════════════
   MAIN CREW PAGE
   ════════════════════════════════════════════ */
export default function CrewPage() {
    const [booted, setBooted] = useState(false);
    const [activeTab, setActiveTab] = useState('STUDENT'); // 'FACULTY' | 'STUDENT'
    const [visibleSections, setVisibleSections] = useState(1);
    const [visibleFacultyRows, setVisibleFacultyRows] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Track window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Split Faculty list into rows of 4 (desktop) or 2 (mobile)
    const cols = isMobile ? 2 : 4;
    const facultyRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < FACULTY_CREW.length; i += cols) {
            rows.push(FACULTY_CREW.slice(i, i + cols));
        }
        return rows;
    }, [cols]);

    // Student total operatives count
    const totalStudentCount = useMemo(() => {
        return STUDENT_SECTIONS.reduce((acc, curr) => acc + curr.members.length, 0);
    }, []);

    // Card entry animation for Faculty rows
    useEffect(() => {
        if (!booted || activeTab !== 'FACULTY') return;
        setVisibleFacultyRows(1);
        const interval = setInterval(() => {
            setVisibleFacultyRows(prev => {
                if (prev >= facultyRows.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 220);
        return () => clearInterval(interval);
    }, [facultyRows.length, booted, activeTab]);

    // Card entry animation for Student sections
    useEffect(() => {
        if (!booted || activeTab !== 'STUDENT') return;
        setVisibleSections(1);
        const interval = setInterval(() => {
            setVisibleSections(prev => {
                if (prev >= STUDENT_SECTIONS.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 150); // reveals next section every 150ms
        return () => clearInterval(interval);
    }, [booted, activeTab]);

    const pageRef = useRef(null);

    return (
        <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(0, 229, 255, 0.07) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 44, 251, 0.07) 0%, transparent 50%), #02050c',
            zIndex: 100,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch'
        }}>
            <ScrollIndicator scrollRef={pageRef} />
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes statusPulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
                
                /* Magnetic Float Effect on Character Cards */
                @keyframes cardFloat {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-4px); }
                }

                /* Energy running line animation on active cards */
                .energy-border-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: 12px;
                    padding: 1.2px;
                    background: linear-gradient(90deg, transparent, var(--border-glow-color, #00E5FF), transparent);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    animation: borderTravel 4s linear infinite;
                    background-size: 200% 200%;
                }
                @keyframes borderTravel {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                    100% { background-position: 0% 0%; }
                }

                /* Card vertical scanline sweep */
                .card-scanline {
                    position: absolute;
                    top: -100%; left: 0;
                    width: 100%; height: 10px;
                    background: linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.15), transparent);
                    pointer-events: none;
                    animation: cardScan 5s ease-in-out infinite;
                }
                @keyframes cardScan {
                    0% { top: -10%; }
                    30% { top: 110%; }
                    100% { top: 110%; }
                }

                /* Rotating Rings animations */
                .portrait-bg-glow {
                    position: absolute;
                    width: 90%; height: 90%;
                    border-radius: 50%;
                    filter: blur(8px);
                    z-index: 1;
                }
                .portrait-rotating-ring {
                    position: absolute;
                    width: 92%; height: 92%;
                    border-radius: 50%;
                    animation: coreRing 8s linear infinite;
                    z-index: 1;
                }
                @keyframes coreRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

                /* Glitch Trigger Animation on Hover */
                .glitch-image-trigger:hover {
                    animation: imgGlitch 0.2s steps(2) infinite;
                }
                @keyframes imgGlitch {
                    0% { transform: skewX(-5deg) scale(1.05); filter: hue-rotate(40deg); }
                    50% { transform: skewX(5deg) scale(1.03); filter: hue-rotate(-40deg); }
                    100% { transform: skewX(0deg) scale(1.05); filter: none; }
                }

                /* Staggered Row reveal anim */
                .row-reveal {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: rowIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes rowIn {
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Space Nebulae Orbit Animations */
                @keyframes orbit-slow {
                    0% { transform: translate(0px, 0px) scale(1); }
                    50% { transform: translate(60px, -80px) scale(1.15); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes orbit-reverse {
                    0% { transform: translate(0px, 0px) scale(1.15); }
                    50% { transform: translate(-70px, 60px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1.15); }
                }
            `}} />

            <BgCanvas />

            {/* Glowing background nebula blobs */}
            <div style={{
                position: 'fixed',
                top: '-15%', left: '-15%',
                width: '60vw', height: '60vw',
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
                filter: 'blur(120px)',
                pointerEvents: 'none',
                zIndex: 0,
                animation: 'orbit-slow 25s ease-in-out infinite'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-15%', right: '-15%',
                width: '65vw', height: '65vw',
                background: 'radial-gradient(circle, rgba(255, 44, 251, 0.08) 0%, transparent 70%)',
                filter: 'blur(140px)',
                pointerEvents: 'none',
                zIndex: 0,
                animation: 'orbit-reverse 30s ease-in-out infinite'
            }} />

            {!booted && <CommonLoader onDone={() => setBooted(true)} pageName="Crew" />}

            <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: booted ? 'auto' : 'none' }}>
                {/* Navbar */}
                <div style={{ position:'relative', zIndex:20 }}>
                    <CommonNav />
                </div>

                {/* Main Container */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: isMobile ? '108px 16px 40px' : '128px 40px 60px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Hero Header Section */}
                    <div style={{ textAlign: 'center', marginTop: isMobile ? '10px' : '30px' }}>
                        <div style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: 'clamp(28px, 6.5vw, 68px)',
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                            color: '#FFF',
                            textShadow: '0 0 35px rgba(0, 229, 255, 0.5), 0 0 70px rgba(0, 229, 255, 0.25)',
                            lineHeight: 1,
                            marginBottom: '12px'
                        }}>
                            ADDOVEDI CREW
                        </div>
                        <div style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: 'clamp(8px, 1.5vw, 12px)',
                            letterSpacing: '0.45em',
                            color: 'rgba(0, 229, 255, 0.5)',
                            textTransform: 'uppercase'
                        }}>
                            THE PEOPLE BEHIND THE MISSION
                        </div>
                    </div>

                    {/* Animated Statistics Counter Strip */}
                    <StatStrip 
                        finalMembers={activeTab === 'FACULTY' ? FACULTY_CREW.length : totalStudentCount} 
                        finalMission={1} 
                    />

                    {/* Futuristic Dual Section Tabs Selector */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                        padding: '0 8px'
                    }}>
                        {[
                            { key: 'FACULTY', label: 'FACULTY COMMAND' },
                            { key: 'STUDENT', label: 'STUDENT SQUADRON' }
                        ].map(tab => {
                            const tabColor = '#00E5FF';
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        fontFamily: "'Orbitron', monospace",
                                        fontSize: 'clamp(9px, 1.5vw, 12px)',
                                        letterSpacing: '0.2em',
                                        padding: isMobile ? '10px 16px' : '12px 28px',
                                        borderRadius: '6px',
                                        border: `1.5px solid ${isActive ? tabColor : 'rgba(255, 255, 255, 0.08)'}`,
                                        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                                        background: isActive ? `${tabColor}22` : 'rgba(255, 255, 255, 0.02)',
                                        boxShadow: isActive ? `0 0 15px ${tabColor}40` : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        textTransform: 'uppercase',
                                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(8px - 100%) 100%, 0 100%, 0 8px)'
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderColor = tabColor;
                                            e.currentTarget.style.color = '#fff';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                                        }
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    {activeTab === 'FACULTY' ? (
                        /* Direct Faculty Grid (Centered) */
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: isMobile ? '32px 16px' : '28px',
                            width: '100%'
                        }}>
                            {FACULTY_CREW.map((member) => (
                                <div 
                                    key={member.id}
                                    style={{
                                        width: isMobile ? 'calc(50% - 8px)' : 'calc(25% - 21px)',
                                        minWidth: isMobile ? '140px' : '240px',
                                        maxWidth: '280px'
                                    }}
                                >
                                    <CrewCard
                                        member={member}
                                        isFeatured={false}
                                        isMobile={isMobile}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Section Headings + Centered Cards for Student Squadron */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {STUDENT_SECTIONS.slice(0, visibleSections).map((section) => (
                                <div key={section.title} className="row-reveal" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    {/* Futuristic Cyber Section Header Centered */}
                                    <div style={{
                                        fontFamily: "'Orbitron', monospace",
                                        fontSize: 'clamp(11px, 2vw, 15px)',
                                        fontWeight: 900,
                                        letterSpacing: '0.25em',
                                        color: section.color,
                                        marginTop: '24px',
                                        marginBottom: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px'
                                    }}>
                                        <span style={{ color: `${section.color}40`, fontSize: '10px' }}>&lt;</span>
                                        <span style={{ color: `${section.color}80` }}>{section.title}</span>
                                        <span style={{
                                            fontSize: '8px',
                                            fontWeight: 400,
                                            color: 'rgba(255, 255, 255, 0.35)',
                                            letterSpacing: '0.08em',
                                            fontFamily: 'monospace',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            padding: '2px 6px',
                                            borderRadius: '3px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            Q: {section.members.length}
                                        </span>
                                        <span style={{ color: `${section.color}40`, fontSize: '10px' }}>&gt;</span>
                                    </div>

                                    {/* Cards Grid Centered */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: isMobile ? '32px 16px' : '28px',
                                        width: '100%',
                                        marginBottom: '24px'
                                    }}>
                                        {section.members.map((member) => (
                                            <div 
                                                key={member.id}
                                                style={{
                                                    width: isMobile ? 'calc(50% - 8px)' : 'calc(25% - 21px)',
                                                    minWidth: isMobile ? '140px' : '240px',
                                                    maxWidth: '280px'
                                                }}
                                            >
                                                <CrewCard
                                                    member={member}
                                                    isFeatured={false}
                                                    isMobile={isMobile}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer Segment */}
                    <div style={{
                        marginTop: '36px',
                        borderTop: '1px solid rgba(0, 229, 255, 0.05)',
                        paddingTop: '16px',
                        textAlign: 'center',
                        fontFamily: "'Orbitron', monospace",
                        letterSpacing: '0.25em',
                        fontSize: 'clamp(6.5px, 1.1vw, 8px)',
                        color: 'rgba(0, 229, 255, 0.25)'
                    }}>
                        <div>ALL OPERATIVES DEPLOYED // STATUS NOMINAL</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
