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

/* ════════════════════════════════════════════
   CREW DATA
   ════════════════════════════════════════════ */

const FACULTY_CREW = [
    {
        id: 'FC01',
        name: 'Dr. Amit Rawat',
        role: 'CONVENER',
        avatarSeed: 'Amit',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43201',
        email: 'amit.rawat@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Techfest Strategic Blueprinting', 'Department Integration Oversight']
    },
    {
        id: 'FC02',
        name: 'Dr. Shalini Vyas',
        role: 'CO-CONVENER',
        avatarSeed: 'Shalini',
        color: '#00E5FF',
        glow: 'rgba(0,229,255,0.4)',
        phone: '+91 98765 43202',
        email: 'shalini.vyas@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Academic & Technical Advisory', 'Curriculum Matching Oversight']
    },
    {
        id: 'FC03',
        name: 'Prof. Rajesh K. Patel',
        role: 'FACULTY ADVISOR',
        avatarSeed: 'Rajesh',
        color: '#9b5cff',
        glow: 'rgba(155,92,255,0.4)',
        phone: '+91 98765 43203',
        email: 'rajesh.patel@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Student Squad Guidance', 'Event Protocol Supervision']
    },
    {
        id: 'FC04',
        name: 'Dr. Neha Chaturvedi',
        role: 'FACULTY COORDINATOR',
        avatarSeed: 'NehaC',
        color: '#ff2cfb',
        glow: 'rgba(255,44,251,0.4)',
        phone: '+91 98765 43204',
        email: 'neha.chaturvedi@addovedi.org',
        linkedin: 'https://linkedin.com/',
        insta: 'https://instagram.com/',
        missions: ['Logistics & Venue Operations Coordination', 'Cross-Divisional Synchronization']
    }
];

