/**
 * AlliancesPage.jsx — ADDOVEDI ALLIANCE NETWORK (Sponsors)
 *
 * Implements a premium, game-console-inspired alliance network screen:
 *  • Hero section (100vh) featuring a central glowing Addovedi Energy Core Reactor
 *  • Interactive radial layout showing key sponsors (NVIDIA, AMD, etc.) connected to the core
 *  • Interactive energy pulses propagating from core to nodes every 7 seconds
 *  • Laser connection lines drawn from hovered grid cards towards the core (top of page)
 *  • Glassmorphic sponsor cards with hover 3D tilt, details overlay, category chips, and scanline sweeps
 *  • Mobile responsive layouts and interactive custom nodes
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import AlliancesNav from './AlliancesNav';
import { API_BASE } from '../../constants/api';

const SPONSORS_LIST = [
    { id: 'S01', name: 'NVIDIA', category: 'TITLE', sub: 'Technology Partner', logo: 'NV', desc: 'Accelerating AI and real-time graphics pipelines.', support: ['AI Arena', 'Rendering Server', 'GPU Workshops'], url: '#' },
    { id: 'S02', name: 'AMD', category: 'TITLE', sub: 'Hardware Sponsor', logo: 'AMD', desc: 'Powering high-frequency compute processors in coding grids.', support: ['Coding Arena', 'Host Servers', 'Hackathons'], url: '#' },
    { id: 'S03', name: 'ASUS ROG', category: 'GOLD', sub: 'Gaming Partner', logo: 'ROG', desc: 'Equipping gaming arenas with high-refresh display monitors.', support: ['Valorant Tournament', 'Console Arenas', 'Fifa 1v1'], url: '#' },
    { id: 'S04', name: 'MSI', category: 'GOLD', sub: 'Gear Sponsor', logo: 'MSI', desc: 'Sponsoring gaming peripherals and mechanical rigs.', support: ['Esports Showdown', 'Robotics Race', 'Workshop Lab'], url: '#' },
    { id: 'S05', name: 'BOAT', category: 'MEDIA', sub: 'Audio Partner', logo: 'BOAT', desc: 'Providing elite wireless audio gear for stage streams.', support: ['Closing Gala', 'Music Night', 'Cultural Stages'], url: '#' },
    { id: 'S06', name: 'MICROSOFT', category: 'GOLD', sub: 'Cloud Partner', logo: 'MS', desc: 'Providing Azure credits and cloud telemetry nodes.', support: ['Database Sync', 'Web Hosting', 'PR Systems'], url: '#' },
    { id: 'S07', name: 'INTEL', category: 'SILVER', sub: 'Chipset Sponsor', logo: 'INTC', desc: 'Empowering logic design labs and breadboard gates.', support: ['Logic Quest', 'Circuit Debugging', 'Robo Soccer'], url: '#' },
    { id: 'S08', name: 'GIGABYTE', category: 'SILVER', sub: 'Motherboard Partner', logo: 'GIGA', desc: 'Supplying robust mainboards for drone simulation systems.', support: ['Drone Pilot', 'Drone Wars', 'Embedded Rigs'], url: '#' },
    { id: 'S09', name: 'RAZER', category: 'MEDIA', sub: 'Peripherals Partner', logo: 'RAZ', desc: 'Premium mechanical keybeds and tournament audio links.', support: ['Valorant Finals', 'Coding Hackathons'], url: '#' },
    { id: 'S10', name: 'GITHUB', category: 'MEDIA', sub: 'Platform Partner', logo: 'GIT', desc: 'Providing secure code collaboration repositories.', support: ['Web Craft', 'Hackathon Repos', 'Student Developer Packs'], url: '#' },
    { id: 'S11', name: 'RED BULL', category: 'BEVERAGE', sub: 'Energy Sponsor', logo: 'RB', desc: 'Fueling coding sprints and drone pilots during 24h runs.', support: ['Hackathon', 'Drone Wars', 'Robo Wars'], url: '#' },
    { id: 'S12', name: 'SONY', category: 'GOLD', sub: 'Console Sponsor', logo: 'SONY', desc: 'Providing PlayStation 5 stations for soccer showdowns.', support: ['FIFA Pro', 'FIFA 1v1', 'Cultural Stages'], url: '#' },
    { id: 'S13', name: 'CADENCE', category: 'SILVER', sub: 'EDA Software Partner', logo: 'CAD', desc: 'Sponsoring advanced circuit simulator licenses.', support: ['Logic Quest', 'Circuit Final'], url: '#' },
    { id: 'S14', name: 'SOLIDWORKS', category: 'SILVER', sub: 'CAD Software Partner', logo: 'SW', desc: 'Providing mechanical blueprint design licenses.', support: ['CAD Blueprints', 'Robotics Race'], url: '#' },
    { id: 'S15', name: 'DELL', category: 'SILVER', sub: 'Workstation Sponsor', logo: 'DELL', desc: 'Supplying high-performance CAD workstation displays.', support: ['CAD Blueprints', 'AI Showcase'], url: '#' },
    { id: 'S16', name: 'LOGITECH', category: 'SILVER', sub: 'Input Devices Sponsor', logo: 'LOGI', desc: 'Sponsoring keyboards and mice for arena gaming setups.', support: ['Gaming Arena', 'FIFA 1V1'], url: '#' },
    { id: 'S17', name: 'COCA COLA', category: 'BEVERAGE', sub: 'Refreshment Partner', logo: 'KO', desc: 'Official food and beverage zone refreshment sponsor.', support: ['Food Courts', 'Closing Gala'], url: '#' },
    { id: 'S18', name: 'SPOTIFY', category: 'MEDIA', sub: 'Streaming Partner', logo: 'SPOT', desc: 'Curating soundtracks and music telemetry lists.', support: ['Music Night', 'Closing Awards Gala'], url: '#' }
];

const CATEGORY_COLORS = {
    TITLE: '#00E5FF',
    GOLD: '#FFD700',
    SILVER: '#7A5CFF',
    MEDIA: '#FF2CFB',
    BEVERAGE: '#1FFF76'
};

/* ════════════════════════════════════════════
   BACKGROUND CANVAS (At 5-10% Opacity)
════════════════════════════════════════════ */
function BgCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const GRID = 64;
        const stars = Array.from({ length: 70 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.08,
            r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.3 + 0.05
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Faint Grid
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Floating Star Particles
            stars.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = '#00E5FF';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Slow data streams
            if (frame % 80 === 0) {
                ctx.globalAlpha = 0.02;
                ctx.fillStyle = '#00E5FF';
                ctx.font = '8px monospace';
                ctx.fillText('ALLIANCE_LINK_SYNC', Math.random() * W, Math.random() * H);
            }

            frame++;
            requestAnimationFrame(tick);
        };
        const handle = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(handle); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

/* ════════════════════════════════════════════
   STATISTICS COUNT UP STRIP
════════════════════════════════════════════ */
function StatStrip({ finalPartners, finalCategories, finalConnection }) {
    const [partners, setPartners] = useState(0);
    const [categories, setCategories] = useState(0);
    const [connection, setConnection] = useState(0);

    useEffect(() => {
        let currentPartners = 0;
        let currentCategories = 0;
        let currentConnection = 0;

        const interval = setInterval(() => {
            let done = true;
            if (currentPartners < finalPartners) {
                currentPartners = Math.min(currentPartners + 1, finalPartners);
                setPartners(currentPartners);
                done = false;
            }
            if (currentCategories < finalCategories) {
                currentCategories = Math.min(currentCategories + 1, finalCategories);
                setCategories(currentCategories);
                done = false;
            }
            if (currentConnection < finalConnection) {
                currentConnection = Math.min(currentConnection + 4, finalConnection);
                setConnection(currentConnection);
                done = false;
            }

            if (done) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [finalPartners, finalCategories, finalConnection]);

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
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#00E5FF', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}>{partners.toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>ACTIVE PARTNERS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#FF2CFB', textShadow: '0 0 10px rgba(255, 44, 251, 0.5)' }}>{categories.toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>CATEGORIES</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#1FFF76', textShadow: '0 0 10px rgba(31, 255, 118, 0.5)' }}>{connection}%</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>CONNECTION RATE</div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   SPONSOR CARD GRID TILE
════════════════════════════════════════════ */
function SponsorCard({ sponsor, isMobile, onHoverActive }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [laserActive, setLaserActive] = useState(false);
    const [laserStart, setLaserStart] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        
        // Tilt degrees calculations
        const tiltX = (mouseY / (height / 2)) * -5;
        const tiltY = (mouseX / (width / 2)) * 5;
        setTilt({ x: tiltX, y: tiltY });

        // Update Laser Start Point coordinates (top center of hovered card)
        setLaserStart({
            x: rect.left + rect.width / 2,
            y: rect.top
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        setLaserActive(true);
        onHoverActive(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
        setLaserActive(false);
        onHoverActive(false);
    };

    const categoryColor = CATEGORY_COLORS[sponsor.category] || '#00E5FF';
    
    // Slow float parameters
    const floatDelay = useMemo(() => Math.random() * -6, []);
    const floatDuration = useMemo(() => 5 + Math.random() * 2, []);

    return (
        <>
            {/* ── Active Hover Laser Beam drawn towards top of viewport where Core lies ── */}
            {laserActive && !isMobile && (
                <div style={{
                    position: 'fixed',
                    left: laserStart.x,
                    top: 0,
                    width: '1.5px',
                    height: laserStart.y,
                    background: `linear-gradient(180deg, rgba(0, 229, 255, 0.05), ${categoryColor} 80%, #fff 100%)`,
                    boxShadow: `0 0 10px ${categoryColor}, 0 0 20px ${categoryColor}`,
                    zIndex: 9,
                    pointerEvents: 'none',
                    animation: 'laserPulse 0.15s infinite alternate'
                }} />
            )}

            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1.25',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 229, 255, 0.12)',
                    background: isHovered ? 'rgba(5, 11, 22, 0.88)' : 'rgba(5, 11, 22, 0.55)',
                    backdropFilter: isHovered ? 'blur(16px)' : 'blur(8px)',
                    boxShadow: isHovered 
                        ? `0 0 20px ${categoryColor}40, inset 0 0 12px ${categoryColor}15`
                        : '0 4px 20px rgba(0, 0, 0, 0.45)',
                    transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-6px' : '0px'})`,
                    transition: isHovered ? 'transform 0.05s ease-out, box-shadow 0.25s' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    animation: `tileFloat ${floatDuration}s ease-in-out infinite alternate`,
                    animationDelay: `${floatDelay}s`
                }}
            >
                {/* Traveling Border Glow */}
                {isHovered && <div className="tile-border-runner" style={{ '--runner-color': categoryColor }} />}

                {/* Grid card scanline sweep */}
                <div className="tile-scanline" />

                {/* Top header row: Category Tag */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 3 }}>
                    <span style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '8px',
                        letterSpacing: '0.15em',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${categoryColor}60`,
                        color: categoryColor,
                        background: `${categoryColor}10`,
                        textShadow: `0 0 6px ${categoryColor}60`
                    }}>
                        {sponsor.category}
                    </span>
                </div>

                {/* Logo centerpiece */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    zIndex: 3,
                    transition: 'transform 0.2s',
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                }}>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '32px',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        color: '#FFF',
                        textShadow: isHovered ? `0 0 15px ${categoryColor}` : '0 0 8px rgba(255,255,255,0.1)'
                    }}>
                        {sponsor.name}
                    </div>
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        color: isHovered ? categoryColor : 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.15em',
                        marginTop: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {sponsor.sub}
                    </div>
                </div>

                {/* Bottom line indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 3,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '10px'
                }}>
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '8px',
                        color: isHovered ? '#1FFF76' : 'rgba(255,255,255,0.3)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em'
                    }}>
                        <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: isHovered ? '#1FFF76' : 'rgba(255,255,255,0.2)',
                            boxShadow: isHovered ? '0 0 8px #1FFF76' : 'none',
                            animation: isHovered ? 'statusPulse 1s ease-in-out infinite' : 'none'
                        }} />
                        CONNECTED
                    </span>
                    <span style={{
                        fontFamily: 'monospace',
                        fontSize: '8px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.1em'
                    }}>
                        {sponsor.id}
                    </span>
                </div>

                {/* Hover details overlay card (appears in 0.2s) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(3, 8, 16, 0.98)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0%)' : 'translateY(15%)',
                    transition: 'opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 10,
                    pointerEvents: isHovered ? 'auto' : 'none',
                    border: `1.5px solid ${categoryColor}`,
                    borderRadius: '12px'
                }}>
                    <div>
                        <div style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: '8px',
                            letterSpacing: '0.2em',
                            color: categoryColor,
                            borderBottom: `1px solid ${categoryColor}30`,
                            paddingBottom: '4px',
                            marginBottom: '10px'
                        }}>
                            SUPPORTING MISSIONS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {sponsor.support.map((sup, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: categoryColor, fontSize: '8px' }}>⬡</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '9.5px', color: 'rgba(255,255,255,0.7)' }}>{sup}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <a
                        href={sponsor.url}
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                            fontFamily: "'Orbitron', monospace",
                            fontSize: '8px',
                            letterSpacing: '0.2em',
                            padding: '6px 0',
                            borderRadius: '4px',
                            border: `1px solid ${categoryColor}`,
                            color: '#fff',
                            background: `${categoryColor}25`,
                            textDecoration: 'none',
                            textShadow: `0 0 6px ${categoryColor}`
                        }}
                    >
                        VISIT WEBSITE →
                    </a>
                </div>
            </div>
        </>
    );
}

/* ════════════════════════════════════════════
   MAIN ALLIANCES PAGE
════════════════════════════════════════════ */
export default function AlliancesPage() {
    const [booted, setBooted] = useState(false);
    const [radialActive, setRadialActive] = useState(false);
    const [pulseTrigger, setPulseTrigger] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [activeHoverBeam, setActiveHoverBeam] = useState(false);

    const [sponsorsList, setSponsorsList] = useState(SPONSORS_LIST);

    // Sync window size state
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch dynamic alliances from backend on load
    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const res = await fetch(`${API_BASE}/alliances`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const mapped = data.map((item, idx) => ({
                            id: item._id || `S${idx}`,
                            name: item.name,
                            category: item.category,
                            sub: item.sub,
                            logo: item.logo,
                            logoImage: item.logoImage,
                            desc: item.desc,
                            support: item.support,
                            url: item.url
                        }));
                        setSponsorsList(mapped);
                    }
                }
            } catch (err) {
                console.log("Alliance list fetch failed, using offline static fallback.");
            }
        };
        fetchSponsors();
    }, []);

    // Radial layout major sponsors around the core
    const radialSponsors = ['NVIDIA', 'AMD', 'ASUS ROG', 'MSI', 'BOAT', 'MICROSOFT'];
    const radialAngles = [-90, -30, 30, 90, 150, 210]; // degrees clockwise from top
    const radius = isMobile ? 120 : 200;

    // Entry power on sequence
    useEffect(() => {
        const timer1 = setTimeout(() => setBooted(true), 1500);
        const timer2 = setTimeout(() => setRadialActive(true), 2000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // Energy reactor pulse cycle (every 7 seconds)
    useEffect(() => {
        if (!booted) return;
        const interval = setInterval(() => {
            setPulseTrigger(p => p + 1);
        }, 7000);
        return () => clearInterval(interval);
    }, [booted]);

    return (
        <div style={{ position:'fixed', inset:0, background:'#010307', zIndex:100, overflowY:'auto', overflowX:'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes spinRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
                @keyframes statusPulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
                @keyframes corePulse { 0%,100%{transform:scale(1);box-shadow:0 0 40px rgba(0,229,255,0.4), inset 0 0 20px rgba(0,229,255,0.2)} 50%{transform:scale(1.05);box-shadow:0 0 60px rgba(0,229,255,0.6), inset 0 0 35px rgba(0,229,255,0.3)} }
                @keyframes linePulse { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-20} }
                @keyframes nodePulseGlow { 0%,100%{box-shadow:0 0 10px rgba(0,229,255,0.3);border-color:rgba(0,229,255,0.3)} 50%{box-shadow:0 0 20px rgba(0,229,255,0.6);border-color:rgba(0,229,255,0.8)} }
                
                /* Float effect on grid sponsor tiles */
                @keyframes tileFloat {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-4px); }
                }

                /* Energy pulse runner along path line */
                @keyframes pathPulse {
                    0% { stroke-dashoffset: 40; stroke-width: 1.5; stroke: #00E5FF; }
                    50% { stroke: #FF2CFB; }
                    100% { stroke-dashoffset: 0; stroke-width: 2.5; stroke: #00E5FF; }
                }

                /* Traveling Border Runner animation */
                .tile-border-runner {
                    position: absolute;
                    inset: 0;
                    border-radius: 12px;
                    padding: 1.2px;
                    background: linear-gradient(90deg, transparent, var(--runner-color, #00E5FF), transparent);
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

                /* Laser line vertical pulsing */
                @keyframes laserPulse {
                    0% { opacity: 0.65; }
                    100% { opacity: 0.95; }
                }

                /* Sponsor tile scanline sweep */
                .tile-scanline {
                    position: absolute;
                    top: -100%; left: 0;
                    width: 100%; height: 10px;
                    background: linear-gradient(180deg, transparent, rgba(0, 229, 255, 0.12), transparent);
                    pointer-events: none;
                    animation: tileScan 6s ease-in-out infinite;
                }
                @keyframes tileScan {
                    0% { top: -10%; }
                    35% { top: 110%; }
                    100% { top: 110%; }
                }
            `}} />

            <BgCanvas />

            {/* ── Entry Sequence Screen ── */}
            {!booted && (
                <div style={{ position:'fixed', inset:0, zIndex:200, background:'#010307', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                    <div style={{ fontFamily:"'Orbitron', monospace", fontSize:'10px', letterSpacing:'0.45em', color:'rgba(0, 229, 255, 0.6)' }}>
                        ESTABLISHING ALLIANCE LINK
                    </div>
                    {/* Glowing reactor progress circle */}
                    <div style={{ width:'40px', height:'40px', border:'2px dashed rgba(0,229,255,0.2)', borderTop:'2px solid #00E5FF', borderRadius:'50%', animation:'spin 1.5s linear infinite', marginTop:'10px' }} />
                </div>
            )}

            {booted && (
                <>
                    {/* Navigation */}
                    <div style={{ position:'relative', zIndex:20 }}>
                        <AlliancesNav />
                    </div>

                    {/* ── HERO SECTION: REACTOR CORE ── */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {/* Background subtle radial blue fog */}
                        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />

                        {/* Large rotating graphic rings behind core */}
                        <div style={{ position: 'absolute', width: radius * 2 + 100, height: radius * 2 + 100, border: '1px dashed rgba(0,229,255,0.08)', borderRadius: '50%', animation: 'spin 22s linear infinite', zIndex: 2 }} />
                        <div style={{ position: 'absolute', width: radius * 2 + 60, height: radius * 2 + 60, border: '1px solid rgba(0,229,255,0.03)', borderTopColor: 'rgba(0,229,255,0.1)', borderRadius: '50%', animation: 'spinRev 15s linear infinite', zIndex: 2 }} />

                        {/* Connection Lines from central reactor to major nodes */}
                        <svg style={{ position: 'absolute', width: radius * 2 + 160, height: radius * 2 + 160, overflow: 'visible', zIndex: 3, pointerEvents: 'none' }}>
                            {radialSponsors.map((name, i) => {
                                const angleRad = (radialAngles[i] * Math.PI) / 180;
                                const startX = (radius + 80);
                                const startY = (radius + 80);
                                const endX = startX + Math.cos(angleRad) * radius;
                                const endY = startY + Math.sin(angleRad) * radius;
                                return (
                                    <g key={name}>
                                        {/* Main connection line path */}
                                        <line
                                            x1={startX} y1={startY}
                                            x2={endX} y2={endY}
                                            stroke="rgba(0, 229, 255, 0.15)"
                                            strokeWidth="1.2"
                                            strokeDasharray={radialActive ? "none" : "4 3"}
                                            style={{ transition: 'all 0.5s' }}
                                        />
                                        {/* Energy Pulse sweeping path runner */}
                                        {radialActive && (
                                            <line
                                                x1={startX} y1={startY}
                                                x2={endX} y2={endY}
                                                stroke="#00E5FF"
                                                strokeWidth="2.2"
                                                strokeDasharray="6 30"
                                                style={{
                                                    animation: `linePulse 4s linear infinite, pathPulse 7s infinite`,
                                                    animationDelay: `${pulseTrigger * 0.1 + i * 0.1}s`
                                                }}
                                            />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Central Reactor Core Sphere */}
                        <div style={{
                            position: 'relative',
                            width: isMobile ? '120px' : '150px',
                            height: isMobile ? '120px' : '150px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(3,10,24,0.98) 75%)',
                            border: '2px solid rgba(0,229,255,0.6)',
                            animation: 'corePulse 4s ease-in-out infinite',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            cursor: 'pointer'
                        }} onClick={() => setPulseTrigger(p => p + 1)}>
                            {/* Inner rotating core ring */}
                            <div style={{ position: 'absolute', inset: '10px', border: '1.2px dashed rgba(0,229,255,0.35)', borderRadius: '50%', animation: 'spin 5s linear infinite' }} />
                            
                            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: isMobile ? '8.5px' : '11px', fontWeight: 900, letterSpacing: '0.25em', color: '#00E5FF', textShadow: '0 0 12px #00E5FF', zIndex: 12 }}>
                                ADDOVEDI
                            </div>
                            <div style={{ fontFamily: 'monospace', fontSize: '6px', color: 'rgba(0,229,255,0.5)', letterSpacing: '0.15em', marginTop: '2px', zIndex: 12 }}>
                                ENERGY CORE
                            </div>
                        </div>

                        {/* Surrounding Major Sponsor Nodes */}
                        {radialSponsors.map((name, i) => {
                            const angleRad = (radialAngles[i] * Math.PI) / 180;
                            const dx = Math.cos(angleRad) * radius;
                            const dy = Math.sin(angleRad) * radius;
                            const sponsorItem = sponsorsList.find(s => s.name === name) || {};
                            return (
                                <div
                                    key={name}
                                    style={{
                                        position: 'absolute',
                                        transform: `translate(${dx}px, ${dy}px) scale(${radialActive ? 1 : 0})`,
                                        opacity: radialActive ? 1 : 0,
                                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 0.5s',
                                        width: isMobile ? '68px' : '88px',
                                        height: isMobile ? '68px' : '88px',
                                        borderRadius: '50%',
                                        background: 'rgba(2, 6, 15, 0.9)',
                                        border: '1.5px solid rgba(0,229,255,0.25)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 11,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                        animation: `nodePulseGlow 7s infinite alternate`,
                                        animationDelay: `${i * 0.15}s`
                                    }}
                                >
                                    {sponsorItem.logoImage ? (
                                        <img 
                                            src={sponsorItem.logoImage} 
                                            alt={sponsorItem.name} 
                                            style={{ 
                                                width: '80%', 
                                                height: '80%', 
                                                objectFit: 'contain'
                                            }} 
                                        />
                                    ) : (
                                        <span style={{
                                            fontFamily: "'Orbitron', monospace",
                                            fontSize: isMobile ? '10px' : '13px',
                                            fontWeight: 900,
                                            letterSpacing: '0.05em',
                                            color: '#fff',
                                            textShadow: '0 0 8px rgba(0,229,255,0.45)'
                                        }}>
                                            {sponsorItem.logo}
                                        </span>
                                    )}
                                    <span style={{
                                        fontSize: '5.5px',
                                        fontFamily: 'monospace',
                                        color: CATEGORY_COLORS[sponsorItem.category],
                                        letterSpacing: '0.1em',
                                        marginTop: '3px'
                                    }}>
                                        {sponsorItem.category}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Hero Header Details below */}
                        <div style={{ position: 'absolute', bottom: '8%', textAlign: 'center', zIndex: 10 }}>
                            <h1 style={{
                                fontFamily: "'Orbitron', monospace",
                                fontSize: 'clamp(20px, 4.5vw, 36px)',
                                fontWeight: 900,
                                letterSpacing: '0.35em',
                                color: '#fff',
                                textShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
                                margin: '0 0 10px 0',
                                textTransform: 'uppercase'
                            }}>
                                ALLIANCE NETWORK
                            </h1>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: 'clamp(7.5px, 1.4vw, 11px)',
                                letterSpacing: '0.25em',
                                color: 'rgba(0, 229, 255, 0.4)'
                            }}>
                                POWERED BY INNOVATION. TOGETHER WE BUILD ADDOVEDI.
                            </div>
                        </div>
                    </div>

                    {/* ── SPONSOR GRID & ALLIANCES CONTENT SECTION ── */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: isMobile ? '40px 16px 80px' : '60px 40px 120px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div id="alliances-list" style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: 'clamp(14px, 2.5vw, 24px)',
                            fontWeight: 900,
                            letterSpacing: '0.25em',
                            color: '#fff',
                            textAlign: 'center',
                            marginBottom: '20px',
                            textTransform: 'uppercase'
                        }}>
                            ACTIVE ALLIANCES
                        </div>

                        {/* Dynamic Countup Statistics Strip */}
                        <StatStrip finalPartners={sponsorsList.length} finalCategories={5} finalConnection={100} />

                        {/* Sponsor Cards Grid (3 Columns Desktop, 2 Columns Mobile) */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`,
                            gap: isMobile ? '16px' : '28px',
                            width: '100%',
                            marginTop: '20px'
                        }}>
                            {sponsorsList.map((sponsor) => (
                                <SponsorCard
                                    key={sponsor.id}
                                    sponsor={sponsor}
                                    isMobile={isMobile}
                                    onHoverActive={setActiveHoverBeam}
                                />
                            ))}
                        </div>

                        {/* ── FUTURE ALLIANCES CTA SECTION ── */}
                        <div style={{
                            marginTop: '100px',
                            background: 'rgba(0, 229, 255, 0.01)',
                            border: '1.2px solid rgba(0, 229, 255, 0.12)',
                            borderRadius: '12px',
                            padding: isMobile ? '32px 20px' : '50px 40px',
                            textAlign: 'center',
                            clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                            boxShadow: 'inset 0 0 25px rgba(0, 229, 255, 0.03)'
                        }}>
                            <div style={{
                                fontFamily: "'Orbitron', monospace",
                                fontSize: 'clamp(12px, 2vw, 18px)',
                                fontWeight: 700,
                                letterSpacing: '0.25em',
                                color: '#00E5FF',
                                textShadow: '0 0 10px rgba(0,229,255,0.4)',
                                marginBottom: '10px'
                            }}>
                                FUTURE ALLIANCES
                            </div>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: 'clamp(10px, 1.4vw, 13px)',
                                color: 'rgba(255,255,255,0.5)',
                                letterSpacing: '0.12em',
                                marginBottom: '24px'
                            }}>
                                Interested in collaborating? Become part of the Addovedi 2026 Alliance Network.
                            </div>
                            <button
                                style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '9.5px',
                                    fontWeight: 900,
                                    letterSpacing: '0.3em',
                                    padding: '12px 36px',
                                    border: '1.5px solid #00E5FF',
                                    borderRadius: '6px',
                                    color: '#00E5FF',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s',
                                    boxShadow: '0 0 15px rgba(0,229,255,0.15)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#00E5FF18';
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(0,229,255,0.45)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0,229,255,0.15)';
                                }}
                            >
                                CONTACT US
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
