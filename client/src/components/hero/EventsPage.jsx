import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { SUB_EVENTS, slugify } from '../../three/Scene/HologramCards';
import { useRef, useEffect } from 'react';

// Event Rules & Details Directory
const EVENT_RULES = {
    'bug-hunt': [
        'Each team will get 10 bugged code segments to patch.',
        'Languages supported: C, C++, Java, and Python.',
        'Time limit: 60 minutes.',
        'Patched codes must pass all hidden unit test cases.'
    ],
    'byte-code': [
        'Standard algorithmic competitive programming contest.',
        'Individual participation only.',
        'Penalties apply for incorrect submissions.',
        'Rankings determined by score and completion speed.'
    ],
    'web-craft': [
        'Develop a responsive front-end landing page from wireframes.',
        'Allowed stacks: Vanilla React, TailwindCSS, or plain HTML/CSS.',
        'Design components must be clean and responsive.',
        'Submit the repository link before time-limit.'
    ],
    'logic-quest': [
        'Solve 15 core digital logic design problems.',
        'Use of simulators is allowed for validation.',
        'Submit schematic diagrams alongside truth tables.',
        'Ties broken by overall logic minimization efficiency.'
    ],
    'maze-runner': [
        'Configure microcontrollers to navigate a dynamic physical grid.',
        'Sensors must detect wall proximity within 2cm tolerances.',
        'Max 3 trial runs allowed per robot build.',
        'Fastest escape time secures the win.'
    ],
    'robo-wars': [
        'Robots must fit within standard 30x30x30 cm boundaries.',
        'Weight class: strictly under 5.0 kg.',
        'Combat duration: 3 minutes per round.',
        'No projectile or liquid weapons allowed.'
    ],
    'line-runner': [
        'Bot must trace the line strictly on arena floor.',
        'Calibration time is limited to 5 minutes prior to run.',
        'Bonus checkpoints award additional scores.',
        'Leaving the trace line triggers a restart penalty.'
    ],
    'drone-pilot': [
        'Fly drone through 3D obstacle ring course.',
        'Manual piloting strictly required, no GPS lock.',
        'Time begins on takeoff and ends on landing pad touch.',
        'Crashing or ring skips add penalty seconds.'
    ],
    'propel': [
        'Build model aircraft using balsa wood / composite material.',
        'Maximum wingspan: 1.2 meters.',
        'Evaluation based on flight duration and glider ratio.',
        'Structural integrity inspection prior to takeoff.'
    ],
    'truss-build': [
        'Design bridge structures using wood sticks and glues.',
        'Dimensions must conform to console blueprints.',
        'Bridge is loaded weights until structural failure occurs.',
        'Winner chosen by highest load-to-weight ratio.'
    ],
    'pottery-art': [
        'Create clay pottery models based on theme given.',
        'Time allocated: 90 minutes.',
        'Clays and wheels provided at workstation.',
        'Judged on aesthetics, symmetry, and finish.'
    ],
    'valorant': [
        'Standard 5v5 Tactical Shooter double-elimination tournament.',
        'Tournament rules: strictly competitive settings.',
        'No external macros, exploits, or cheating allowed.',
        'Map pools will be decided prior to matches.'
    ],
    'bgmi-crucible': [
        'Standard squad-based battle royale matches.',
        'Points calculated by placing position and kill points.',
        'Tablet/phone controllers only, no emulators.',
        'Device logs may be audited post-match.'
    ],
    'fifa-pro': [
        'Standard 1v1 console matches (PlayStation 5).',
        'Match duration: 6 minutes per half.',
        'Custom tactical formations are allowed.',
        'In case of draw, matches go to extra time and penalties.'
    ]
};

const GENERAL_RULES = [
    'Participants must bring valid university identity credentials.',
    'Strict adherence to schedule timelines is mandatory.',
    'Decision of the judges and coordinators is final.',
    'Certificates will be distributed to verified teams only.'
];