const STUDENT_SECTIONS = [
    {
        title: 'CHIEF HEAD',
        color: '#00E5FF',
        members: [
            {
                id: 'SC01',
                name: 'Aman Verma',
                role: 'CHIEF HEAD',
                avatarSeed: 'Aman',
                color: '#00E5FF',
                glow: 'rgba(0,229,255,0.4)',
                phone: '+91 91111 22201',
                email: 'aman.verma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Overall Techfest Command', 'Led 46-member squadron', 'Strategic sponsor acquisition']
            }
        ]
    },
    {
        title: 'ASST. HEAD',
        color: '#00E5FF',
        members: [
            {
                id: 'SC02',
                name: 'Sneha Raj',
                role: 'ASST. HEAD',
                avatarSeed: 'Sneha',
                color: '#00E5FF',
                glow: 'rgba(0,229,255,0.4)',
                phone: '+91 91111 22202',
                email: 'sneha.raj@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Operations & Logistics supervision', 'Budget allocation & control', 'Direct wing coordination']
            }
        ]
    },
    {
        title: 'EVENT HEAD',
        color: '#9b5cff',
        members: [
            {
                id: 'SC03',
                name: 'Rahul Das',
                role: 'EVENT HEAD',
                avatarSeed: 'Rahul',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22203',
                email: 'rahul.das@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Planned 25+ events', 'Strategic timeline management', 'Day-of execution overseer']
            }
        ]
    },
    {
        title: 'WEB HEAD',
        color: '#ff2cfb',
        members: [
            {
                id: 'SC04',
                name: 'Vaibhav Singh',
                role: 'WEB HEAD',
                avatarSeed: 'Vaibhav',
                color: '#ff2cfb',
                glow: 'rgba(255,44,251,0.4)',
                phone: '+91 91111 22204',
                email: 'vaibhav.singh@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Interactive 3D portal architect', 'UI System lead dev', 'Production build pipeline deployment']
            }
        ]
    },
    {
        title: 'DESIGN HEAD',
        color: '#ff2cfb',
        members: [
            {
                id: 'SC05',
                name: 'Neha Gupta',
                role: 'DESIGN HEAD',
                avatarSeed: 'NehaG',
                color: '#ff2cfb',
                glow: 'rgba(255,44,251,0.4)',
                phone: '+91 91111 22205',
                email: 'neha.gupta@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Techfest brand architecture', 'Hologram lobby styling asset designs', 'User experience system layout']
            }
        ]
    },
    {
        title: 'SPONSORS HEAD',
        color: '#ffd700',
        members: [
            {
                id: 'SC06',
                name: 'Harsh Vardhan',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Harsh',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22206',
                email: 'harsh.v@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Corporate sponsor networking', 'Outreach deck presentation', 'MNC partnerships development']
            },
            {
                id: 'SC07',
                name: 'Ritika Sharma',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Ritika',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22207',
                email: 'ritika.s@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Corporate sponsorship pipeline management', 'Cold call campaign management', 'Sponsor ROI reporting']
            },
            {
                id: 'SC08',
                name: 'Kiran Verma',
                role: 'SPONSORS HEAD',
                avatarSeed: 'Kiran',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22208',
                email: 'kiran.v@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Email outreach strategy execution', 'Brand partnership development', 'Budget negotiation control']
            }
        ]
    },
    {
        title: 'PR HEAD',
        color: '#ff9d00',
        members: [
            {
                id: 'SC09',
                name: 'Dev Sharma',
                role: 'PR HEAD',
                avatarSeed: 'Dev',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22209',
                email: 'dev.sharma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Outreach and media distribution', 'College collaborations', 'Press release dissemination']
            },
            {
                id: 'SC10',
                name: 'Tanya Singh',
                role: 'PR HEAD',
                avatarSeed: 'Tanya',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22210',
                email: 'tanya.singh@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Influencer outreach campaigns', 'Social media platform coordination', 'Visitor response tracking']
            }
        ]
    },
    {
        title: 'DOCUMENTATION HEAD',
        color: '#2b5cff',
        members: [
            {
                id: 'SC11',
                name: 'Anika Roy',
                role: 'DOCUMENTATION HEAD',
                avatarSeed: 'Anika',
                color: '#2b5cff',
                glow: 'rgba(43,92,255,0.4)',
                phone: '+91 91111 22211',
                email: 'anika.roy@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Rulebook drafting and formatting', 'Participant data records management', 'Techfest archives collation']
            }
        ]
    },
    {
        title: 'FINANCE HEAD',
        color: '#1fff76',
        members: [
            {
                id: 'SC12',
                name: 'Aisha Khan',
                role: 'FINANCE HEAD',
                avatarSeed: 'Aisha',
                color: '#1fff76',
                glow: 'rgba(31,255,118,0.4)',
                phone: '+91 91111 22212',
                email: 'aisha.khan@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Managed ₹5L+ accounts', 'Audited vendor invoices', 'Cost optimization strategizer']
            }
        ]
    },
    {
        title: 'MERCHANDISE HEAD',
        color: '#ffd700',
        members: [
            {
                id: 'SC13',
                name: 'Rohan Mehta',
                role: 'MERCHANDISE HEAD',
                avatarSeed: 'Rohan',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22213',
                email: 'rohan.mehta@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Designed squadron hoodies & badges', 'Vendor negotiation & dispatch pipeline', 'Inventory logs management']
            },
            {
                id: 'SC14',
                name: 'Shruti Agarwal',
                role: 'MERCHANDISE HEAD',
                avatarSeed: 'Shruti',
                color: '#ffd700',
                glow: 'rgba(255,215,0,0.4)',
                phone: '+91 91111 22214',
                email: 'shruti.a@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Visual identity printing logistics', 'Stock distribution across divisions', 'Accounting of merch transactions']
            }
        ]
    },
    {
        title: 'DECORATION HEAD',
        color: '#9b5cff',
        members: [
            {
                id: 'SC15',
                name: 'Priya Nair',
                role: 'DECORATION HEAD',
                avatarSeed: 'Priya',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22215',
                email: 'priya.nair@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Lobby physical setup layout design', 'Futuristic cyberpunk neon prop designs', 'Main arena visual decoration']
            },
            {
                id: 'SC16',
                name: 'Amit Joshi',
                role: 'DECORATION HEAD',
                avatarSeed: 'AmitJ',
                color: '#9b5cff',
                glow: 'rgba(155,92,255,0.4)',
                phone: '+91 91111 22216',
                email: 'amit.joshi@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Decoration supply chain manager', 'Setup coordinator on campus grounds', 'Neon illumination assembly']
            }
        ]
    },
    {
        title: 'VOLUNTEERS HEAD',
        color: '#1fff76',
        members: [
            {
                id: 'SC17',
                name: 'Akash Yadav',
                role: 'VOLUNTEERS HEAD',
                avatarSeed: 'Akash',
                color: '#1fff76',
                glow: 'rgba(31,255,118,0.4)',
                phone: '+91 91111 22217',
                email: 'akash.yadav@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Enlisted 100+ volunteers', 'Strategic sector delegation mapping', 'Live briefing & crowd control']
            }
        ]
    },
    {
        title: 'MANAGEMENT HEAD',
        color: '#ff9d00',
        members: [
            {
                id: 'SC18',
                name: 'Siddharth Roy',
                role: 'MANAGEMENT HEAD',
                avatarSeed: 'Siddharth',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22218',
                email: 'siddharth.roy@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Overarching event administration', 'Inter-departmental pipeline sync', 'Grievance redressal logs']
            },
            {
                id: 'SC19',
                name: 'Pooja Sharma',
                role: 'MANAGEMENT HEAD',
                avatarSeed: 'Pooja',
                color: '#ff9d00',
                glow: 'rgba(255,157,0,0.4)',
                phone: '+91 91111 22219',
                email: 'pooja.sharma@addovedi.org',
                linkedin: 'https://linkedin.com/',
                insta: 'https://instagram.com/',
                missions: ['Hospitality scheduling supervision', 'Registration assistance coordination', 'Feedback survey reporting']
            }
        ]
    }
];

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

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.5 + 0.8,
            color: Math.random() > 0.5 ? '#00e5ff' : '#ff2cfb'
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Faint Grid Backing
            ctx.strokeStyle = 'rgba(0,217,255,0.015)';
            ctx.lineWidth = 1;
            const GRID = 70;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Draw Plexus lines first
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.12;
                        ctx.strokeStyle = p1.color === '#00e5ff' ? `rgba(0, 229, 255, ${alpha})` : `rgba(255, 44, 251, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw Floating Particles
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                
                // Draw glowing dot
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                
                // Small inner core
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1.0;

            // Faint system diagnostic terminal feeds in background
            if (frame % 150 === 0) {
                const logs = ['NODE_SYS_ACTIVE', 'DATABASE_SYNCED', 'SECURE_CONN', 'MISSION_STATUS_NOMINAL', 'AUTH_LEVEL_3', 'HUD_INITIALIZED'];
                ctx.globalAlpha = 0.04;
                ctx.fillStyle = '#00E5FF';
                ctx.font = '8px monospace';
                ctx.fillText(logs[Math.floor(Math.random() * logs.length)], Math.random() * W, Math.random() * H);
            }

            frame++;
            requestAnimationFrame(tick);
        };
        const handle = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(handle); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity: 0.8 }} />;
}

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
   CHARACTER SELECTION CARD COMPONENT
   ════════════════════════════════════════════ */
function CrewCard({ member, isFeatured, isMobile }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [tapExpanded, setTapExpanded] = useState(false);

    // Mouse movement magnetic tilt logic
    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;
        
        // Max tilt degree limits
        const tiltX = (mouseY / (height / 2)) * -6;
        const tiltY = (mouseX / (width / 2)) * 6;
        setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    const handleCardClick = () => {
        if (isMobile) {
            setTapExpanded(!tapExpanded);
        }
    };

    const badgeColor = member.color;
    const isOverlayVisible = isMobile ? tapExpanded : isHovered;

    // Use a high-tech retro pixel seed avatar representation
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${member.avatarSeed}`;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '0.72',
                borderRadius: '12px',
                border: '1.2px solid rgba(0, 229, 255, 0.15)',
                background: isHovered || isFeatured 
                    ? 'rgba(6, 12, 24, 0.92)' 
                    : 'rgba(6, 12, 24, 0.65)',
                backdropFilter: isHovered ? 'blur(16px)' : 'blur(8px)',
                boxShadow: isFeatured 
                    ? `0 0 25px rgba(0, 229, 255, 0.3), inset 0 0 15px rgba(0, 229, 255, 0.15)`
                    : isHovered 
                    ? `0 0 20px ${member.glow}, inset 0 0 10px rgba(0, 229, 255, 0.15)` 
                    : '0 4px 20px rgba(0, 0, 0, 0.5)',
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-8px' : '0px'})`,
                transition: isHovered ? 'transform 0.05s ease-out, box-shadow 0.25s, background-color 0.25s' : 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), translateY 0.3s, box-shadow 0.3s, background-color 0.3s',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                zIndex: isHovered ? 15 : 1
            }}
        >
            {/* Energy Border Runner Effect on Hover / Featured */}
            {(isHovered || isFeatured) && (
                <div className="energy-border-glow" style={{ '--border-glow-color': member.color }} />
            )}

            {/* Scanning Line overlay */}
            <div className="card-scanline" />

            {/* Department holographic chip badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', zIndex: 5 }}>
                <span style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: '8px',
                    letterSpacing: '0.15em',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${badgeColor}50`,
                    color: badgeColor,
                    background: `${badgeColor}12`,
                    textShadow: `0 0 8px ${badgeColor}80`
                }}>
                    SYSTEM CREW
                </span>
                <span style={{
                    fontFamily: 'monospace',
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.1em'
                }}>
                    {member.id}
                </span>
            </div>

            {/* 🎮 Portrait Frame Section */}
            <div style={{
                position: 'relative',
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                zIndex: 3
            }}>
                {/* Rotating holographic circles behind */}
                <div className="portrait-bg-glow" style={{ background: `radial-gradient(circle, ${badgeColor}25 0%, transparent 70%)` }} />
                <div className="portrait-rotating-ring" style={{ border: `1px dashed ${badgeColor}30`, animationDirection: 'normal' }} />
                <div className="portrait-rotating-ring" style={{ width: '85%', height: '85%', border: `1px solid ${badgeColor}15`, borderTopColor: badgeColor, animationDirection: 'reverse', animationDuration: '4s' }} />

                {/* Portrait Core Container */}
                <div style={{
                    position: 'relative',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `1.5px solid ${isHovered ? badgeColor : 'rgba(0, 229, 255, 0.2)'}`,
                    transition: 'border-color 0.3s, transform 0.3s',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    background: 'rgba(3, 8, 16, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className={isHovered ? 'glitch-image-trigger' : ''}>
                    {/* Scanline overlay */}
                    <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.2) 2px,rgba(0,0,0,0.2) 3px)', pointerEvents:'none', zIndex: 2 }} />

                    {/* Pixel Art Avatar Image */}
                    <img 
                        src={avatarUrl} 
                        alt={member.name}
                        style={{
                            width: '80%',
                            height: '80%',
                            objectFit: 'contain',
                            imageRendering: 'pixelated',
                            zIndex: 1,
                            opacity: 0.9
                        }}
                    />
                </div>

                {/* Cyber Corner Brackets */}
                <div style={{ position: 'absolute', top: '5%', left: '5%', width: '10px', height: '10px', borderTop: `1.5px solid ${badgeColor}`, borderLeft: `1.5px solid ${badgeColor}` }} />
                <div style={{ position: 'absolute', top: '5%', right: '5%', width: '10px', height: '10px', borderTop: `1.5px solid ${badgeColor}`, borderRight: `1.5px solid ${badgeColor}` }} />
                <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: '10px', height: '10px', borderBottom: `1.5px solid ${badgeColor}`, borderLeft: `1.5px solid ${badgeColor}` }} />
                <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '10px', height: '10px', borderBottom: `1.5px solid ${badgeColor}`, borderRight: `1.5px solid ${badgeColor}` }} />
            </div>

            {/* Identity Info */}
            <div style={{ zIndex: 5, textAlign: 'center', marginTop: 'auto' }}>
                <div style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: '13px',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: isHovered ? '#fff' : 'rgba(255,255,255,0.85)',
                    textShadow: isHovered || isFeatured ? `0 0 8px ${badgeColor}` : 'none',
                    transition: 'color 0.2s, text-shadow 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {member.name.toUpperCase()}
                </div>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    color: isHovered ? badgeColor : 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.18em',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {member.role}
                </div>
            </div>

            {/* Hover Project / Social Slide-up Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(3, 8, 16, 0.98)',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isOverlayVisible ? 1 : 0,
                transform: isOverlayVisible ? 'translateY(0%)' : 'translateY(15%)',
                transition: 'opacity 0.18s ease-out, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
                pointerEvents: isOverlayVisible ? 'auto' : 'none',
                border: `1.2px solid ${badgeColor}`,
                borderRadius: '12px'
            }}>
                {/* Details list */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: isMobile ? '8px' : '12px',
                        letterSpacing: '0.2em',
                        color: badgeColor,
                        borderBottom: `1px solid ${badgeColor}30`,
                        paddingBottom: '6px',
                        marginBottom: '12px'
                    }}>
                        ACTIVE MISSIONS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {member.missions.map((mission, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                <span style={{ color: badgeColor, fontSize: isMobile ? '8px' : '11px', lineHeight: 1.35 }}>▶</span>
                                <span style={{ fontFamily: 'monospace', fontSize: isMobile ? '9px' : '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.35 }}>{mission}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contacts & Social Networks */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: isMobile ? '8px' : '12px',
                        letterSpacing: '0.2em',
                        color: badgeColor,
                        borderBottom: `1px solid ${badgeColor}30`,
                        paddingBottom: '6px',
                        marginBottom: '8px'
                    }}>
                        COMMUNICATIONS
                    </div>

                    {/* Direct Contact info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                        {member.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '9px' : '12.5px', fontFamily: 'monospace', color: '#fff' }}>
                                <span style={{ color: badgeColor }}>📞</span>
                                <a href={`tel:${member.phone}`} onClick={e => e.stopPropagation()} style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none' }} className="hover:text-white">
                                    {member.phone}
                                </a>
                            </div>
                        )}
                        {member.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '9px' : '12.5px', fontFamily: 'monospace', color: '#fff', overflow: 'hidden' }}>
                                <span style={{ color: badgeColor }}>✉</span>
                                <a href={`mailto:${member.email}`} onClick={e => e.stopPropagation()} style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} className="hover:text-white">
                                    {member.email}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Socials buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: isMobile ? '7.5px' : '10px',
                                padding: isMobile ? '6px 0' : '8px 0',
                                borderRadius: '4px',
                                border: `1.2px solid ${badgeColor}30`,
                                background: 'rgba(255,255,255,0.02)',
                                color: badgeColor,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = badgeColor;
                                e.currentTarget.style.background = `${badgeColor}15`;
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = `${badgeColor}30`;
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.color = badgeColor;
                            }}
                        >
                            LINKEDIN
                        </a>
                        <a
                            href={member.insta}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: isMobile ? '7.5px' : '10px',
                                padding: isMobile ? '6px 0' : '8px 0',
                                borderRadius: '4px',
                                border: `1.2px solid ${badgeColor}30`,
                                background: 'rgba(255,255,255,0.02)',
                                color: badgeColor,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontWeight: 'bold'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = badgeColor;
                                e.currentTarget.style.background = `${badgeColor}15`;
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = `${badgeColor}30`;
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.color = badgeColor;
                            }}
                        >
                            INSTAGRAM
                        </a>
                    </div>
                </div>
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
