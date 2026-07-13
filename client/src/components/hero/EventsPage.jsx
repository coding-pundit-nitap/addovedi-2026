import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { SUB_EVENTS, slugify, CARD_DATA } from '../../three/Scene/HologramCards';
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
    const activeCategorySlug = useStore(s => s.activeCategorySlug);
    const setActiveCategorySlug = useStore(s => s.setActiveCategorySlug);
    const { categoryName, eventName } = useParams();
    const navigate = useNavigate();

    // Form inputs state
    const [teamName, setTeamName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const activeCategory = useMemo(() => {
        if (!categoryName) return null;
        return CARD_DATA.find(c => slugify(c.title) === categoryName) || null;
    }, [categoryName]);

    const activeEvent = useMemo(() => {
        if (!activeCategory || !eventName) return null;
        const eventsList = SUB_EVENTS[activeCategory.title];
        if (!eventsList) return null;
        return eventsList.find(e => slugify(e.title) === eventName) || null;
    }, [activeCategory, eventName]);

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
                    background: activeCategory 
                        ? `radial-gradient(circle at 100% 0%, ${activeCategory.color}88 0%, ${activeCategory.color}25 40%, rgba(0, 0, 0, 0) 75%)`
                        : 'radial-gradient(circle at 100% 0%, rgba(0, 217, 255, 0.55) 0%, rgba(155, 92, 255, 0.2) 40%, rgba(0, 0, 0, 0) 75%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen',
                    transition: 'background 0.5s ease',
                }}
            />

            {/* Glowing screen-space neon light source in the bottom-left corner */}
            <div
                className="absolute bottom-0 left-0 w-[45vw] h-[45vh] pointer-events-none rounded-full"
                style={{
                    background: activeCategory 
                        ? `radial-gradient(circle at 0% 100%, ${activeCategory.color}66 0%, ${activeCategory.color}0a 45%, rgba(0, 0, 0, 0) 75%)`
                        : 'radial-gradient(circle at 0% 100%, rgba(255, 31, 79, 0.45) 0%, rgba(255, 31, 79, 0.05) 45%, rgba(0, 0, 0, 0) 75%)',
                    filter: 'blur(60px)',
                    mixBlendMode: 'screen',
                    transition: 'background 0.5s ease',
                }}
            />

            {/* Subtle high-tech grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: activeCategory 
                        ? `linear-gradient(to right, ${activeCategory.color} 1px, transparent 1px), linear-gradient(to bottom, ${activeCategory.color} 1px, transparent 1px)`
                        : 'linear-gradient(to right, #00d9ff 1px, transparent 1px), linear-gradient(to bottom, #00d9ff 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transition: 'background-image 0.5s ease',
                }}
            />

            {/* Persistent HUD (Always visible) */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-5 pointer-events-auto relative z-10 gap-4">
                {/* Left Side: Festival Title & Flashing Mode Info */}
                <div className="flex items-center gap-4">
                    <span 
                        className="w-3 h-3 rounded-full animate-ping absolute -left-1" 
                        style={{ backgroundColor: activeCategory?.color || '#00d9ff', opacity: 0.8 }} 
                    />
                    <div className="pl-4">
                        <div className="flex items-center gap-2">
                            <p 
                                className="text-xs uppercase tracking-[0.3em] font-black transition-colors duration-300"
                                style={{ color: activeCategory ? `${activeCategory.color}cc` : '#00d9ff99' }}
                            >
                                ADDOVEDI 2026
                            </p>
                            <span 
                                className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest border transition-all duration-300"
                                style={{ 
                                    backgroundColor: activeCategory ? `${activeCategory.color}15` : '#00D9FF15',
                                    color: activeCategory?.color || '#00d9ff',
                                    borderColor: activeCategory ? `${activeCategory.color}35` : '#00d9ff35'
                                }}
                            >
                                DEMO MODE
                            </span>
                        </div>
                        <h1 className="text-white text-2xl md:text-3xl font-black tracking-widest uppercase">
                            SELECT YOUR <span style={{ color: activeCategory?.color || '#ff1f4f' }} className="transition-colors duration-300">DIVISION</span>
                        </h1>
                    </div>
                </div>

                {/* Center: Current Division indicator */}
                <div className="hidden lg:flex flex-col items-center justify-center font-mono">
                    <div style={{ color: activeCategory?.color || '#00d9ff', textShadow: `0 0 10px ${activeCategory?.color || '#00d9ff'}44` }} className="text-sm font-black tracking-[0.25em] transition-all duration-300 uppercase">
                        {activeCategory ? `[ ${activeCategory.title} ]` : '// CHOOSE MISSION TYPE'}
                    </div>
                    <div className="text-[8px] text-white/35 tracking-widest mt-1">
                        {activeCategory ? 'STATUS: INFILTRATING...' : 'LOBBY STATUS: ACTIVE'}
                    </div>
                </div>

                {/* Right Side: Player Profile Widget & Back/Exit Button */}
                <div className="flex items-center gap-6">
                    {/* Gamer Profile HUD */}
                    <div className="hidden sm:flex flex-col items-end border-r border-white/15 pr-6">
                        <div className="flex items-center gap-2 text-white text-xs font-black tracking-widest">
                            <span className="text-white/40">PLAYER:</span>
                            <span>GUEST_RECRUIT_01</span>
                            <span 
                                className="px-1.5 py-0.5 rounded border text-[9px] transition-all duration-300"
                                style={{ 
                                    color: activeCategory?.color || '#9b5cff',
                                    borderColor: activeCategory ? `${activeCategory.color}30` : '#9b5cff30',
                                    backgroundColor: activeCategory ? `${activeCategory.color}10` : '#9b5cff10'
                                }}
                            >
                                LVL 01
                            </span>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className="h-full"
                                    style={{ background: activeCategory ? `linear-gradient(to right, #00d9ff, ${activeCategory.color})` : 'linear-gradient(to right, #00d9ff, #9b5cff)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '42%' }}
                                    transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                                />
                            </div>
                            <span className="text-[9px] font-bold text-white/50 tracking-wider">420/1000 XP</span>
                        </div>
                    </div>

                    {/* Dynamic Navigation button: Back / Exit */}
                    {activeCategory ? (
                        <button
                            onClick={() => {
                                if (activeEvent) {
                                    // if sub-event is open, back goes to category sub-events lobby
                                    navigate(`/event/${categoryName}`);
                                } else {
                                    // back goes to category list lobby
                                    navigate('/event');
                                }
                            }}
                            className="flex items-center gap-2 text-white hover:text-white text-xs uppercase tracking-widest font-black transition-colors px-4 py-2 border rounded-xl"
                            style={{ 
                                borderColor: `${activeCategory.color}40`,
                                background: `${activeCategory.color}10`,
                            }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={handleExit}
                            className="flex items-center gap-2 text-[#00d9ff]/70 hover:text-[#00d9ff] text-xs uppercase tracking-widest font-black transition-colors px-4 py-2 border border-[#00d9ff]/20 rounded-xl bg-[#00d9ff]/5 hover:bg-[#00d9ff]/10"
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Exit Lobby
                        </button>
                    )}
                </div>
            </div>

            {/* Empty Center Space (Fills with 3D Hologram Cards) */}
            <div className="flex-1 w-full" />

            {/* ── DIVISION SELECTOR BUTTONS — Lobby only ── */}
            <AnimatePresence>
            {!activeCategory && !activeEvent && (
                <motion.div
                    key="division-deck"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full max-w-7xl mx-auto pointer-events-auto relative z-10 mb-2"
                >
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {CARD_DATA.map((card, i) => {
                            const isActive = activeCategorySlug === slugify(card.title);
                            const icons = ['⚙', '⌨', '◉', '◈', '⚡', '✦', '⊕'];
                            const ids = ['01','02','03','04','05','06','07'];
                            return (
                                <button
                                    key={card.title}
                                    onClick={() => setActiveCategorySlug(slugify(card.title))}
                                    style={{
                                        flex: 1,
                                        position: 'relative',
                                        background: isActive
                                            ? `linear-gradient(180deg, ${card.color}18 0%, ${card.color}08 100%)`
                                            : 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
                                        border: 'none',
                                        borderTop: isActive ? `2px solid ${card.color}` : '2px solid rgba(255,255,255,0.06)',
                                        borderLeft: isActive ? `1px solid ${card.color}40` : '1px solid rgba(255,255,255,0.05)',
                                        borderRight: isActive ? `1px solid ${card.color}40` : '1px solid rgba(255,255,255,0.05)',
                                        borderBottom: isActive ? `1px solid ${card.color}30` : '1px solid rgba(255,255,255,0.04)',
                                        color: isActive ? card.color : 'rgba(255,255,255,0.35)',
                                        padding: '12px 6px 10px',
                                        fontFamily: 'monospace',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'center',
                                        boxShadow: isActive ? `0 0 20px ${card.color}25, inset 0 0 20px ${card.color}06` : 'none',
                                        clipPath: 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% 100%, 0% 100%, 0% 4px)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderTopColor = `${card.color}80`;
                                            e.currentTarget.style.background = `linear-gradient(180deg, ${card.color}10 0%, transparent 100%)`;
                                            e.currentTarget.style.color = card.color;
                                            e.currentTarget.style.boxShadow = `0 0 14px ${card.color}20`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.06)';
                                            e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                >
                                    {/* Sector ID top-left */}
                                    <div style={{ position: 'absolute', top: '5px', left: '7px', fontSize: '6px', letterSpacing: '0.1em', opacity: isActive ? 0.9 : 0.3, color: isActive ? card.color : '#fff', fontWeight: 900 }}>
                                        SECT_{ids[i]}
                                    </div>

                                    {/* Active indicator dot top-right */}
                                    {isActive && (
                                        <span style={{ position: 'absolute', top: '6px', right: '7px', width: '5px', height: '5px', borderRadius: '50%', background: card.color, boxShadow: `0 0 8px ${card.color}`, display: 'inline-block' }} />
                                    )}

                                    {/* Icon */}
                                    <div style={{ fontSize: '18px', marginBottom: '6px', marginTop: '8px', lineHeight: 1 }}>{icons[i]}</div>

                                    {/* Title */}
                                    <div style={{ fontSize: '7px', letterSpacing: '0.18em', fontWeight: 900, lineHeight: 1.3 }}>
                                        {card.title.replace(' & RC','').replace(' & CS','').replace('GUILD','').replace('ARENA','').trim()}
                                    </div>

                                    {/* Active bottom bar */}
                                    {isActive && (
                                        <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '2px', background: card.color, boxShadow: `0 0 8px ${card.color}` }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>


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
                            className="w-full max-w-6xl bg-[#020202] text-white p-8 relative shadow-[0_0_60px_rgba(0,0,0,0.95)] rounded-none"
                            style={{
                                clipPath: 'polygon(2.2% 0, 97.8% 0, 100% 2.2%, 100% 97.8%, 97.8% 100%, 2.2% 100%, 0 97.8%, 0 2.2%)',
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

                            <EventDetailsModal
                                activeEvent={activeEvent}
                                onClose={handleCloseModal}
                                teamName={teamName}
                                setTeamName={setTeamName}
                                email={email}
                                setEmail={setEmail}
                                contact={contact}
                                setContact={setContact}
                                handleRegisterSubmit={handleRegisterSubmit}
                                isRegistered={isRegistered}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Console Stats (Bottom) */}
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 text-[10px] uppercase font-black tracking-[0.2em] relative z-10 pointer-events-auto gap-2">
                {/* Progress Indicator */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40">
                    <span 
                        onClick={() => navigate('/event')} 
                        className="cursor-pointer hover:text-white transition-colors"
                        style={{ color: !activeCategory ? '#00d9ff' : '' }}
                    >
                        LOBBY
                    </span>
                    {activeCategory && (
                        <>
                            <span>→</span>
                            <span 
                                onClick={() => navigate(`/event/${categoryName}`)} 
                                className="cursor-pointer hover:text-white transition-colors"
                                style={{ color: activeCategory && !activeEvent ? activeCategory.color : '' }}
                            >
                                {activeCategory.title.replace(' & RC', '').replace(' & CS', '')}
                            </span>
                        </>
                    )}
                    {activeEvent && (
                        <>
                            <span>→</span>
                            <span 
                                style={{ color: activeCategory?.color }}
                            >
                                {activeEvent.title}
                            </span>
                        </>
                    )}
                </div>

                <div className="text-white/20 text-center tracking-[0.3em] font-black text-[8px] hidden md:block">
                    TECHFEST LOBBY V2.0.26 · BILBOARD HUD CONSOLE
                </div>

                <div className="text-white/30 text-[9px]">
                    SYSTEM STATUS: <span className="text-green-500">SECURE</span> // DECK_v4.26
                </div>
            </div>
        </motion.div>
    );
}

// ── Tabbed Event Details Modal ───────────────────────────────────────────────
function EventDetailsModal({ activeEvent, onClose, teamName, setTeamName, email, setEmail, contact, setContact, handleRegisterSubmit, isRegistered }) {
    const [activeTab, setActiveTab] = useState('register'); // Default to register

    const TAB_STYLE = (tab) => ({
        color: activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.35)',
        borderBottom: activeTab === tab ? `2px solid ${activeEvent.color}` : '2px solid transparent',
        background: activeTab === tab ? `${activeEvent.color}18` : 'transparent',
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'monospace',
        fontSize: '9px',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontWeight: 900,
        border: 'none',
        outline: 'none',
        whiteSpace: 'nowrap',
        boxShadow: activeTab === tab ? `0 0 12px ${activeEvent.color}30` : 'none',
    });

    const faqs = [
        { q: 'Who is eligible to participate?', a: 'Any college/university student with a valid ID card can register.' },
        { q: 'Is there any registration fee?', a: 'No, entry is completely free for all qualified events.' },
        { q: 'Can I register individually?', a: 'Both individual and team registrations are supported depending on event.' },
        { q: 'When will results be declared?', a: 'Results will be announced on the final day of the techfest.' },
    ];

    const coordinators = [
        { name: 'Dr. Sarah Connor', role: 'Chief Division Marshal', email: 'marshal@addovedi.org', phone: '+91 98765 43210' },
        { name: 'Agent John Doe', role: 'Telemetry Overseer', email: 'overseer@addovedi.org', phone: '+91 87654 32109' },
    ];

    const inputClass = "w-full bg-black/60 border text-white placeholder-white/15 px-5 py-4 text-sm focus:outline-none transition-all duration-300 rounded-none font-mono tracking-wider";
    const inputStyle = { borderColor: `${activeEvent.color}30`, backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%)', backgroundSize: '100% 4px' };
    const onFocus = (e) => { e.target.style.borderColor = activeEvent.color; e.target.style.boxShadow = `0 0 20px ${activeEvent.color}35, inset 0 0 20px ${activeEvent.color}08`; };
    const onBlur  = (e) => { e.target.style.borderColor = `${activeEvent.color}30`; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ display: 'flex', gap: '24px', fontFamily: 'monospace', height: '100%' }}>
            {/* Left Panel - Info / Details */}
            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '20px', borderRight: `1px solid ${activeEvent.color}30`, paddingRight: '24px' }}>
                <div>
                    <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: activeEvent.color, fontWeight: 900, marginBottom: '8px' }}>
                        {'// MISSION_DATA › SECTOR_'}{activeEvent.categoryTitle?.toUpperCase().replace(/\s/g, '_')}
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: 0, textShadow: `0 0 15px ${activeEvent.color}50`, lineHeight: 1.1 }}>
                        {activeEvent.title}
                    </h2>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '12px' }}>
                        {activeEvent.desc}
                    </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                    <div style={{ background: `${activeEvent.color}10`, border: `1px solid ${activeEvent.color}30`, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ ENTRY_FEE ]</span>
                        <span style={{ fontSize: '13px', color: activeEvent.color, fontWeight: 900 }}>FREE</span>
                    </div>
                    <div style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid rgba(255,255,255,0.1)`, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ XP_BOUNTY ]</span>
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 900 }}>{activeEvent.xp}</span>
                    </div>
                    <div style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid rgba(255,255,255,0.1)`, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ RATING ]</span>
                        <span style={{ fontSize: '13px', color: '#ff1f4f', fontWeight: 900 }}>{activeEvent.difficulty}</span>
                    </div>
                    <div style={{ background: `rgba(255,255,255,0.03)`, border: `1px solid rgba(255,255,255,0.1)`, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>[ STATUS ]</span>
                        <span style={{ fontSize: '13px', color: '#28c840', fontWeight: 900 }}>OPEN</span>
                    </div>

                    <button 
                        onClick={onClose}
                        style={{
                            marginTop: '10px',
                            background: 'transparent',
                            border: '1px solid #ff1f4f50',
                            color: '#ff1f4f',
                            padding: '14px',
                            fontSize: '9px',
                            letterSpacing: '0.3em',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
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
                </div>
            </div>

            {/* Right Panel - Segments */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                {/* Terminal Title Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${activeEvent.color}20`, paddingBottom: '10px', marginBottom: '14px', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.25em', color: activeEvent.color }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57', boxShadow: '0 0 6px #ff5f57' }} />
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 6px #febc2e' }} />
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#28c840', boxShadow: '0 0 6px #28c840' }} />
                        <span style={{ marginLeft: '8px', opacity: 0.7 }}>ADDOVEDI_OS // TERMINAL</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28c840', boxShadow: '0 0 8px #28c840', display: 'inline-block' }} />
                        SECURE_COMM_ESTABLISHED
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '22px', overflowX: 'auto' }}>
                    <button style={TAB_STYLE('register')} onClick={() => setActiveTab('register')}>⬡ Register</button>
                    <button style={TAB_STYLE('overview')} onClick={() => setActiveTab('overview')}>◈ Overview</button>
                    <button style={TAB_STYLE('rules')} onClick={() => setActiveTab('rules')}>⊞ Rules</button>
                    <button style={TAB_STYLE('faq')} onClick={() => setActiveTab('faq')}>? FAQ</button>
                    <button style={TAB_STYLE('coords')} onClick={() => setActiveTab('coords')}>⊕ Coords</button>
                </div>

                {/* ── Tab: Overview ── */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'monospace' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${activeEvent.color}20`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px' }}>
                            <div style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 900, color: activeEvent.color, marginBottom: '8px' }}>// ESTIMATED TIMELINE</div>
                            {['10:00 AM — PRE-FLIGHT COMPLIANCE CHECKS', '12:30 PM — MAIN ARENA ENGAGEMENT', '04:30 PM — CORE TELEMETRY EVALUATION'].map((t, i) => (
                                <div key={i} style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', gap: '12px' }}>
                                    <span style={{ color: activeEvent.color }}>{'>'}</span>{t}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '10px' }}>
                            {[['DIVISION', activeEvent.categoryTitle, '#fff'], ['XP BOUNTY', activeEvent.xp, activeEvent.color], ['DIFFICULTY', activeEvent.difficulty, '#ff1f4f']].map(([k, v, c]) => (
                                <div key={k} style={{ flex: 1, padding: '16px', border: `1px solid rgba(255,255,255,0.06)`, background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>{k}</div>
                                    <div style={{ color: c, fontWeight: 900, fontSize: '13px' }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Tab: Rules Directives ── */}
                {activeTab === 'rules' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'monospace' }}>
                        <div style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 900, color: activeEvent.color }}>⊞ DIRECTIVE CODES — MISSION CONSTRAINTS</div>
                        <div style={{ overflowY: 'auto', maxHeight: '300px', paddingRight: '8px' }}>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
                                {(EVENT_RULES[slugify(activeEvent.title)] || GENERAL_RULES).map((rule, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderLeft: `2px solid ${activeEvent.color}40` }}>
                                        <span style={{ color: activeEvent.color, fontWeight: 900, flexShrink: 0 }}>[{String(idx + 1).padStart(2, '0')}]</span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ padding: '12px 16px', background: 'rgba(255,31,79,0.05)', border: '1px solid rgba(255,31,79,0.15)', color: 'rgba(255,31,79,0.7)', fontSize: '10px', letterSpacing: '0.1em' }}>
                            ⚠ All participants must strictly adhere to these directives. Violations result in immediate disqualification.
                        </div>
                    </div>
                )}

                {/* ── Tab: Register Quest ── */}
                {activeTab === 'register' && (
                    <>
                        {!isRegistered ? (
                            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'monospace' }}>
                                <div style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 900, color: activeEvent.color, opacity: 0.8 }}>
                                    {'// INITIATE_REGISTRATION_PROTOCOL'}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '9px', letterSpacing: '0.2em', fontWeight: 900, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: activeEvent.color }}>▸</span>
                                            [ INPUT_CALLSIGN ] // TEAM OR AGENT NAME
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" required placeholder="Enter callsign..." value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                                className={inputClass} style={{ ...inputStyle, textTransform: 'uppercase' }} onFocus={onFocus} onBlur={onBlur}
                                            />
                                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: activeEvent.color, opacity: 0.5, pointerEvents: 'none' }}>ID</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                            <label style={{ fontSize: '9px', letterSpacing: '0.2em', fontWeight: 900, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: activeEvent.color }}>▸</span>
                                                [ EMAIL_COMMLINK ]
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input type="email" required placeholder="agent@domain.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                                    className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                />
                                                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: activeEvent.color, opacity: 0.5, pointerEvents: 'none' }}>@</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                            <label style={{ fontSize: '9px', letterSpacing: '0.2em', fontWeight: 900, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: activeEvent.color }}>▸</span>
                                                [ CONTACT_LINK ]
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input type="tel" required placeholder="+91 XXXXX XXXXX" value={contact} onChange={(e) => setContact(e.target.value)}
                                                    className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                />
                                                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: activeEvent.color, opacity: 0.5, pointerEvents: 'none' }}>TEL</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                    <button type="button" onClick={onClose}
                                        style={{ flex: 1, padding: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
                                    >[ ABORT_SESSION ]</button>
                                    <button type="submit"
                                        style={{ flex: 1, padding: '16px', border: `1px solid ${activeEvent.color}`, background: activeEvent.color, color: '#000000', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 20px ${activeEvent.color}40, 0 0 40px ${activeEvent.color}15` }}
                                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${activeEvent.color}70, 0 0 60px ${activeEvent.color}30`; e.currentTarget.style.transform = 'scale(1.01)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${activeEvent.color}40, 0 0 40px ${activeEvent.color}15`; e.currentTarget.style.transform = 'scale(1)'; }}
                                    >▶ [ EXECUTE_REGISTER ]</button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', fontFamily: 'monospace' }}>
                                <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '24px' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ position: 'absolute', inset: `${i * 12}px`, borderRadius: '50%', border: `1px solid ${activeEvent.color}`, opacity: 0.6 - i * 0.15, boxShadow: `0 0 ${10 - i * 2}px ${activeEvent.color}` }} />
                                    ))}
                                    <div style={{ position: 'absolute', inset: '34px', borderRadius: '50%', background: activeEvent.color, boxShadow: `0 0 30px ${activeEvent.color}80`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                </div>
                                <div style={{ fontSize: '9px', letterSpacing: '0.35em', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                                    REGISTRATION PROTOCOL // VERIFIED
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff', textShadow: `0 0 20px ${activeEvent.color}60`, margin: '0 0 6px 0' }}>
                                    MISSION ACCEPTED
                                </h3>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', lineHeight: 1.8, marginBottom: '24px' }}>
                                    Agent callsign <span style={{ fontWeight: 900, color: activeEvent.color }}>{teamName}</span> enrolled for <span style={{ color: '#fff', fontWeight: 700 }}>{activeEvent.title}</span>. Encrypted schema sent to <span style={{ fontWeight: 900, color: activeEvent.color }}>{email}</span>.
                                </p>
                                <button onClick={onClose}
                                    style={{ padding: '14px 40px', background: 'transparent', border: `1px solid ${activeEvent.color}`, color: activeEvent.color, fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.25em', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 15px ${activeEvent.color}20` }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = `${activeEvent.color}15`; e.currentTarget.style.boxShadow = `0 0 25px ${activeEvent.color}50`; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = `0 0 15px ${activeEvent.color}20`; }}
                                >[ CLOSE_SESSION ]</button>
                            </div>
                        )}
                    </>
                )}

                {/* ── Tab: FAQ Grid ── */}
                {activeTab === 'faq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontFamily: 'monospace', overflowY: 'auto', maxHeight: '300px', paddingRight: '8px' }}>
                        {faqs.map((item, idx) => (
                            <div key={idx} style={{ border: `1px solid rgba(255,255,255,0.06)`, background: 'rgba(0,0,0,0.35)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ fontWeight: 900, fontSize: '10px', color: activeEvent.color, display: 'flex', gap: '8px', letterSpacing: '0.05em' }}>
                                    <span>Q{idx + 1}.</span><span>{item.q}</span>
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, paddingLeft: '22px' }}>{item.a}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Tab: Coordinators ── */}
                {activeTab === 'coords' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'monospace' }}>
                        <div style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 900, color: activeEvent.color }}>⊕ SECURITY TELEMETRY OFFICERS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {coordinators.map((c, idx) => (
                                <div key={idx} style={{ border: `1px solid ${activeEvent.color}20`, background: 'rgba(0,0,0,0.5)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: `3px solid ${activeEvent.color}60` }}>
                                    <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '13px', letterSpacing: '0.05em' }}>{c.name}</div>
                                    <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: activeEvent.color, marginBottom: '8px' }}>{c.role}</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>✉  {c.email}</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>☏  {c.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
