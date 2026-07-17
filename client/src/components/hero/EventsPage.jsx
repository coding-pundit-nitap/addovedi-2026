import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import { SUB_EVENTS, slugify, CARD_DATA } from '../../three/Scene/HologramCards';

const API_BASE = window.location.origin.includes('localhost:5173')
    ? 'http://localhost:5001/api'
    : '/api';

// Event Rules & Details Directory
const EVENT_RULES = {
    'bug-hunt': [
        'Each team will get 10 bugged code segments to patch.',
        'Languages supported: C, C++, Java, and Python.',
        'Time limit: 60 minutes.',
        'Patched codes must pass all hidden unit test cases.',
        'No external compilers or IDEs are permitted; must use the sandbox terminal.',
        'Internet access is restricted to official documentation pages.',
        'Submission can be done multiple times, but only the last one counts.',
        'Sharing solutions or collaboration between different teams will result in instant disqualification.',
        'Pre-written code snippets or external libraries cannot be imported.',
        'Final scores will be compiled automatically based on execution speed and memory limits.',
        'Decisions of the evaluation panel are absolute and final.'
    ],
    'byte-code': [
        'Standard algorithmic competitive programming contest.',
        'Individual participation only.',
        'Penalties apply for incorrect submissions.',
        'Rankings determined by score and completion speed.',
        'The platform supports Python 3.x, C++17, and Java 17.',
        'Plagiarism checks will be conducted post-event on all submissions.',
        'In case of identical submission times, the participant with fewer penalties ranks higher.',
        'No external communication devices or messaging platforms are allowed during the run.',
        'System resources are capped at 512MB RAM per sandbox compiler execution.',
        'All challenges will have subtask scoring enabled.',
        'Unusual network patterns will trigger automated session lockout.'
    ],
    'web-craft': [
        'Develop a responsive front-end landing page from wireframes.',
        'Allowed stacks: Vanilla React, TailwindCSS, or plain HTML/CSS.',
        'Design components must be clean and responsive.',
        'Submit the repository link before time-limit.',
        'External assets must be hosted on public CDNs or included locally.',
        'Layouts will be tested across Chrome, Firefox, and Safari viewports.',
        'Use of UI component libraries like shadcn or Material UI is prohibited.',
        'Codebase must be documented with brief component-level instructions.',
        'Vite should be used as the build tool for React submissions.',
        'Design fidelity to the provided Figma wireframe counts for 40% of marks.',
        'No AI code generation tools are permitted during active building phases.'
    ],
    'logic-quest': [
        'Solve 15 core digital logic design problems.',
        'Use of simulators is allowed for validation.',
        'Submit schematic diagrams alongside truth tables.',
        'Ties broken by overall logic minimization efficiency.',
        'Allowed simulators: Logisim-evolution, Digital, or Multisim.',
        'All truth tables must be completed in standard SOP form.',
        'Gates must conform to standard IEEE schematic symbols.',
        'Late submissions face a penalty of 10% score reduction per 5 minutes.',
        'Group discussions are strictly disallowed during problem solving.',
        'Hardware description language (Verilog/VHDL) code must compile without warnings.',
        'Only standard library components can be used in schematic designs.'
    ],
    'maze-runner': [
        'Configure microcontrollers to navigate a dynamic physical grid.',
        'Sensors must detect wall proximity within 2cm tolerances.',
        'Max 3 trial runs allowed per robot build.',
        'Fastest escape time secures the win.',
        'Microcontroller must be programmed on-board, no wireless control allowed.',
        'Chassis size must not exceed 20x20 cm footprint.',
        'Power source is limited to a maximum of 12V DC.',
        'The maze configuration will be altered slightly before each official run.',
        'Manual intervention during an active run results in run cancellation.',
        'Infrared or Ultrasonic sensor calibration must be done in the designated pit area.',
        'Ties will be broken by the robot weight (lighter robot wins).'
    ],
    'robo-wars': [
        'Robots must fit within standard 30x30x30 cm boundaries.',
        'Weight class: strictly under 5.0 kg.',
        'Combat duration: 3 minutes per round.',
        'No projectile or liquid weapons allowed.',
        'Pneumatic and hydraulic systems are capped at 10 Bar pressure.',
        'Remote control must operate on standard 2.4GHz interference-free bands.',
        'All robots must have an accessible master kill switch.',
        'Arena walls must not be intentionally damaged by weapon systems.',
        'Decisions are based on aggression, damage, and control if time expires.',
        'Battery packs must be securely shielded from direct kinetic impacts.',
        'Violation of safety checks during inspection leads to immediate disqualification.'
    ],
    'line-runner': [
        'Bot must trace the line strictly on arena floor.',
        'Calibration time is limited to 5 minutes prior to run.',
        'Bonus checkpoints award additional scores.',
        'Leaving the trace line triggers a restart penalty.',
        'Bots must be fully autonomous; wireless transceivers must be disabled.',
        'The track width will be exactly 30mm black line on white surface.',
        'Maximum bot size is limited to 15x15 cm.',
        'No sticky materials or adhesives allowed on the wheels.',
        'The track will feature sharp turns, acute angles, and a grid intersection.',
        'Each bot gets a maximum of 2 official timed attempts.',
        'Fastest complete loop run determines the winner.'
    ],
    'drone-pilot': [
        'Fly drone through 3D obstacle ring course.',
        'Manual piloting strictly required, no GPS lock.',
        'Time begins on takeoff and ends on landing pad touch.',
        'Crashing or ring skips add penalty seconds.',
        'Drones must fit within a 250mm diagonal wheel-base class.',
        'First-person view (FPV) goggles or line-of-sight flying is allowed.',
        'All prop guards must be securely mounted and inspected.',
        'Battery size limit is capped at 4S LiPo batteries.',
        'Skips on consecutive obstacle gates will lead to disqualification.',
        'Pilots must use standard analog or digital video links on authorized bands.',
        'In case of tie, pilot with fewer crash restarts wins.'
    ],
    'propel': [
        'Build model aircraft using balsa wood / composite material.',
        'Maximum wingspan: 1.2 meters.',
        'Evaluation based on flight duration and glider ratio.',
        'Structural integrity inspection prior to takeoff.',
        'Aircraft must be unpowered (pure glider) or rubber-band powered.',
        'Use of ready-made foam planes or commercial kits is prohibited.',
        'Launch must be done manually from the designated platform.',
        'Maximum takeoff weight must be under 800 grams.',
        'Aircraft must demonstrate stable flight for at least 5 seconds to score.',
        'Repairing models between rounds is allowed within 10 minutes.',
        'Judges base extra points on structural innovation and aerodynamic efficiency.'
    ],
    'truss-build': [
        'Design bridge structures using wood sticks and glues.',
        'Dimensions must conform to console blueprints.',
        'Bridge is loaded weights until structural failure occurs.',
        'Winner chosen by highest load-to-weight ratio.',
        'Materials provided: 100 popsicle sticks and standard wood glue.',
        'Span of the bridge must be exactly 400mm.',
        'Bridges must allow a load hanger to be attached at the center.',
        'Glue can only be used at joints, coating sticks is not allowed.',
        'Maximum weight of the completed structure must not exceed 150g.',
        'Bridges will dry in a designated curing chamber for 12 hours.',
        'All dimensions will be verified using go/no-go gauges prior to loading.'
    ],
    'pottery-art': [
        'Create clay pottery models based on theme given.',
        'Time allocated: 90 minutes.',
        'Clays and wheels provided at workstation.',
        'Judged on aesthetics, symmetry, and finish.',
        'Maximum height of the model must be under 30 cm.',
        'Only tools provided by the coordinators are allowed.',
        'Participants can choose between hand-building or wheel-throwing.',
        'Cracked structures during drying will lose points on structural integrity.',
        'No external paints or coloring agents can be used.',
        'Originality and interpretation of the theme carries 40% weight.',
        'Coordinators will bake the pieces for final inspection.'
    ],
    'valorant': [
        'Standard 5v5 Tactical Shooter double-elimination tournament.',
        'Tournament rules: strictly competitive settings.',
        'No external macros, exploits, or cheating allowed.',
        'Map pools will be decided prior to matches.',
        'All matches will be played on Mumbai servers.',
        'Teams must check-in at least 15 minutes before scheduled match.',
        'Tactical timeouts are limited to two 60-second pauses per map.',
        'Use of in-game chat for toxic behavior will lead to warnings or match loss.',
        'Players must bring their own gaming peripherals (mouse/keyboard/headset).',
        'Coaches are only allowed to talk during tactical timeouts.',
        'Substitute players must be registered before the tournament begins.'
    ],
    'bgmi-crucible': [
        'Standard squad-based battle royale matches.',
        'Points calculated by placing position and kill points.',
        'Tablet/phone controllers only, no emulators.',
        'Device logs may be audited post-match.',
        'Matches will be hosted on Erangel, Miramar, and Sanhok maps.',
        'Use of triggers, trigger buttons, or custom cooling attachments is prohibited.',
        'Any disconnects due to personal internet issues will not trigger a match restart.',
        'Stream sniping or screen sharing is strictly forbidden.',
        'Teams must consist of exactly 4 players plus 1 optional sub.',
        'Tie-breakers will favor the team with higher total placement points.',
        'Decisions of the match marshals are final and non-negotiable.'
    ],
    'fifa-pro': [
        'Standard 1v1 console matches (PlayStation 5).',
        'Match duration: 6 minutes per half.',
        'Custom tactical formations are allowed.',
        'In case of draw, matches go to extra time and penalties.',
        'All matches will be played in Kick-Off mode using standard teams.',
        'Wireless controller configurations must be checked before kickoff.',
        'Pausing is only allowed when the ball is out of play.',
        'Intentional time-wasting in defense will lead to warnings.',
        'Peripherals must be connected via USB cable to prevent sync lag.',
        'Tactical defending mode must be turned ON.',
        'Legacy defending settings are strictly disallowed.'
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
    const [leaderName, setLeaderName] = useState('');
    const [leaderUID, setLeaderUID] = useState('');
    const [leaderPhone, setLeaderPhone] = useState('');
    const [teamSize, setTeamSize] = useState(1);
    const [members, setMembers] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const requiredCount = Math.max(0, teamSize - 1);
        setMembers(prev => {
            const next = [...prev];
            if (next.length < requiredCount) {
                while (next.length < requiredCount) {
                    next.push({ name: '', uid: '' });
                }
            } else if (next.length > requiredCount) {
                next.splice(requiredCount);
            }
            return next;
        });
    }, [teamSize]);
    const isSidebarOpen = useStore(s => s.isSidebarOpen);
    const setIsSidebarOpen = useStore(s => s.setIsSidebarOpen);
    const isMobile = window.innerWidth < 768;

    const [categoriesList, setCategoriesList] = useState(CARD_DATA);
    const [subEventsData, setSubEventsData] = useState(SUB_EVENTS);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    // Fetch dynamic database categories/sub-events on boot
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE}/events`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.categories && data.categories.length > 0) {
                        const mappedCats = data.categories.map(c => ({
                            title: c.title,
                            subtitle: c.subtitle,
                            desc: c.desc,
                            color: c.color,
                            xp: c.xp,
                            difficulty: c.difficulty
                        }));
                        setCategoriesList(mappedCats);

                        const mappedSubs = {};
                        data.categories.forEach(c => {
                            mappedSubs[c.title] = [];
                        });
                        data.subEvents.forEach(s => {
                            if (!mappedSubs[s.categoryTitle]) mappedSubs[s.categoryTitle] = [];
                            mappedSubs[s.categoryTitle].push({
                                title: s.title,
                                subtitle: s.subtitle,
                                desc: s.desc,
                                color: s.color,
                                xp: s.xp,
                                difficulty: s.difficulty,
                                heads: s.heads || []
                            });
                        });
                        setSubEventsData(mappedSubs);
                    }
                }
            } catch (err) {
                console.log("Failed dynamic event fetch, utilizing fallbacks");
            }
        };
        fetchEvents();
    }, []);

    const activeCategory = useMemo(() => {
        if (!categoryName) return null;
        return categoriesList.find(c => slugify(c.title) === categoryName) || null;
    }, [categoryName, categoriesList]);

    const activeEvent = useMemo(() => {
        if (!activeCategory || !eventName) return null;
        const eventsList = subEventsData[activeCategory.title];
        if (!eventsList) return null;
        return eventsList.find(e => slugify(e.title) === eventName) || null;
    }, [activeCategory, eventName, subEventsData]);

    const handleExit = () => {
        setIsEntered(false);
        setIsEventPage(false);
        navigate('/home');
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!teamName || !leaderName || !leaderUID || !leaderPhone) return;
        setIsRegistered(true);
    };

    const handleCloseModal = () => {
        setIsRegistered(false);
        setTeamName('');
        setLeaderName('');
        setLeaderUID('');
        setLeaderPhone('');
        setTeamSize(1);
        setMembers([]);
        navigate(`/event/${categoryName}`);
    };

    const btnThemeStyles = {
        '--btn-color-light': activeCategory?.color ? '#ffffff' : '#67e8f9',
        '--btn-color-mid': activeCategory?.color ? activeCategory.color : '#06b6d4',
        '--btn-color-dark': activeCategory?.color ? `${activeCategory.color}cc` : '#0891b2',
        '--btn-color-glow': activeCategory?.color ? activeCategory.color : '#00D9FF',
        '--glow-color-35': activeCategory?.color ? `${activeCategory.color}59` : 'rgba(0,217,255,0.35)',
        '--glow-color-15': activeCategory?.color ? `${activeCategory.color}26` : 'rgba(0,217,255,0.15)',
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .cyber-rules-scrollbar {
                    scroll-behavior: smooth;
                }
                .cyber-rules-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .cyber-rules-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                }
                .cyber-rules-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--active-rules-color, #00d9ff);
                    border-radius: 10px;
                }
                .cyber-rules-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ffffff;
                }
                @keyframes border-flow {
                    0%   { background-position: 0% 50%; }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 6px #00D9FF); }
                    50%       { opacity: 1;   filter: drop-shadow(0 0 14px #00D9FF) drop-shadow(0 0 28px #00D9FF); }
                }
                .event-reg-btn-wrap {
                    position: relative;
                    display: inline-block;
                    pointer-events: auto;
                }
                .event-reg-btn {
                    position: relative;
                    font-family: 'Orbitron', monospace;
                    font-size: 0.5rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #fff;
                    padding: 6px 8px;
                    overflow: hidden;
                    clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
                    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
                    box-shadow: 0 0 14px var(--glow-color-35), 0 0 28px var(--glow-color-15);
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .event-reg-btn:hover {
                    transform: scale(1.05) translateY(-1px);
                }
                .event-reg-fill {
                    position: absolute;
                    inset: 1.5px;
                    clip-path: polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px);
                    background: linear-gradient(90deg, var(--btn-color-dark) 0%, var(--btn-color-mid) 35%, var(--btn-color-glow) 70%, var(--btn-color-light) 100%);
                    transform-origin: left center;
                    transform: scaleX(0);
                    transition: transform 0.42s cubic-bezier(0.16,1,0.3,1);
                    pointer-events: none;
                }
                .event-reg-btn:hover .event-reg-fill {
                    transform: scaleX(1);
                }
                .event-logo-title {
                    font-family: 'Orbitron', monospace;
                    font-weight: 900;
                    font-size: 0.85rem;
                    letter-spacing: 0.12em;
                    background: linear-gradient(90deg, #00D9FF 0%, #a8f0ff 50%, #00D9FF 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 10px rgba(0,217,255,0.7));
                    transition: all 0.3s ease;
                }
                .event-demo-badge {
                    font-family: 'Orbitron', monospace;
                    font-size: 7px;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    background-color: #00D9FF15;
                    color: #00d9ff;
                    border: 1px solid #00d9ff35;
                    padding: 2px 5px;
                    border-radius: 4px;
                    margin-left: 6px;
                    display: inline-block;
                }
                .event-division-sub {
                    font-family: 'Orbitron', monospace;
                    font-size: 8px;
                    letter-spacing: 0.1em;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: #ffffff;
                    transition: all 0.3s ease;
                }
                @media (min-width: 640px) {
                    .event-reg-btn {
                        font-size: 0.65rem;
                        letter-spacing: 0.28em;
                        padding: 10px 24px;
                    }
                    .event-logo-title {
                        font-size: 1.15rem;
                        letter-spacing: 0.22em;
                    }
                    .event-demo-badge {
                        font-size: 8px;
                        letter-spacing: 0.15em;
                        padding: 2px 6px;
                        margin-left: 8px;
                    }
                    .event-division-sub {
                        font-size: 9px;
                        letter-spacing: 0.18em;
                    }
                }
                .event-card-cyber-wrap {
                    position: relative;
                    clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
                    background: var(--card-border-color, rgba(255,255,255,0.1));
                    padding: 1.5px;
                    pointer-events: auto;
                    transition: transform 0.2s ease, filter 0.3s ease;
                }
                .event-card-cyber-wrap:hover {
                    transform: translateY(-2px);
                }
                .event-card-cyber-inner {
                    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
                    background: rgba(2, 10, 22, 0.85);
                    backdrop-filter: blur(12px);
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .category-para-btn-wrap {
                    position: relative;
                    padding: 2.2px;
                    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
                    background: var(--btn-border-color, rgba(0, 217, 255, 0.25));
                    transition: transform 0.2s ease, filter 0.3s ease;
                }
                .category-para-btn-inner {
                    clip-path: polygon(9.5px 0%, 100% 0%, calc(100% - 9.5px) 100%, 0% 100%);
                    background: rgba(4, 18, 34, 0.95);
                    padding: 9px 18px 9px 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: "'Rajdhani', sans-serif";
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.8);
                    transition: all 0.2s ease;
                }
                `
            }} />
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
                {/* Desktop Top Bar (Hidden on Mobile) */}
                <div className="hidden md:flex w-full max-w-7xl mx-auto flex-row items-center justify-between py-5 px-0 pointer-events-auto relative z-10 gap-2">
                    {/* Left Side: Brand Logo & Status */}
                    <div className="flex items-center gap-3 font-mono relative z-10 pl-4">
                        {/* Radar circle pulse animation icon */}
                        <div className="relative hidden sm:block" style={{ animation: 'glow-pulse 2.8s ease-in-out infinite' }}>
                            <svg className="w-10 h-10 text-[#00D9FF]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" />
                                <circle cx="50" cy="50" r="32" strokeWidth="1" />
                                <circle cx="50" cy="50" r="24" strokeWidth="1.5" strokeDasharray="10 5" />
                                <circle cx="50" cy="50" r="14" strokeWidth="1.2" />
                                <path d="M 50 14 L 50 24 M 50 76 L 50 86 M 14 50 L 24 50 M 76 50 L 86 50" strokeWidth="1.5" />
                                <circle cx="50" cy="50" r="4.5" fill="#00D9FF" />
                            </svg>
                            <div className="absolute inset-0 bg-[#00D9FF]/10 rounded-full blur-lg" />
                        </div>
                        <div className="flex flex-col pl-1 md:pl-2">
                            <div className="flex items-center leading-none">
                                <span className="event-logo-title">
                                    GAMING ARENA
                                </span>
                                <span className="event-demo-badge">
                                    DEMO MODE
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 leading-none mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{
                                        backgroundColor: activeCategory?.color || '#00d9ff',
                                        boxShadow: `0 0 6px ${activeCategory?.color || '#00d9ff'}`
                                    }}
                                />
                                <span
                                    className="event-division-sub"
                                    style={{
                                        textShadow: activeCategory ? `0 0 8px ${activeCategory.color}` : '0 0 8px rgba(0,217,255,0.7)'
                                    }}
                                >
                                    {activeCategory ? (
                                        <>
                                            {activeCategory.title.replace(' & RC', '').replace(' & CS', '').replace('GUILD', '').replace('ARENA', '').trim()}
                                        </>
                                    ) : (
                                        'SELECT DIVISION'
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Player Profile Widget & Back/Exit Button */}
                    <div className="flex items-center gap-6">
                        {/* Gamer Profile HUD */}
                        <div className="flex flex-col items-end border-r border-white/15 pr-6">
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
                            <div className="event-reg-btn-wrap" style={btnThemeStyles}>
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
                                    aria-label="Go back to previous menu"
                                    className="event-reg-btn group"
                                >
                                    {/* Border: animated gradient */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: activeCategory
                                                ? `linear-gradient(135deg, ${activeCategory.color} 0%, #ffffff 50%, ${activeCategory.color} 100%)`
                                                : 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                            backgroundSize: '250% 250%',
                                            animation: 'border-flow 2.8s ease infinite',
                                        }}
                                    />
                                    {/* Inner dark base panel */}
                                    <div
                                        className="absolute"
                                        style={{
                                            inset: '1.5px',
                                            clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                            background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                        }}
                                    />
                                    {/* Sliding fill on hover */}
                                    <span className="event-reg-fill" />
                                    {/* Label & Icon */}
                                    <div className="relative z-10 flex items-center gap-1.5 font-bold">
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span style={{ textShadow: activeCategory ? `0 0 10px ${activeCategory.color}` : '0 0 10px rgba(0,217,255,0.8)' }}>
                                            Back
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="event-reg-btn-wrap" style={btnThemeStyles}>
                                <button
                                    onClick={handleExit}
                                    aria-label="Exit Lobby to landing page"
                                    className="event-reg-btn group"
                                >
                                    {/* Border: animated gradient */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                            backgroundSize: '250% 250%',
                                            animation: 'border-flow 2.8s ease infinite',
                                        }}
                                    />
                                    {/* Inner dark base panel */}
                                    <div
                                        className="absolute"
                                        style={{
                                            inset: '1.5px',
                                            clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                            background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                        }}
                                    />
                                    {/* Sliding fill on hover */}
                                    <span className="event-reg-fill" />
                                    {/* Label & Icon */}
                                    <div className="relative z-10 flex items-center gap-1.5 font-bold">
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span style={{ textShadow: '0 0 10px rgba(0,217,255,0.8)' }}>
                                            Exit Lobby
                                        </span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Top Bar (Visible on Mobile/Tablet only) */}
                <div className="relative flex md:hidden w-[calc(100%+3rem)] -mx-6 items-center justify-center py-3 px-4 pointer-events-auto z-10">
                    {/* Left Corner: Back/Exit Button */}
                    <div className="absolute left-4 z-20 flex justify-start pointer-events-auto">
                        {activeCategory ? (
                            <div className="event-reg-btn-wrap" style={btnThemeStyles}>
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
                                    aria-label="Go back to previous menu"
                                    className="event-reg-btn group"
                                >
                                    {/* Border: animated gradient */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: activeCategory
                                                ? `linear-gradient(135deg, ${activeCategory.color} 0%, #ffffff 50%, ${activeCategory.color} 100%)`
                                                : 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                            backgroundSize: '250% 250%',
                                            animation: 'border-flow 2.8s ease infinite',
                                        }}
                                    />
                                    {/* Inner dark base panel */}
                                    <div
                                        className="absolute"
                                        style={{
                                            inset: '1.5px',
                                            clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                            background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                        }}
                                    />
                                    {/* Sliding fill on hover */}
                                    <span className="event-reg-fill" />
                                    {/* Label & Icon */}
                                    <div className="relative z-10 flex items-center gap-1 font-bold">
                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span style={{ textShadow: activeCategory ? `0 0 10px ${activeCategory.color}` : '0 0 10px rgba(0,217,255,0.8)' }}>
                                            Back
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="event-reg-btn-wrap" style={btnThemeStyles}>
                                <button
                                    onClick={handleExit}
                                    aria-label="Exit Lobby to landing page"
                                    className="event-reg-btn group"
                                >
                                    {/* Border: animated gradient */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                            backgroundSize: '250% 250%',
                                            animation: 'border-flow 2.8s ease infinite',
                                        }}
                                    />
                                    {/* Inner dark base panel */}
                                    <div
                                        className="absolute"
                                        style={{
                                            inset: '1.5px',
                                            clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                            background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                                        }}
                                    />
                                    {/* Sliding fill on hover */}
                                    <span className="event-reg-fill" />
                                    {/* Label & Icon */}
                                    <div className="relative z-10 flex items-center gap-1 font-bold">
                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span style={{ textShadow: '0 0 10px rgba(0,217,255,0.8)' }}>
                                            Exit
                                        </span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Center: Title / Logo */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="event-logo-title" style={{ fontSize: '0.85rem' }}>GAMING ARENA</span>
                        <div className="flex items-center gap-1.5 leading-none mt-1">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{
                                    backgroundColor: activeCategory?.color || '#00d9ff',
                                    boxShadow: `0 0 6px ${activeCategory?.color || '#00d9ff'}`
                                }}
                            />
                            <span
                                className="event-division-sub"
                                style={{
                                    fontSize: '7.5px',
                                    textShadow: activeCategory ? `0 0 8px ${activeCategory.color}` : '0 0 8px rgba(0,217,255,0.7)'
                                }}
                            >
                                {activeCategory ? (
                                    <>
                                        {activeCategory.title.replace(' & RC', '').replace(' & CS', '').replace('GUILD', '').replace('ARENA', '').trim()}
                                    </>
                                ) : (
                                    'SELECT DIVISION'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Right Corner: Mobile Hamburger Toggle */}
                    <div className="absolute right-4 z-20 pointer-events-auto flex justify-end">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isSidebarOpen}
                            className="relative w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-95"
                            style={{
                                background: 'rgba(2, 13, 26, 0.85)',
                                border: '1.5px solid rgba(0, 217, 255, 0.6)',
                                borderRadius: '50%',
                                boxShadow: '0 0 8px rgba(0, 217, 255, 0.45)',
                                cursor: 'pointer',
                            }}
                            title="Toggle Navigation Menu"
                        >
                            <svg className="w-4 h-4 text-[#00D9FF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                {isSidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Empty Center Space (Fills with 3D Hologram Cards on Desktop, or HTML Grid on Mobile) */}
                {isMobile && activeCategory && !activeEvent ? (
                    <div
                        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                        className="flex-1 w-full overflow-y-auto pt-2 pb-6 px-4 flex flex-col justify-start pointer-events-auto scrollbar-none relative"
                    >
                        {/* Custom Animated Scroll Indicator Line */}
                        <div className="absolute right-1 top-[20%] bottom-[20%] w-[1.5px] bg-white/5 pointer-events-none z-20 rounded-full overflow-hidden">
                            <motion.div
                                className="w-full h-1/4 rounded-full"
                                style={{
                                    background: `linear-gradient(to bottom, ${activeCategory.color}, transparent)`,
                                    boxShadow: `0 0 8px ${activeCategory.color}`
                                }}
                                animate={{
                                    y: ['0%', '300%', '0%']
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto w-full">
                            {(subEventsData[activeCategory.title] || []).map((subEvent, idx) => (
                                <motion.div
                                    key={subEvent.title}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.05 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: Math.min(idx * 0.05, 0.25),
                                        ease: 'easeOut'
                                    }}
                                    className="event-card-cyber-wrap"
                                    style={{
                                        '--card-border-color': `${activeCategory.color}35`,
                                        boxShadow: `0 0 10px ${activeCategory.color}12`,
                                    }}
                                >
                                    <div className="event-card-cyber-inner">
                                        {/* Futuristic decoration lines */}
                                        <div className="absolute top-0 left-0 w-8 h-[2px]" style={{ background: activeCategory.color }} />
                                        <div className="absolute top-0 left-0 w-[2px] h-8" style={{ background: activeCategory.color }} />

                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-black tracking-wider text-white uppercase">{subEvent.title}</h3>
                                                <p className="text-[9px] font-bold tracking-widest uppercase mt-0.5" style={{ color: activeCategory.color }}>
                                                    {subEvent.subtitle}
                                                </p>
                                            </div>
                                            <span
                                                className="text-[8px] font-black tracking-widest px-2 py-0.5 rounded border font-mono"
                                                style={{
                                                    borderColor: `${activeCategory.color}40`,
                                                    background: `${activeCategory.color}10`,
                                                    color: activeCategory.color,
                                                }}
                                            >
                                                {subEvent.difficulty}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                                            {subEvent.desc}
                                        </p>

                                        <div className="flex flex-col gap-1.5 mt-1 pt-3 border-t border-white/5">
                                            {/* Row of Buttons / Reward */}
                                            <div className="flex w-full gap-3 justify-between items-center">
                                                {/* Cyber Reward Chip */}
                                                <div
                                                    className="flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 font-mono select-none"
                                                    style={{
                                                        background: `${activeCategory.color}08`,
                                                        border: `1.5px dashed ${activeCategory.color}45`,
                                                        color: '#ffffff',
                                                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                                                    }}
                                                >
                                                    <span className="opacity-45">REWARD:</span>
                                                    <span style={{ color: activeCategory.color }} className="font-bold">{subEvent.xp}</span>
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/event/${categoryName}/${slugify(subEvent.title)}`)}
                                                    onMouseEnter={() => setHoveredBtn(`${subEvent.title}-enter`)}
                                                    onMouseLeave={() => setHoveredBtn(null)}
                                                    className="flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
                                                    style={{
                                                        background: hoveredBtn === `${subEvent.title}-enter` ? '#ffffff' : `linear-gradient(135deg, ${activeCategory.color}e0 0%, ${activeCategory.color}80 100%)`,
                                                        color: hoveredBtn === `${subEvent.title}-enter` ? '#000000' : '#ffffff',
                                                        boxShadow: hoveredBtn === `${subEvent.title}-enter` ? `0 0 15px #ffffff` : `0 0 10px ${activeCategory.color}40`,
                                                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                                                    }}
                                                >
                                                    ENTER ARENA ⊕
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 w-full" />
                )}

                {/* ── DIVISION SELECTOR BUTTONS — Lobby only ── */}
                <AnimatePresence>
                    {!activeCategory && !activeEvent && (
                        <motion.div
                            key="division-deck"
                            initial={{ opacity: 0, x: isMobile ? -20 : 0, y: isMobile ? 0 : 16 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, x: isMobile ? -20 : 0, y: isMobile ? 0 : 16 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="pointer-events-auto z-20 w-auto fixed left-4 top-[24%] -translate-y-0 md:hidden"
                            style={isMobile ? {
                                background: 'rgba(2, 13, 26, 0.85)',
                                border: '1.5px solid rgba(0, 217, 255, 0.35)',
                                borderRadius: '24px',
                                padding: '12px 6px',
                                boxShadow: '0 0 20px rgba(0, 217, 255, 0.20)',
                                backdropFilter: 'blur(12px)',
                            } : undefined}
                        >
                            {/* Mobile swipe helper (hidden since it's vertical now) */}
                            <div className="hidden md:flex items-center justify-between px-5 mb-1.5 text-[8px] tracking-[0.2em] text-cyan-400 font-mono opacity-70 select-none">
                                <span>[ SECTORS_LIST ]</span>
                            </div>

                            <div
                                className="flex flex-col md:flex-row gap-[6px] overflow-y-auto md:overflow-x-visible pb-0 md:pb-0 scrollbar-none"
                            >
                                {categoriesList.map((card, i) => {
                                    const isActive = activeCategorySlug === slugify(card.title);
                                    const icons = ['⚙', '⌨', '◉', '◈', '⚡', '✦', '⊕'];
                                    const ids = ['01', '02', '03', '04', '05', '06', '07'];
                                    return (
                                        <button
                                            key={card.title}
                                            onClick={() => {
                                                setActiveCategorySlug(slugify(card.title));
                                            }}
                                            style={{
                                                flex: isMobile ? '0 0 auto' : '1 0 auto',
                                                flexShrink: 0,
                                                minWidth: isMobile ? '38px' : '95px',
                                                width: isMobile ? '38px' : 'auto',
                                                height: isMobile ? '38px' : 'auto',
                                                position: 'relative',
                                                background: isActive
                                                    ? `linear-gradient(180deg, ${card.color}18 0%, ${card.color}08 100%)`
                                                    : 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
                                                border: isMobile ? `1.5px solid ${isActive ? card.color : 'rgba(255,255,255,0.24)'}` : 'none',
                                                borderTop: isMobile ? undefined : (isActive ? `2px solid ${card.color}` : '2px solid rgba(255,255,255,0.06)'),
                                                borderLeft: isMobile ? undefined : (isActive ? `1px solid ${card.color}40` : '1px solid rgba(255,255,255,0.05)'),
                                                borderRight: isMobile ? undefined : (isActive ? `1px solid ${card.color}40` : '1px solid rgba(255,255,255,0.05)'),
                                                borderBottom: isMobile ? undefined : (isActive ? `1px solid ${card.color}30` : '1px solid rgba(255,255,255,0.04)'),
                                                color: isActive ? card.color : 'rgba(255,255,255,0.35)',
                                                padding: isMobile ? '0px' : '12px 6px 10px',
                                                fontFamily: 'monospace',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center',
                                                borderRadius: isMobile ? '50%' : '12px',
                                                boxShadow: isActive ? (isMobile ? `0 0 10px ${card.color}50` : `0 0 20px ${card.color}25, inset 0 0 20px ${card.color}06`) : 'none',
                                                clipPath: isMobile ? 'none' : 'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% 100%, 0% 100%, 0% 4px)',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = isMobile ? `${card.color}80` : undefined;
                                                    if (!isMobile) {
                                                        e.currentTarget.style.borderTopColor = `${card.color}80`;
                                                    }
                                                    e.currentTarget.style.background = `linear-gradient(180deg, ${card.color}10 0%, transparent 100%)`;
                                                    e.currentTarget.style.color = card.color;
                                                    e.currentTarget.style.boxShadow = `0 0 14px ${card.color}20`;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.borderColor = isMobile ? 'rgba(255,255,255,0.1)' : undefined;
                                                    if (!isMobile) {
                                                        e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.06)';
                                                    }
                                                    e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)';
                                                    e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }
                                            }}
                                        >
                                            {isMobile ? (
                                                <div style={{ fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', lineHeight: 1 }}>
                                                    {icons[i]}
                                                </div>
                                            ) : (
                                                <>
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
                                                        {card.title}
                                                    </div>

                                                    {/* Active bottom bar */}
                                                    {isActive && (
                                                        <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '2px', background: card.color, boxShadow: `0 0 8px ${card.color}` }} />
                                                    )}
                                                </>
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
                                    className="absolute top-2 right-2 z-30 md:hidden w-8 h-8 flex items-center justify-center rounded-full"
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

                {/* Bottom Footer Area */}
                <div className="w-full max-w-7xl mx-auto relative z-10 pointer-events-auto mt-auto pt-4 border-t border-white/5">
                    {(!activeCategory && !activeEvent) ? (
                        /* Redesigned Parallelogram Category Bar (Hidden on Mobile, visible on MD/Laptop/Desktop) */
                        <div className="hidden md:flex w-full flex-row justify-center gap-3">
                            {categoriesList.map((card, i) => {
                                const isActive = activeCategorySlug === slugify(card.title);
                                const icons = ['⚙', '⌨', '◉', '◈', '⚡', '✦', '⊕'];
                                const ids = ['01', '02', '03', '04', '05', '06', '07'];
                                return (
                                    <button
                                        key={card.title}
                                        onClick={() => {
                                            setActiveCategorySlug(slugify(card.title));
                                        }}
                                        className="category-para-btn-wrap"
                                        style={{
                                            '--btn-border-color': isActive ? card.color : 'rgba(0, 217, 255, 0.25)',
                                            transform: isActive ? 'scale(1.03)' : 'none',
                                            cursor: 'pointer',
                                            border: 'none',
                                            background: 'none',
                                            padding: 0,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                const inner = e.currentTarget.querySelector('.category-para-btn-inner');
                                                if (inner) {
                                                    inner.style.background = `linear-gradient(180deg, ${card.color}25 0%, transparent 100%)`;
                                                    inner.style.color = '#ffffff';
                                                }
                                                e.currentTarget.style.setProperty('--btn-border-color', `${card.color}cc`);
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.transform = 'none';
                                                const inner = e.currentTarget.querySelector('.category-para-btn-inner');
                                                if (inner) {
                                                    inner.style.background = 'rgba(4, 18, 34, 0.95)';
                                                    inner.style.color = 'rgba(255, 255, 255, 0.8)';
                                                }
                                                e.currentTarget.style.setProperty('--btn-border-color', 'rgba(0, 217, 255, 0.25)');
                                            }
                                        }}
                                    >
                                        <div
                                            className="category-para-btn-inner"
                                            style={{
                                                background: isActive
                                                    ? `linear-gradient(180deg, ${card.color}25 0%, ${card.color}05 100%)`
                                                    : 'rgba(4, 18, 34, 0.95)',
                                                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                                textShadow: isActive ? `0 0 10px ${card.color}ee` : 'none',
                                                boxShadow: isActive ? `0 0 15px ${card.color}35, inset 0 0 15px ${card.color}15` : 'none',
                                            }}
                                        >
                                            <span style={{ fontSize: '8px', color: isActive ? card.color : 'rgba(255, 255, 255, 0.4)', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif" }}>
                                                SECT_{ids[i]}
                                            </span>
                                            <span style={{ fontSize: '18px', lineHeight: 1 }}>{icons[i]}</span>
                                            <span style={{ fontSize: '11.5px', letterSpacing: '0.08em', fontWeight: 800, fontFamily: "'Rajdhani', sans-serif" }}>
                                                {card.title}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}

                    {/* Cyber Breadcrumbs Bar */}
                    <div className="w-full flex flex-col items-center gap-1.5 mt-3">
                        {/* Small high-tech bar */}
                        <div
                            className="relative w-full h-[2px] rounded-full overflow-hidden"
                            style={{
                                background: activeCategory
                                    ? `linear-gradient(to right, transparent, ${activeCategory.color}70, transparent)`
                                    : 'linear-gradient(to right, transparent, rgba(0, 217, 255, 0.4), transparent)',
                                boxShadow: activeCategory
                                    ? `0 0 8px ${activeCategory.color}20`
                                    : '0 0 8px rgba(0, 217, 255, 0.15)'
                            }}
                        >
                            {/* Glowing scanning pulse */}
                            <motion.div
                                className="absolute top-0 bottom-0 w-1/4"
                                style={{
                                    background: activeCategory
                                        ? `linear-gradient(to right, transparent, ${activeCategory.color}, transparent)`
                                        : 'linear-gradient(to right, transparent, #00d9ff, transparent)'
                                }}
                                animate={{
                                    left: ['-25%', '100%']
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                            />
                        </div>

                        {/* Breadcrumbs Text */}
                        <div
                            className="flex items-center gap-2 font-mono text-[9px] sm:text-[11px] tracking-[0.18em] uppercase select-none mt-1"
                            style={{
                                color: activeCategory ? activeCategory.color : '#00d9ff',
                                textShadow: activeCategory
                                    ? `0 0 8px ${activeCategory.color}40`
                                    : '0 0 8px rgba(0, 217, 255, 0.4)'
                            }}
                        >
                            <span
                                onClick={() => navigate('/event')}
                                className="cursor-pointer hover:text-white transition-colors duration-200"
                            >
                                LOBBY
                            </span>
                            {activeCategory && (
                                <>
                                    <span className="text-white/30 text-[8px] sm:text-[10px]">➔</span>
                                    <span
                                        onClick={() => {
                                            if (activeEvent) {
                                                navigate(`/event/${categoryName}`);
                                            }
                                        }}
                                        className={`transition-colors duration-200 ${activeEvent ? 'cursor-pointer hover:text-white' : 'font-bold text-white'}`}
                                    >
                                        {activeCategory.title}
                                    </span>
                                </>
                            )}
                            {activeEvent && (
                                <>
                                    <span className="text-white/30 text-[8px] sm:text-[10px]">➔</span>
                                    <span className="text-white font-black">
                                        {activeEvent.title}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Mobile Sidebar Navigation Drawer (Visible on mobile/tablet) ── */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1.0 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-[#000000] z-45 pointer-events-auto lg:hidden"
                        />

                        {/* Floating Cyber Holographic Sidebar panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-24 right-4 bottom-20 w-[290px] z-50 pointer-events-auto flex flex-col p-6 gap-6 shadow-[0_0_30px_rgba(0,217,255,0.25)] lg:hidden overflow-y-auto scrollbar-none"
                            style={{
                                background: '#000000',
                                border: '1.5px solid rgba(0, 217, 255, 0.5)',
                                backdropFilter: 'blur(16px)',
                                clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                            }}
                        >
                            {/* Holographic grid scanline bg */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{
                                backgroundImage: 'linear-gradient(rgba(0,217,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.2) 1px, transparent 1px)',
                                backgroundSize: '16px 16px',
                            }} />

                            {/* Header / Brand */}
                            <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-4 relative z-10">
                                <span style={{
                                    fontFamily: "'Orbitron', monospace",
                                    fontWeight: 900,
                                    fontSize: '0.82rem',
                                    letterSpacing: '0.25em',
                                    color: '#00D9FF',
                                    textShadow: '0 0 10px rgba(0,217,255,0.7)',
                                }}>NAVIGATION MENU</span>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    aria-label="Close navigation menu"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Sidebar Links */}
                            <div className="flex flex-col gap-2 relative z-10">
                                {[
                                    { label: 'HOME', path: '/home' },
                                    { label: 'ARENA', path: '/event' },
                                    { label: 'TIMELINE', path: '/timeline' },
                                    { label: 'ALLIANCES', path: '/alliances' },
                                    { label: 'CREW', path: '/crew' },
                                    { label: 'CONNECT HUB', path: '/connect' },
                                ].map(({ label, path }) => (
                                    <a
                                        key={label}
                                        href={path}
                                        onClick={(e) => {
                                            setIsSidebarOpen(false);
                                            // Handle relative hash links to take back to home routes
                                            if (path.startsWith('/home#')) {
                                                e.preventDefault();
                                                setIsEntered(false);
                                                setIsEventPage(false);
                                                navigate(path);
                                                // After navigation, scroll to the hash
                                                const hash = path.split('#')[1];
                                                setTimeout(() => {
                                                    const el = document.getElementById(hash);
                                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                            } else if (path === '/home') {
                                                e.preventDefault();
                                                handleExit();
                                            } else if (path === '/event' || path === '/timeline' || path === '/crew' || path === '/alliances' || path === '/connect') {
                                                e.preventDefault();
                                                navigate(path);
                                            }
                                        }}
                                        className={`mobile-nav-link ${path === '/event' && !activeCategory ? 'mobile-nav-link-active' : ''}`}
                                    >
                                        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// ── Tabbed Event Details Modal ───────────────────────────────────────────────
function EventDetailsModal({ activeEvent, onClose, teamName, setTeamName, leaderName, setLeaderName, leaderUID, setLeaderUID, leaderPhone, setLeaderPhone, teamSize, setTeamSize, members, setMembers, handleRegisterSubmit, isRegistered }) {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('register'); // Default to register
    const isMobileModal = window.innerWidth < 768;

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
        padding: isMobileModal ? '6px 10px' : '8px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Orbitron', sans-serif",
        fontSize: isMobileModal ? '9px' : '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
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
        : [
            { name: 'Dr. Sarah Connor', role: 'Chief Division Marshal', email: 'marshal@addovedi.org', phone: '+91 98765 43210' },
            { name: 'Agent John Doe', role: 'Telemetry Overseer', email: 'overseer@addovedi.org', phone: '+91 87654 32109' },
        ];

    const inputClass = `w-full bg-[#02050c]/85 border text-white placeholder-white/30 ${isMobileModal ? 'px-3 py-1.5' : 'px-4 py-2.5'} focus:outline-none transition-all duration-300 rounded-none tracking-wider`;
    const inputStyle = {
        fontSize: isMobileModal ? '11px' : '14px',
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 600,
        borderColor: `${activeEvent.color}30`,
        boxShadow: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%)',
        backgroundSize: '100% 4px',
        letterSpacing: '0.05em'
    };
    const onFocus = (e) => { e.target.style.borderColor = activeEvent.color; e.target.style.boxShadow = `0 0 20px ${activeEvent.color}35, inset 0 0 20px ${activeEvent.color}08`; };
    const onBlur = (e) => { e.target.style.borderColor = `${activeEvent.color}30`; e.target.style.boxShadow = 'none'; };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
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

                    {/* Mobile swipe helper text overlay */}
                    {isMobileModal && (
                        <div style={{ 
                            fontSize: '7px', 
                            fontFamily: "'Orbitron', sans-serif", 
                            color: activeEvent.color, 
                            letterSpacing: '0.15em', 
                            marginBottom: '6px', 
                            textAlign: 'right', 
                            animation: 'blink-cyber 2s infinite',
                            fontWeight: 900
                        }}>
                            [ SWIPE TABS HORIZONTALLY ↔ ]
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: isMobileModal ? '14px' : '22px', overflowX: 'auto', overflowY: 'hidden', flexShrink: 0 }} className="scrollbar-none">
                        <button style={TAB_STYLE('register')} onClick={() => setActiveTab('register')}>⬡ Register</button>
                        <button style={TAB_STYLE('overview')} onClick={() => setActiveTab('overview')}>◈ Overview</button>
                        <button style={TAB_STYLE('rules')} onClick={() => setActiveTab('rules')}>⊞ Rules</button>
                        <button style={TAB_STYLE('faq')} onClick={() => setActiveTab('faq')}>? FAQ</button>
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
                                    <div key={k} style={{ flex: 1, padding: isMobileModal ? '12px' : '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: isMobileModal ? 'row' : 'column', justifyContent: isMobileModal ? 'space-between' : 'flex-start', alignItems: isMobileModal ? 'center' : 'flex-start', gap: '8px' }}>
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
                        <>
                            {!isRegistered ? (
                                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: "'Rajdhani', sans-serif", height: isMobileModal ? 'auto' : '100%', overflow: isMobileModal ? 'visible' : 'hidden' }}>
                                    <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: activeEvent.color, opacity: 0.8 }}>
                                        {'// INITIATE_REGISTRATION_PROTOCOL'}
                                    </div>
                                    <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="cyber-rules-scrollbar">
                                        <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2 }}>
                                                <label htmlFor="teamName" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: activeEvent.color }}>▸</span> TEAM NAME // CALLSIGN
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input id="teamName" type="text" required placeholder="ENTER TEAM NAME..." value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                                        className={inputClass} style={{ ...inputStyle, textTransform: 'uppercase' }} onFocus={onFocus} onBlur={onBlur}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                <label htmlFor="teamSize" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ color: activeEvent.color }}>▸</span> TEAM SIZE
                                                </label>
                                                <select id="teamSize" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))}
                                                    className={inputClass} style={{ ...inputStyle, background: '#02050c', color: '#fff', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}
                                                >
                                                    {[1, 2, 3, 4, 5].map(n => (
                                                        <option key={n} value={n} style={{ background: '#02050c', color: '#fff' }}>{n} {n === 1 ? 'MEMBER' : 'MEMBERS'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                                            <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: activeEvent.color, fontWeight: 900, marginBottom: '8px' }}>
                                                [ LEADER_METADATA ]
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                        <label htmlFor="leaderName" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER NAME</label>
                                                        <input id="leaderName" type="text" required placeholder="LEADER NAME..." value={leaderName} onChange={(e) => setLeaderName(e.target.value)}
                                                            className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                        <label htmlFor="leaderUID" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER UNIQUE ID // G-ID</label>
                                                        <input id="leaderUID" type="text" required placeholder="G-XXXXXX" value={leaderUID} onChange={(e) => setLeaderUID(e.target.value)}
                                                            className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <label htmlFor="leaderPhone" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER PHONE // COMMS</label>
                                                    <input id="leaderPhone" type="tel" required placeholder="+91 XXXXX XXXXX" value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)}
                                                        className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {members.length > 0 && (
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: activeEvent.color, fontWeight: 900, marginBottom: '2px' }}>
                                                    [ ADDITIONAL_MEMBERS_SLOTS ]
                                                </div>
                                                {members.map((m, idx) => (
                                                    <div key={idx} style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '10px', marginBottom: '4px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                            <label style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>MEMBER #{idx + 2} NAME</label>
                                                            <input type="text" required placeholder={`MEMBER #${idx + 2} NAME...`} value={m.name}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setMembers(prev => {
                                                                        const next = [...prev];
                                                                        next[idx] = { ...next[idx], name: val };
                                                                        return next;
                                                                    });
                                                                }}
                                                                className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                            <label style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)' }}>MEMBER #{idx + 2} UNIQUE ID // G-ID</label>
                                                            <input type="text" required placeholder="G-XXXXXX" value={m.uid}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setMembers(prev => {
                                                                        const next = [...prev];
                                                                        next[idx] = { ...next[idx], uid: val };
                                                                        return next;
                                                                    });
                                                                }}
                                                                className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: isMobileModal ? '10px' : '16px', marginTop: '14px' }}>
                                        <button type="button" onClick={handleDownloadPDF}
                                            style={{ 
                                                flex: 1, 
                                                padding: isMobileModal ? '8px 12px' : '12px', 
                                                border: `1px solid ${activeEvent.color}60`, 
                                                background: 'transparent', 
                                                color: activeEvent.color, 
                                                fontFamily: "'Orbitron', sans-serif", 
                                                fontSize: isMobileModal ? '9px' : '11px', 
                                                letterSpacing: '0.15em', 
                                                fontWeight: 900, 
                                                textTransform: 'uppercase', 
                                                cursor: 'pointer', 
                                                transition: 'all 0.2s',
                                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                                            }}
                                            onMouseEnter={(e) => { 
                                                e.currentTarget.style.background = `${activeEvent.color}20`; 
                                                e.currentTarget.style.boxShadow = `0 0 20px ${activeEvent.color}40`; 
                                                e.currentTarget.style.transform = 'translateY(-1.5px)';
                                            }}
                                            onMouseLeave={(e) => { 
                                                e.currentTarget.style.background = 'transparent'; 
                                                e.currentTarget.style.boxShadow = 'none'; 
                                                e.currentTarget.style.transform = 'none';
                                            }}
                                        >DOWNLOAD RULES ⭳</button>
                                        <button type="submit"
                                            style={{ 
                                                flex: 1, 
                                                padding: isMobileModal ? '8px 12px' : '12px', 
                                                border: `1px solid ${activeEvent.color}`, 
                                                background: activeEvent.color, 
                                                color: '#000000', 
                                                fontFamily: "'Orbitron', sans-serif", 
                                                fontSize: isMobileModal ? '9px' : '11px', 
                                                letterSpacing: '0.15em', 
                                                fontWeight: 900, 
                                                textTransform: 'uppercase', 
                                                cursor: 'pointer', 
                                                transition: 'all 0.2s', 
                                                boxShadow: `0 0 20px ${activeEvent.color}40`,
                                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                                            }}
                                            onMouseEnter={(e) => { 
                                                e.currentTarget.style.background = '#ffffff'; 
                                                e.currentTarget.style.boxShadow = `0 0 25px #ffffff`; 
                                                e.currentTarget.style.borderColor = '#ffffff';
                                                e.currentTarget.style.transform = 'translateY(-1.5px)'; 
                                            }}
                                            onMouseLeave={(e) => { 
                                                e.currentTarget.style.background = activeEvent.color; 
                                                e.currentTarget.style.boxShadow = `0 0 20px ${activeEvent.color}40`; 
                                                e.currentTarget.style.borderColor = activeEvent.color;
                                                e.currentTarget.style.transform = 'none'; 
                                            }}
                                        >EXECUTE PROTOCOL</button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '24px 12px' : '40px 20px', fontFamily: "'Rajdhani', sans-serif" }}>
                                    <div style={{ position: 'relative', width: isMobileModal ? '70px' : '90px', height: isMobileModal ? '70px' : '90px', marginBottom: '20px' }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{ position: 'absolute', inset: `${i * 12}px`, borderRadius: '50%', border: `1px solid ${activeEvent.color}`, opacity: 0.6 - i * 0.15, boxShadow: `0 0 ${10 - i * 2}px ${activeEvent.color}` }} />
                                        ))}
                                        <div style={{ position: 'absolute', inset: '34px', borderRadius: '50%', background: activeEvent.color, boxShadow: `0 0 30px ${activeEvent.color}80`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                                        REGISTRATION PROTOCOL // VERIFIED
                                    </div>
                                    <h3 style={{ fontSize: isMobileModal ? '16px' : '20px', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff', textShadow: `0 0 20px ${activeEvent.color}60`, margin: '0 0 6px 0' }}>
                                        MISSION ACCEPTED
                                    </h3>
                                    <p style={{ fontSize: isMobileModal ? '12px' : '14px', color: 'rgba(255,255,255,0.6)', maxWidth: '400px', lineHeight: 1.8, marginBottom: '20px' }}>
                                        Team callsign <span style={{ fontWeight: 900, color: activeEvent.color }}>{teamName}</span> successfully enrolled for <span style={{ color: '#fff', fontWeight: 700 }}>{activeEvent.title}</span>. Leader Unique ID <span style={{ fontWeight: 900, color: activeEvent.color }}>{leaderUID}</span> has been securely logged.
                                    </p>
                                    <button onClick={onClose}
                                        style={{ padding: isMobileModal ? '12px 28px' : '14px 40px', background: 'transparent', border: `1px solid ${activeEvent.color}`, color: activeEvent.color, fontFamily: "'Orbitron', sans-serif", fontSize: '11px', letterSpacing: '0.2em', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 15px ${activeEvent.color}20`, clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = `${activeEvent.color}15`; e.currentTarget.style.boxShadow = `0 0 25px ${activeEvent.color}50`; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = `0 0 15px ${activeEvent.color}20`; }}
                                    >CLOSE SESSION</button>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Tab: FAQ Grid ── */}
                    {activeTab === 'faq' && (
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', scrollBehavior: 'smooth', display: 'grid', gridTemplateColumns: isMobileModal ? '1fr' : '1fr 1fr', gap: '12px', fontFamily: "'Rajdhani', sans-serif" }} className="cyber-rules-scrollbar">
                            {faqs.map((item, idx) => (
                                <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.35)', padding: isMobileModal ? '12px' : '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontWeight: 900, fontSize: isMobileModal ? '11px' : '13px', fontFamily: "'Orbitron', sans-serif", color: activeEvent.color, display: 'flex', gap: '8px', letterSpacing: '0.05em' }}>
                                        <span>Q{idx + 1}.</span><span>{item.q}</span>
                                    </div>
                                    <div style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, paddingLeft: '22px' }}>{item.a}</div>
                                </div>
                            ))}
                        </div>
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

