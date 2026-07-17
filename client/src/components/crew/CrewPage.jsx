/**
 * CrewPage.jsx — ADDOVEDI PERSONNEL DATABASE
 *
 * A premium, AAA game character-select screen inspired by modern gaming UIs:
 *  • Hero header (100vh atmosphere) with loading boot and blue energy sweep
 *  • Stat strip counting up to 46 Members, 6 Divisions, 1 Mission
 *  • Responsive grid (4 cols desktop, 2 cols mobile) of glassmorphic character cards
 *  • Magnetic tilt cursor effect on portraits
 *  • Character select: Custom holographic frames, rotating background rings, corner brackets, glitch effects
 *  • Reveal overlays on hover (desktop) or tap (mobile)
 *  • Active featured card cycling every 6-8 seconds
 *  • Slow-moving animated canvas background (opacity 5-10%)
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CrewNav from './CrewNav';
import { API_BASE } from '../../constants/api';

/* ════════════════════════════════════════════
   CREW DATA
════════════════════════════════════════════ */
const DEPTS = {
    EXECUTIVE: {
        color: '#00E5FF', glow: 'rgba(0,229,255,0.4)', icon: '👑',
        badge: 'cyan',
        members: [
            { id:'E01', name:'Aman Verma',    role:'PRESIDENT',          status:'MISSION READY',   skills:[{n:'Leadership',p:96},{n:'Strategy',p:90}], missions:['Coordinated 3-day Techfest','Led 46-member team','Secured 12+ sponsors'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'E02', name:'Sneha Raj',     role:'VICE PRESIDENT',     status:'ONLINE',          skills:[{n:'Operations',p:92},{n:'Leadership',p:88}],    missions:['Managed event logistics','Budget allocation','Team coordination'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'E03', name:'Rohan Mehta',   role:'GENERAL SECRETARY',  status:'CONNECTED',       skills:[{n:'Documentation',p:87},{n:'Admin',p:83}], missions:['Handled official letters','Managed registrations','MoU documentation'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'E04', name:'Aisha Khan',    role:'TREASURER',          status:'ONLINE',          skills:[{n:'Finance',p:94},{n:'Planning',p:82}],       missions:['Managed ₹5L+ budget','Vendor payments','Cost optimization'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'E05', name:'Dev Sharma',    role:'PUBLIC RELATIONS',   status:'MISSION READY',   skills:[{n:'PR',p:91},{n:'Media',p:86}],               missions:['Media outreach campaign','Press releases','College partnerships'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
    TECH: {
        color: '#FF2CFB', glow: 'rgba(255,44,251,0.4)', icon: '💻',
        badge: 'pink',
        members: [
            { id:'T01', name:'Vaibhav Singh',  role:'TECH LEAD',          status:'MISSION READY',   skills:[{n:'React',p:95},{n:'Three.js',p:88}],  missions:['Built festival website','3D interactive UI','Real-time event portal'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'T02', name:'Karan Patel',    role:'BACKEND DEVELOPER',  status:'ONLINE',          skills:[{n:'Node.js',p:90},{n:'REST APIs',p:92}],     missions:['API architecture','Database design','Auth systems'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'T03', name:'Priya Nair',     role:'FULL STACK DEV',     status:'CONNECTED',       skills:[{n:'Vue.js',p:85},{n:'Docker',p:80}],          missions:['Registration portal','Admin dashboard','Email automation'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'T04', name:'Arjun Kumar',    role:'DEVOPS ENGINEER',    status:'ONLINE',          skills:[{n:'AWS',p:87},{n:'Linux',p:91}],              missions:['Cloud deployment','Zero-downtime pipeline','Security hardening'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'T05', name:'Neha Gupta',     role:'UI/UX DESIGNER',     status:'MISSION READY',   skills:[{n:'Figma',p:94},{n:'Research',p:82}],         missions:['Design system','User journey mapping','Brand identity'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'T06', name:'Siddharth Roy',  role:'DATABASE ARCHITECT', status:'ONLINE',          skills:[{n:'PostgreSQL',p:89},{n:'Redis',p:85}],  missions:['Schema design','Query optimization','Data pipelines'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
    EVENTS: {
        color: '#7A5CFF', glow: 'rgba(122,92,255,0.4)', icon: '🎯',
        badge: 'purple',
        members: [
            { id:'EV01', name:'Rahul Das',      role:'EVENTS HEAD',        status:'MISSION READY',   skills:[{n:'Coordination',p:93},{n:'Leadership',p:90}], missions:['Planned 25+ events','Venue coordination','Day-of execution'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'EV02', name:'Pooja Sharma',   role:'SENIOR COORDINATOR', status:'ONLINE',          skills:[{n:'Scheduling',p:90},{n:'Communication',p:88}],missions:['Speaker invitations','Timeline management','Backup planning'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'EV03', name:'Amit Joshi',     role:'LOGISTICS MANAGER',  status:'CONNECTED',       skills:[{n:'Procurement',p:87},{n:'Networking',p:80}],   missions:['Equipment procurement','Venue setup','Transport logistics'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'EV04', name:'Divya Menon',    role:'STAGE MANAGER',      status:'ONLINE',          skills:[{n:'Stage Mgmt',p:91},{n:'Crowd Control',p:86}],  missions:['Main stage operations','Sound & lighting','Green room management'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'EV05', name:'Tanya Singh',    role:'HOSPITALITY HEAD',   status:'MISSION READY',   skills:[{n:'Guest Relations',p:92},{n:'Coordination',p:85}],missions:['VIP guest management','Accommodation','Welcome protocol'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
    MEDIA: {
        color: '#FF9D00', glow: 'rgba(255,157,0,0.4)', icon: '📸',
        badge: 'orange',
        members: [
            { id:'M01', name:'Nikhil Bose',    role:'MEDIA HEAD',         status:'MISSION READY',   skills:[{n:'Direction',p:92},{n:'Branding',p:88}],       missions:['Social media strategy','Brand consistency','Content calendar'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'M02', name:'Shruti Agarwal', role:'PHOTOGRAPHER',       status:'ONLINE',          skills:[{n:'Photography',p:95},{n:'Lightroom',p:90}], missions:['Event photography','Portfolio creation','Press kit images'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'M03', name:'Rohit Verma',    role:'VIDEOGRAPHER',       status:'CONNECTED',       skills:[{n:'Video Editing',p:91},{n:'After Effects',p:85}],missions:['Teaser trailer','Live streams','After-movie production'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'M04', name:'Meera Patel',    role:'GRAPHIC DESIGNER',   status:'ONLINE',          skills:[{n:'Illustrator',p:93},{n:'Photoshop',p:90}], missions:['Poster series','Event banners','Social media templates'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'M05', name:'Vivek Mishra',   role:'SOCIAL MEDIA LEAD',  status:'MISSION READY',   skills:[{n:'Content',p:89},{n:'Copywriting',p:87}],      missions:['10K+ impressions campaign','Reel strategy','Influencer outreach'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
    ROBOTICS: {
        color: '#1FFF76', glow: 'rgba(31,255,118,0.4)', icon: '🤖',
        badge: 'green',
        members: [
            { id:'R01', name:'Akash Yadav',    role:'ROBOTICS HEAD',      status:'MISSION READY',   skills:[{n:'Embedded C',p:92},{n:'Circuit Design',p:88}], missions:['Bot design oversight','Workshop facilitation','Competition judging'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'R02', name:'Simran Kaur',    role:'HARDWARE ENGINEER',  status:'ONLINE',          skills:[{n:'PCB Design',p:90},{n:'Arduino',p:93}],         missions:['Prototype fabrication','Sensor integration','Hardware testing'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'R03', name:'Gaurav Sharma',  role:'FIRMWARE DEV',       status:'CONNECTED',       skills:[{n:'RTOS',p:87},{n:'C++',p:90}],                  missions:['Motor control firmware','Sensor fusion','Real-time systems'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'R04', name:'Shreya Nair',    role:'CAD DESIGNER',       status:'ONLINE',          skills:[{n:'SolidWorks',p:91},{n:'3D Printing',p:88}],  missions:['Chassis design','3D printed components','Structural analysis'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'R05', name:'Mohit Jain',     role:'TEST ENGINEER',      status:'MISSION READY',   skills:[{n:'Testing',p:89},{n:'Debugging',p:91}],       missions:['System integration tests','Failure analysis','Test protocols'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'R06', name:'Anika Roy',      role:'DOCUMENTATION LEAD', status:'ONLINE',          skills:[{n:'Technical Writing',p:93},{n:'Research',p:88}],     missions:['Technical reports','Workshop materials','Knowledge base'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
    SPONSORS: {
        color: '#FFD700', glow: 'rgba(255,215,0,0.4)', icon: '🤝',
        badge: 'gold',
        members: [
            { id:'SP01', name:'Cap. Harsh',    role:'SPONSORSHIP HEAD',   status:'MISSION READY',   skills:[{n:'Negotiation',p:93},{n:'Networking',p:90}],       missions:['Secured 12+ sponsors','₹5L+ in sponsorships','Corporate decks'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'SP02', name:'Ritika Sharma', role:'CORPORATE RELATIONS', status:'ONLINE',         skills:[{n:'Communication',p:91},{n:'CRM',p:86}],            missions:['MNC partnerships','Cold outreach campaigns','Follow-up management'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'SP03', name:'Kiran Verma',   role:'OUTREACH LEAD',      status:'CONNECTED',       skills:[{n:'Outreach',p:88},{n:'Email Marketing',p:83}],    missions:['Email outreach (500+ contacts)','Response rate optimization','Data tracking'], social:{github:'#',linkedin:'#',instagram:'#'} },
            { id:'SP04', name:'Sumit Patel',   role:'MARKETING ANALYST',  status:'ONLINE',          skills:[{n:'Market Research',p:89},{n:'Data Analysis',p:84}],missions:['Sponsor ROI reports','Industry research','Pricing strategy'], social:{github:'#',linkedin:'#',instagram:'#'} },
        ],
    },
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

        const GRID = 60;
        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.25 + 0.05,
            c: '#00E5FF'
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Faint Grid
            ctx.strokeStyle = 'rgba(0,217,255,0.02)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Floating Particles
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = p.c;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Very faint floating binary/system logs behind (5% opacity)
            if (frame % 120 === 0) {
                const logs = ['NODE_SYS_ACTIVE', 'DATABASE_SYNCED', 'SECURE_CONN', 'MISSION_STATUS_OK', 'AUTH_LEVEL_3'];
                ctx.globalAlpha = 0.03;
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
function StatStrip({ finalMembers, finalDepts, finalMission }) {
    const [members, setMembers] = useState(0);
    const [depts, setDepts] = useState(0);
    const [mission, setMission] = useState(0);

    useEffect(() => {
        let currentMembers = 0;
        let currentDepts = 0;
        let currentMission = 0;

        const interval = setInterval(() => {
            let done = true;
            if (currentMembers < finalMembers) {
                currentMembers = Math.min(currentMembers + 2, finalMembers);
                setMembers(currentMembers);
                done = false;
            }
            if (currentDepts < finalDepts) {
                currentDepts = Math.min(currentDepts + 1, finalDepts);
                setDepts(currentDepts);
                done = false;
            }
            if (currentMission < finalMission) {
                currentMission = Math.min(currentMission + 1, finalMission);
                setMission(currentMission);
                done = false;
            }

            if (done) clearInterval(interval);
        }, 30);

        return () => clearInterval(interval);
    }, [finalMembers, finalDepts, finalMission]);

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
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>MEMBERS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 32px)', fontWeight: 900, color: '#FF2CFB', textShadow: '0 0 10px rgba(255, 44, 251, 0.5)' }}>{depts.toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 'clamp(8px, 1.2vw, 10px)', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>DEPARTMENTS</div>
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

    const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const badgeColor = member.color;

    // Random slight float animation parameters
    const floatDelay = useMemo(() => Math.random() * -5, []);
    const floatDuration = useMemo(() => 4 + Math.random() * 2, []);

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
                border: '1px solid rgba(0, 229, 255, 0.15)',
                background: isHovered || isFeatured 
                    ? 'rgba(6, 12, 24, 0.85)' 
                    : 'rgba(6, 12, 24, 0.55)',
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
                animation: `cardFloat ${floatDuration}s ease-in-out infinite alternate`,
                animationDelay: `${floatDelay}s`,
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
                    {member.dept}
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

                    {/* Initials Text Avatar */}
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '28px',
                        fontWeight: 900,
                        color: badgeColor,
                        textShadow: `0 0 15px ${badgeColor}, 0 0 30px ${badgeColor}50`,
                        zIndex: 1,
                        letterSpacing: '0.05em'
                    }}>
                        {initials}
                    </div>
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

            {/* Hover Project / Social Slide-up Overlay (Fades up in under 0.2s) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(3, 8, 16, 0.96)',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: (isMobile ? tapExpanded : isHovered) ? 1 : 0,
                transform: (isMobile ? tapExpanded : isHovered) ? 'translateY(0%)' : 'translateY(15%)',
                transition: 'opacity 0.18s ease-out, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
                pointerEvents: (isMobile ? tapExpanded : isHovered) ? 'auto' : 'none',
                border: `1px solid ${badgeColor}80`,
                borderRadius: '12px'
            }}>
                {/* Details list */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '8px',
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
                                <span style={{ color: badgeColor, fontSize: '9px', lineHeight: 1.3 }}>▶</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{mission}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social contact buttons */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '8px',
                        letterSpacing: '0.2em',
                        color: badgeColor,
                        borderBottom: `1px solid ${badgeColor}30`,
                        paddingBottom: '6px',
                        marginBottom: '10px'
                    }}>
                        COMMUNICATIONS
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['GITHUB', 'LINKEDIN', 'INSTAGRAM'].map(net => (
                            <a
                                key={net}
                                href={member.social[net.toLowerCase()]}
                                onClick={(e) => e.stopPropagation()} // Stop bubbling to expand event on mobile
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontFamily: "'Orbitron', monospace",
                                    fontSize: '7.5px',
                                    padding: '5px 0',
                                    borderRadius: '4px',
                                    border: `1px solid ${badgeColor}30`,
                                    background: 'rgba(255,255,255,0.02)',
                                    color: badgeColor,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
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
                                {net}
                            </a>
                        ))}
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
    const [filterDept, setFilterDept] = useState('ALL');
    const [visibleRows, setVisibleRows] = useState(1);
    const [featuredIndex, setFeaturedIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [dbCrew, setDbCrew] = useState([]);

    // Track window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch dynamic crew list from backend
    useEffect(() => {
        const fetchCrew = async () => {
            try {
                const res = await fetch(`${API_BASE}/crew`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setDbCrew(data);
                    }
                }
            } catch (err) {
                console.log("Failed to fetch crew from server, using local fallbacks");
            }
        };
        fetchCrew();
    }, []);

    // Convert dbCrew (if available) or static DEPTS into the standard format
    const deptsData = useMemo(() => {
        if (!dbCrew || dbCrew.length === 0) return DEPTS;
        
        const mapped = {
            EXECUTIVE: { color: '#00E5FF', glow: 'rgba(0,229,255,0.4)', icon: '👑', badge: 'cyan', members: [] },
            TECH: { color: '#FF2CFB', glow: 'rgba(255,44,251,0.4)', icon: '💻', badge: 'pink', members: [] },
            EVENTS: { color: '#7A5CFF', glow: 'rgba(122,92,255,0.4)', icon: '🎯', badge: 'purple', members: [] },
            MEDIA: { color: '#FF9D00', glow: 'rgba(255,157,0,0.4)', icon: '📸', badge: 'orange', members: [] },
            ROBOTICS: { color: '#1FFF76', glow: 'rgba(31,255,118,0.4)', icon: '🤖', badge: 'green', members: [] },
            SPONSORS: { color: '#FFD700', glow: 'rgba(255,215,0,0.4)', icon: '🤝', badge: 'gold', members: [] }
        };

        dbCrew.forEach((member, idx) => {
            let mappedCat = 'TECH';
            if (member.category === 'CORE') mappedCat = 'EXECUTIVE';
            else if (member.category === 'TECHNICAL') mappedCat = 'TECH';
            else if (member.category === 'EVENTS') mappedCat = 'EVENTS';
            else if (member.category === 'MEDIA') mappedCat = 'MEDIA';
            else if (member.category === 'ROBOTICS') mappedCat = 'ROBOTICS';
            else if (member.category === 'SPONSORS') mappedCat = 'SPONSORS';
            else if (member.category === 'DESIGN') mappedCat = 'TECH';

            mapped[mappedCat].members.push({
                id: member._id || `M${idx}`,
                name: member.name,
                role: member.role,
                status: member.featured ? 'MISSION READY' : 'CONNECTED',
                skills: [{ n: member.statText, p: 90 }],
                missions: [member.bio || 'Addovedi Division Lead'],
                social: { github: '#', linkedin: '#', instagram: '#' },
                avatar: member.avatar
            });
        });
        
        return mapped;
    }, [dbCrew]);

    const deptKeys = useMemo(() => Object.keys(deptsData), [deptsData]);
    const allMembers = useMemo(() => {
        return Object.entries(deptsData).flatMap(([deptKey, deptVal]) =>
            deptVal.members.map(member => ({ ...member, dept: deptKey, color: deptVal.color, glow: deptVal.glow, badge: deptVal.badge }))
        );
    }, [deptsData]);

    // Filter members list
    const filteredCrew = useMemo(() => {
        if (filterDept === 'ALL') return allMembers;
        return allMembers.filter(m => m.dept === filterDept);
    }, [filterDept, allMembers]);

    // Split filtered crew into rows of 4 (desktop) or 2 (mobile)
    const cols = isMobile ? 2 : 4;
    const crewRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < filteredCrew.length; i += cols) {
            rows.push(filteredCrew.slice(i, i + cols));
        }
        return rows;
    }, [filteredCrew, cols]);

    // Crew card entry animation: trigger row reveal index over time
    useEffect(() => {
        if (!booted) return;
        setVisibleRows(1);
        const interval = setInterval(() => {
            setVisibleRows(prev => {
                if (prev >= crewRows.length) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 300); // reveals next row every 300ms
        return () => clearInterval(interval);
    }, [crewRows.length, booted, filterDept]);

    // Auto active featured card selection cycle every 7 seconds
    useEffect(() => {
        if (!booted || filteredCrew.length === 0) return;
        const interval = setInterval(() => {
            const randIdx = Math.floor(Math.random() * filteredCrew.length);
            setFeaturedIndex(randIdx);
        }, 7000);
        return () => clearInterval(interval);
    }, [filteredCrew.length, booted]);

    // Initial page load simulated database sweep
    useEffect(() => {
        const timer = setTimeout(() => setBooted(true), 2400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ position:'fixed', inset:0, background:'#02050c', zIndex:100, overflowY:'auto', overflowX:'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes sweepLine {
                    0% { transform: scaleX(0); opacity: 0; left: 0; }
                    25% { opacity: 0.8; }
                    50% { transform: scaleX(1); opacity: 1; left: 0; }
                    75% { opacity: 0.8; }
                    100% { transform: scaleX(0); opacity: 0; left: 100%; }
                }
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
                    padding: 1px;
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
            `}} />

            <BgCanvas />

            {/* ── Entry Boot Loader ── */}
            {!booted && (
                <div style={{ position:'fixed', inset:0, zIndex:200, background:'#02050c', display:'flex', flexDirection:'column', alignItems:'center', justifyJoin:'center', gap:'12px', justifyContent: 'center' }}>
                    <div style={{ fontFamily:"'Orbitron', monospace", fontSize:'10px', letterSpacing:'0.4em', color:'rgba(0, 229, 255, 0.7)' }}>
                        CREW CONNECTION ESTABLISHED
                    </div>
                    {/* Energy wave sweep indicator */}
                    <div style={{ position:'relative', width:'240px', height:'2px', background:'rgba(0,229,255,0.1)', overflow:'hidden', marginTop:'10px' }}>
                        <div style={{
                            position:'absolute', top:0, height:'100%', width:'100px',
                            background:'linear-gradient(90deg, transparent, #00E5FF, transparent)',
                            animation: 'sweepLine 2s ease-in-out infinite'
                        }} />
                    </div>
                </div>
            )}

            {booted && (
                <>
                    {/* Navbar */}
                    <div style={{ position:'relative', zIndex:20 }}>
                        <CrewNav />
                    </div>

                    {/* Main Container */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: isMobile ? '20px 16px 80px' : '40px 40px 100px',
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
                        <StatStrip finalMembers={allMembers.length} finalDepts={deptKeys.length} finalMission={1} />

                        {/* Futuristic Department Selector Chips */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                            marginBottom: '40px',
                            padding: '0 8px'
                        }}>
                            {['ALL', ...deptKeys].map(key => {
                                const deptColor = key === 'ALL' ? '#00E5FF' : deptsData[key].color;
                                const isActive = filterDept === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setFilterDept(key)}
                                        style={{
                                            fontFamily: "'Orbitron', monospace",
                                            fontSize: 'clamp(7.5px, 1.2vw, 10px)',
                                            letterSpacing: '0.2em',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: `1.5px solid ${isActive ? deptColor : 'rgba(255, 255, 255, 0.08)'}`,
                                            color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                                            background: isActive ? `${deptColor}22` : 'rgba(255, 255, 255, 0.02)',
                                            boxShadow: isActive ? `0 0 15px ${deptColor}40` : 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease',
                                            textTransform: 'uppercase',
                                            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                                        }}
                                        onMouseEnter={e => {
                                            if (!isActive) {
                                                e.currentTarget.style.borderColor = deptColor;
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
                                        {key}
                                    </button>
                                );
                            })}
                        </div>

                        {/* main character cards grid */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '16px' : '28px'
                        }}>
                            {crewRows.slice(0, visibleRows).map((row, rowIdx) => (
                                <div
                                    key={rowIdx}
                                    className="row-reveal"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                        gap: isMobile ? '16px' : '28px',
                                        width: '100%'
                                    }}
                                >
                                    {row.map((member, colIdx) => {
                                        const globalIdx = filteredCrew.findIndex(c => c.id === member.id);
                                        const isFeatured = globalIdx === featuredIndex;
                                        return (
                                            <CrewCard
                                                key={member.id}
                                                member={member}
                                                isFeatured={isFeatured}
                                                isMobile={isMobile}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Footer Segment */}
                        <div style={{
                            marginTop: '80px',
                            borderTop: '1px solid rgba(0, 229, 255, 0.08)',
                            paddingTop: '32px',
                            textAlign: 'center',
                            fontFamily: "'Orbitron', monospace",
                            letterSpacing: '0.35em',
                            fontSize: 'clamp(7.5px, 1.2vw, 9.5px)',
                            color: 'rgba(0, 229, 255, 0.3)'
                        }}>
                            <div>ALL CREW MEMBERS VERIFIED // MISSION READY</div>
                            <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.4)', textShadow: '0 0 10px rgba(0, 229, 255, 0.2)' }}>
                                SEE YOU AT ADDOVEDI
                            </div>
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '12px',
                                background: '#00E5FF',
                                marginTop: '12px',
                                animation: 'statusPulse 1s ease-in-out infinite'
                            }} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