export default function EventsPage() {
    const setIsEntered = useStore(s => s.setIsEntered);
    const setIsEventPage = useStore(s => s.setIsEventPage);
    const { categoryName, eventName } = useParams();
    const navigate = useNavigate();

    // Form inputs state
    const [teamName, setTeamName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    // Resolve event details from URL parameters
    const activeEvent = useMemo(() => {
        if (!categoryName || !eventName) return null;

        const catKey = Object.keys(SUB_EVENTS).find(
            key => slugify(key) === categoryName
        );
        if (!catKey) return null;

        const eventList = SUB_EVENTS[catKey] || [];
        const matched = eventList.find(e => slugify(e.title) === eventName);
        return matched ? { ...matched, categoryTitle: catKey } : null;
    }, [categoryName, eventName]);

    const handleExit = () => {
        setIsEntered(false);
        setIsEventPage(false);
        navigate('/home');
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!teamName || !email) return;
        setIsRegistered(true);
    };

    const handleCloseModal = () => {
        setIsRegistered(false);
        setTeamName('');
        setEmail('');
        setContact('');
        navigate(`/event/${categoryName}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-10 pointer-events-none"
            style={{
                background: 'radial-gradient(circle at center, rgba(3, 5, 18, 0.1) 30%, rgba(3, 5, 18, 0.9) 100%)',
            }}
        >
            {/* Glowing screen-space neon light source in the top-right corner */}
            <div
                className="absolute top-0 right-0 w-[45vw] h-[45vh] pointer-events-none rounded-full"
                style={{
                    background: 'radial-gradient(circle at 100% 0%, rgba(0, 217, 255, 0.55) 0%, rgba(155, 92, 255, 0.2) 40%, rgba(0, 0, 0, 0) 75%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen',
                }}
            />

            {/* Glowing screen-space neon light source in the bottom-left corner (bright red light source) */}
            <div
                className="absolute bottom-0 left-0 w-[45vw] h-[45vh] pointer-events-none rounded-full"
                style={{
                    background: 'radial-gradient(circle at 0% 100%, rgba(255, 31, 79, 0.45) 0%, rgba(255, 31, 79, 0.05) 45%, rgba(0, 0, 0, 0) 75%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen',
                }}
            />

            {/* Subtle high-tech grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #00d9ff 1px, transparent 1px), linear-gradient(to bottom, #00d9ff 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Header HUD (Top) */}
            {!activeEvent && (
                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-5 pointer-events-auto relative z-10 gap-4">

                {/* Left Side: Festival Title & Flashing Mode Info */}
                <div className="flex items-center gap-4">
                    <span className="w-3 h-3 rounded-full bg-[#ff1f4f] animate-ping absolute -left-1" style={{ opacity: 0.8 }} />
                    <div className="pl-4">
                        <div className="flex items-center gap-2">
                            <p className="text-[#00d9ff]/60 text-xs uppercase tracking-[0.3em] font-black">ADDOVEDI 2026</p>
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest bg-[#ff1f4f]/20 text-[#ff1f4f] border border-[#ff1f4f]/35">
                                DEMO MODE
                            </span>
                        </div>
                        <h1 className="text-white text-2xl md:text-3xl font-black tracking-widest uppercase">
                            CAMPAIGN <span className="text-[#ff1f4f]">SELECT</span>
                        </h1>
                    </div>
                </div>

                {/* Right Side: Player Profile Widget & Exit Button */}
                <div className="flex items-center gap-6">
                    {/* Gamer Profile HUD */}
                    <div className="hidden sm:flex flex-col items-end border-r border-white/15 pr-6">
                        <div className="flex items-center gap-2 text-white text-xs font-black tracking-widest">
                            <span className="text-[#00d9ff]/50">PLAYER:</span>
                            <span>GUEST_RECRUIT_01</span>
                            <span className="text-[#9b5cff] bg-[#9b5cff]/10 px-1.5 py-0.5 rounded border border-[#9b5cff]/30 text-[9px]">LVL 01</span>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#00d9ff] to-[#9b5cff]"
                                    initial={{ width: 0 }}
                                    animate={{ width: '42%' }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                                />
                            </div>
                            <span className="text-[9px] font-bold text-white/50 tracking-wider">420/1000 XP</span>
                        </div>
                    </div>

                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 text-[#00d9ff]/70 hover:text-[#00d9ff] text-xs uppercase tracking-widest font-black transition-colors px-4 py-2 border border-[#00d9ff]/20 rounded-xl bg-[#00d9ff]/5 hover:bg-[#00d9ff]/10"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Exit Lobby
                    </button>
                </div>
            </div>
            )}

            {/* Empty Center Space (Fills with 3D Hologram Cards) */}
            <div className="flex-1 w-full" />

            {/* Registration Overlay Modal */}
            <AnimatePresence>
                {activeEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4 pointer-events-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="w-full max-w-6xl bg-[#050a1e] text-white p-12 relative shadow-[0_0_60px_rgba(0,0,0,0.95)] rounded-none"
                            style={{
                                clipPath: 'polygon(2.2% 0, 97.8% 0, 100% 2.2%, 100% 97.8%, 97.8% 100%, 2.2% 100%, 0 97.8%, 0 2.2%)',
                                boxShadow: `0 0 55px ${activeEvent.color}25`,
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%)',
                                backgroundSize: '100% 4px'
                            }}
                        >
                            {/* Glowing SVG outline matching chamfered clipPath */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="cyberLaserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={activeEvent.color} />
                                        <stop offset="50%" stopColor="#00f0ff" />
                                        <stop offset="100%" stopColor="#ff00c8" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points="2.2 0, 97.8 0, 100 2.2, 100 97.8, 97.8 100, 2.2 100, 0 97.8, 0 2.2"
                                    fill="none"
                                    stroke={activeEvent.color}
                                    strokeWidth="0.8"
                                    style={{ filter: `drop-shadow(0 0 5px ${activeEvent.color})` }}
                                    className="opacity-75"
                                />
                                {/* Laser light circling the border path */}
                                <polygon
                                    points="2.2 0, 97.8 0, 100 2.2, 100 97.8, 97.8 100, 2.2 100, 0 97.8, 0 2.2"
                                    fill="none"
                                    stroke="url(#cyberLaserGrad)"
                                    strokeWidth="1.5"
                                    strokeDasharray="25 75"
                                    style={{
                                        animation: 'sciFiBorderRun 4s linear infinite, rotateHue 6s linear infinite'
                                    }}
                                />
                            </svg>
                            <style>{`
                                @keyframes sciFiBorderRun {
                                    0% { stroke-dashoffset: 100; }
                                    100% { stroke-dashoffset: 0; }
                                }
                                @keyframes rotateHue {
                                    0% { filter: hue-rotate(0deg) drop-shadow(0 0 6px ${activeEvent.color}); }
                                    50% { filter: hue-rotate(180deg) drop-shadow(0 0 10px #9b5cff); }
                                    100% { filter: hue-rotate(360deg) drop-shadow(0 0 6px ${activeEvent.color}); }
                                }
                            `}</style>

                            {/* Inset tech framing lines */}
                            <div
                                className="absolute pointer-events-none opacity-20 inset-2 border"
                                style={{
                                    borderColor: activeEvent.color,
                                    clipPath: 'polygon(2.2% 0, 97.8% 0, 100% 2.2%, 100% 97.8%, 97.8% 100%, 2.2% 100%, 0 97.8%, 0 2.2%)'
                                }}
                            />

                            {/* Blinking LED status indicator lights at bevel points */}
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

                            {/* Cyber Terminal Title Bar */}
                            <div className="flex justify-between items-center border-b pb-3 mb-6 font-mono text-[10px] tracking-[0.25em]" style={{ borderColor: `${activeEvent.color}25`, color: activeEvent.color }}>
                                <div>LOBBY // SECURE_ENROLLMENT_DECK_v4.26</div>
                                <div className="animate-pulse flex items-center gap-1.5 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    SECURE_COMM_ESTABLISHED
                                </div>
                            </div>

                            {!isRegistered ? (
                                <form onSubmit={handleRegisterSubmit} className="flex flex-col md:flex-row gap-8 font-mono">
                                    {/* Left Column: Form Inputs */}
                                    <div className="flex flex-col gap-6 w-full md:w-[58%]">
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.25em] font-black mb-2" style={{ color: activeEvent.color }}>
                                                // INITIATE REGISTRATION PROTOCOL
                                            </p>
                                            <h2 className="text-3xl md:text-4xl font-black tracking-wider uppercase text-white">
                                                {activeEvent.title}
                                            </h2>
                                            <p className="text-white/45 text-sm mt-3 leading-relaxed font-sans font-medium">
                                                {activeEvent.desc}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-5 font-mono text-sm mt-4">
                                            {/* Callsign Input */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-white/50">
                                                    [ INPUT_CALLSIGN ] // TEAM OR AGENT NAME
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Enter callsign"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    className="w-full bg-black/45 border text-white placeholder-white/20 px-5 py-4 text-sm focus:outline-none transition-all duration-300 rounded-none uppercase tracking-wider"
                                                    style={{
                                                        borderColor: `${activeEvent.color}30`
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = activeEvent.color;
                                                        e.target.style.boxShadow = `0 0 10px ${activeEvent.color}40`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = `${activeEvent.color}30`;
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Commlink Email Input */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-white/50">
                                                    [ EMAIL_COMMLINK ] // LEADER EMAIL
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="agent@domain.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-black/45 border text-white placeholder-white/20 px-5 py-4 text-sm focus:outline-none transition-all duration-300 rounded-none tracking-wider"
                                                    style={{
                                                        borderColor: `${activeEvent.color}30`
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = activeEvent.color;
                                                        e.target.style.boxShadow = `0 0 10px ${activeEvent.color}40`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = `${activeEvent.color}30`;
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Contact Number Input */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-white/50">
                                                    [ CONTACT_LINK ] // MOBILE CONNECTION
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="+91 XXXXX XXXXX"
                                                    value={contact}
                                                    onChange={(e) => setContact(e.target.value)}
                                                    className="w-full bg-black/45 border text-white placeholder-white/20 px-5 py-4 text-sm focus:outline-none transition-all duration-300 rounded-none tracking-wider"
                                                    style={{
                                                        borderColor: `${activeEvent.color}30`
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = activeEvent.color;
                                                        e.target.style.boxShadow = `0 0 10px ${activeEvent.color}40`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = `${activeEvent.color}30`;
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-6 mt-6">
                                            <button
                                                type="button"
                                                onClick={handleCloseModal}
                                                className="w-1/2 py-4 border rounded-none uppercase tracking-[0.2em] text-xs font-black transition-all duration-300"
                                                style={{
                                                    borderColor: 'rgba(255,255,255,0.1)',
                                                    color: 'rgba(255,255,255,0.5)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                                    e.target.style.color = '#ffffff';
                                                    e.target.style.background = 'rgba(255,255,255,0.02)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                                    e.target.style.color = 'rgba(255,255,255,0.5)';
                                                    e.target.style.background = 'transparent';
                                                }}
                                            >
                                                [ ABORT_SESSION ]
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-1/2 py-4 text-black rounded-none uppercase tracking-[0.2em] text-xs font-black transition-all duration-300"
                                                style={{
                                                    background: activeEvent.color,
                                                    boxShadow: `0 0 15px ${activeEvent.color}40`
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.boxShadow = `0 0 25px ${activeEvent.color}70`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.boxShadow = `0 0 15px ${activeEvent.color}40`;
                                                }}
                                            >
                                                [ EXECUTE_REGISTER ]
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Column: Cyber Telemetry & Log Stream */}
                                    <div className="flex flex-col gap-6 w-full md:w-[42%] border-t md:border-t-0 md:border-l pt-8 md:pt-0 md:pl-10" style={{ borderColor: `${activeEvent.color}15` }}>
                                        {/* Telemetry metadata */}
                                        <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 p-5 text-xs">
                                            <div className="flex justify-between tracking-wider">
                                                <span className="text-white/40">DIVISION_ROOT:</span>
                                                <span className="text-white font-bold">{activeEvent.categoryTitle}</span>
                                            </div>
                                            <div className="flex justify-between tracking-wider">
                                                <span className="text-white/40">XP_BOUNTY:</span>
                                                <span className="font-bold" style={{ color: activeEvent.color }}>{activeEvent.xp}</span>
                                            </div>
                                            <div className="flex justify-between tracking-wider">
                                                <span className="text-white/40">MISSION_RATING:</span>
                                                <span className="font-bold tracking-widest text-[#ff1f4f]">{activeEvent.difficulty}</span>
                                            </div>
                                        </div>

                                        {/* Event Rules & Details */}
                                        <div className="flex flex-col gap-4 flex-1 font-mono text-xs text-white/50 border border-white/5 bg-black/60 p-6 overflow-y-auto" style={{ maxHeight: '320px' }}>
                                            <div className="text-xs uppercase tracking-widest font-black mb-2" style={{ color: activeEvent.color }}>
                                                // DIRECTIVE CODE_RULES
                                            </div>
                                            <ul className="list-none flex flex-col gap-4">
                                                {(EVENT_RULES[slugify(activeEvent.title)] || GENERAL_RULES).map((rule, idx) => (
                                                    <li key={idx} className="flex gap-3 leading-relaxed">
                                                        <span style={{ color: activeEvent.color }}>[{idx + 1}]</span>
                                                        <span>{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-10 font-mono">
                                    <div className="w-16 h-16 rounded-none flex items-center justify-center border-2 mb-6 animate-pulse" style={{ borderColor: activeEvent.color, boxShadow: `0 0 20px ${activeEvent.color}40` }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={activeEvent.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] font-black mb-1.5 text-white/40">
                                        REGISTRATION PROTOCOL // VERIFIED
                                    </p>
                                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white mb-2">
                                        SYSTEM LOCKED & ENROLLED
                                    </h3>
                                    <p className="text-xs text-white/50 max-w-md font-sans leading-relaxed mb-8">
                                        Agent callsign <span className="font-mono font-bold" style={{ color: activeEvent.color }}>{teamName}</span> has been secure-registered for <span className="text-white font-bold">{activeEvent.title}</span>. Decrypted event schema synced to commlink <span className="font-mono font-bold" style={{ color: activeEvent.color }}>{email}</span>.
                                    </p>
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-10 py-3 text-black rounded-none uppercase tracking-[0.2em] text-[10px] font-black transition-all duration-300"
                                        style={{
                                            background: activeEvent.color,
                                            boxShadow: `0 0 15px ${activeEvent.color}40`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.boxShadow = `0 0 25px ${activeEvent.color}70`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.boxShadow = `0 0 15px ${activeEvent.color}40`;
                                        }}
                                    >
                                        [ CLOSE_SESSION ]
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Console Stats (Bottom) */}
            {!activeEvent && (
                <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 text-[10px] uppercase font-black text-white/30 tracking-[0.2em] relative z-10 pointer-events-auto gap-2">
                    <div>SYSTEM LOG: SECURE // WEAPON_蓝色_bluePRINT_DIAG_OK</div>
                    <div className="text-[#00d9ff]/40 text-center tracking-[0.3em] font-black">
                        TECHFEST LOBBY V2.0.26 · BILBOARD HUD CONSOLE
                    </div>
                    <div>LOBBY SECTOR: ASIA_PACIFIC_S1</div>
                </div>
            )}
        </motion.div>
    );
}
