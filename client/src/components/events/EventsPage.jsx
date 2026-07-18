import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import { CARD_DATA, SUB_EVENTS, slugify, getCategoryMeta } from '../../data/events';
import { API_BASE } from '../../constants/api';
import EventCard from './EventCard';
import EventModal from './EventModal';

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

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
        if (loggedInUser && loggedInUser.isGlobalRegistered) {
            setLeaderName(loggedInUser.name || '');
            setLeaderUID(loggedInUser.addovediId || '');
            setLeaderPhone(loggedInUser.phone || '');
        } else {
            setLeaderName('');
            setLeaderUID('');
            setLeaderPhone('');
        }
    }, [activeEvent]);

    const handleExit = () => {
        setIsEntered(false);
        setIsEventPage(false);
        navigate('/home');
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        const loggedInUser = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
        if (!loggedInUser || !loggedInUser.isGlobalRegistered) return;

        if (!teamName || !leaderName || !leaderUID || !leaderPhone) return;

        // Add to registrations list in localStorage
        const storedRegs = JSON.parse(localStorage.getItem('addovedi_registrations') || '[]');
        if (!storedRegs.some(r => r.title === activeEvent.title)) {
            storedRegs.push({
                title: activeEvent.title,
                category: activeCategory.title,
                venue: activeEvent.venue || 'Main Arena',
                teamName: teamName
            });
            localStorage.setItem('addovedi_registrations', JSON.stringify(storedRegs));
        }

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

                {/* Mobile Categories Selector Bar (At the top, below top bar, lobby only) - Disabled in favor of vertical tab sidebar */}
                {false && !activeCategory && !activeEvent && (
                    <div className="flex md:hidden w-full flex-col items-center gap-1.5 px-1 mt-1.5 pointer-events-auto z-20">
                    </div>
                )}

                {/* Mobile Telemetry Vertical Status Dock (Lobby Only) */}
                {isMobile && !activeCategory && !activeEvent && (
                    <div 
                        className="fixed right-0 top-[12%] bottom-[12%] w-[54px] z-30 flex flex-col justify-between items-center py-4 pointer-events-none select-none"
                        style={{
                            background: 'linear-gradient(to left, rgba(2, 6, 16, 0.7) 0%, rgba(2, 6, 16, 0.2) 75%, transparent 100%)',
                            padding: '12px 2px 12px 6px',
                        }}
                    >
                        {/* Dynamic category color indicator dot & signal bar at the top */}
                        <div className="flex flex-col items-center gap-1.5 mt-1">
                            <span className="text-[6.5px] font-mono tracking-wider opacity-45 text-white font-black uppercase">SYS</span>
                            <span 
                                className="w-2 h-2 rounded-full transition-all duration-500"
                                style={{
                                    backgroundColor: activeCategorySlug 
                                        ? categoriesList.find(c => slugify(c.title) === activeCategorySlug)?.color || '#00d9ff'
                                        : '#00d9ff',
                                    boxShadow: activeCategorySlug
                                        ? `0 0 10px ${categoriesList.find(c => slugify(c.title) === activeCategorySlug)?.color || '#00d9ff'}`
                                        : '0 0 6px #00d9ff',
                                }}
                            />
                            
                            {/* Graphic signal indicator bars */}
                            <div className="flex gap-[1.5px] items-end h-[8px] mt-1 opacity-40">
                                <div className="w-[1.5px] h-[3px] bg-emerald-400" />
                                <div className="w-[1.5px] h-[5px] bg-emerald-400" />
                                <div className="w-[1.5px] h-[7px] bg-emerald-400 animate-pulse" />
                                <div className="w-[1.5px] h-[9px] bg-emerald-400" />
                            </div>
                        </div>

                        {/* Vertically rotated text */}
                        <div 
                            className="font-mono text-[7px] font-black uppercase tracking-[0.35em] select-none opacity-45 text-white my-3"
                            style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                transition: 'color 0.5s ease',
                                color: activeCategorySlug 
                                    ? categoriesList.find(c => slugify(c.title) === activeCategorySlug)?.color || '#ffffff'
                                    : '#ffffff'
                            }}
                        >
                            {activeCategorySlug 
                                ? (categoriesList.find(c => slugify(c.title) === activeCategorySlug)?.title.replace(' & RC', '').replace(' & CS', '').replace('GUILD', '').replace('ARENA', '').trim() || 'LOBBY')
                                : 'SYS_STATUS'}
                        </div>

                        {/* System Load Bars (Filler element to balance left sidebar height) */}
                        <div className="flex flex-col gap-2 w-full items-center my-2 opacity-65">
                            <div className="text-[5.5px] text-[#00d9ff] font-mono tracking-wider scale-90">[ SYS_LOAD ]</div>
                            
                            <div className="flex flex-col gap-1.5 w-full max-w-[32px]">
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex justify-between text-[4.5px] font-mono text-white/50">
                                        <span>CPU</span>
                                        <span>38%</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-white/10 rounded-sm overflow-hidden">
                                        <div className="h-full bg-[#00d9ff]/70" style={{ width: '38%' }} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex justify-between text-[4.5px] font-mono text-white/50">
                                        <span>RAM</span>
                                        <span>74%</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-white/10 rounded-sm overflow-hidden">
                                        <div className="h-full bg-purple-500/70" style={{ width: '74%' }} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex justify-between text-[4.5px] font-mono text-white/50">
                                        <span>GPU</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="w-full h-[2px] bg-white/10 rounded-sm overflow-hidden">
                                        <div className="h-full bg-rose-500/70" style={{ width: '45%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System stats at the bottom */}
                        <div className="flex flex-col items-center gap-2 mb-1 font-mono text-[6px] text-white/40 leading-none">
                            <div className="flex flex-col items-center">
                                <span className="text-[#00d9ff] font-bold">24ms</span>
                                <span className="scale-75 opacity-60 mt-0.5">PING</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-emerald-400 font-bold">60</span>
                                <span className="scale-75 opacity-60 mt-0.5">FPS</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Categories Vertical Sidebar Dock (Lobby Only) */}
                {isMobile && !activeCategory && !activeEvent && (
                    <div 
                        className="fixed left-0 top-[12%] bottom-[12%] w-[72px] z-30 flex flex-col justify-center items-center gap-2 pointer-events-auto select-none"
                        style={{
                            background: 'linear-gradient(to right, rgba(2, 6, 16, 0.75) 0%, rgba(2, 6, 16, 0.25) 75%, transparent 100%)',
                            padding: '12px 6px 12px 2px',
                        }}
                    >


                        {categoriesList.map((card, i) => {
                            const isActive = activeCategorySlug === slugify(card.title);
                            const meta = getCategoryMeta(card.title);
                            
                            return (
                                <div
                                    key={card.title}
                                    style={{
                                        padding: '1.2px',
                                        background: isActive ? card.color : 'rgba(0, 217, 255, 0.15)',
                                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                                        boxShadow: isActive ? `0 0 12px ${card.color}45` : 'none',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setActiveCategorySlug(slugify(card.title));
                                        }}
                                        className="relative flex flex-col items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                                        style={{
                                            width: '54px',
                                            height: '50px',
                                            background: isActive 
                                                ? 'rgba(4, 18, 38, 0.98)'
                                                : 'rgba(3, 14, 30, 0.95)',
                                            border: 'none',
                                            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                                        }}
                                    >


                                        {/* Icon */}
                                        <span 
                                            className="text-base leading-none"
                                            style={{ 
                                                color: isActive ? card.color : 'rgba(255, 255, 255, 0.45)',
                                                textShadow: isActive ? `0 0 6px ${card.color}` : 'none'
                                            }}
                                        >
                                            {meta.iconChar}
                                        </span>

                                        {/* Short Label */}
                                        <span 
                                            style={{ 
                                                fontSize: '8.5px', 
                                                fontWeight: 800, 
                                                fontFamily: "'Rajdhani', sans-serif",
                                                marginTop: '3.5px',
                                                letterSpacing: '0.02em',
                                                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {meta.shortName}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Mobile Categories Selector Bar (At the top, below top bar, lobby only) - Disabled */}
                {false && !activeCategory && !activeEvent && (
                    <div className="flex md:hidden w-full flex-col items-center gap-1.5 px-1 mt-1.5 pointer-events-auto z-20">
                        {/* Small Heading: CATEGORIES */}
                        <span className="text-[7.5px] font-mono tracking-[0.25em] text-[#00d9ff] opacity-75 font-black uppercase">
                            [ CATEGORIES ]
                        </span>

                        {/* Horizontal Scrollable Category List with scroll indicators */}
                        <div className="w-full flex items-center gap-1 relative px-2">
                            {/* Left Scroll Indicator: << */}
                            <span className="text-[9px] text-[#00d9ff] opacity-50 font-black animate-pulse select-none shrink-0" style={{ textShadow: '0 0 6px rgba(0, 217, 255, 0.8)' }}>
                                &lt;&lt;
                            </span>

                            {/* Scrollable list */}
                            <div className="flex-1 flex flex-row gap-2.5 overflow-x-auto py-1 px-1.5 scrollbar-none justify-start select-none">
                                {categoriesList.map((card, i) => {
                                    const isActive = activeCategorySlug === slugify(card.title);
                                    const meta = getCategoryMeta(card.title);

                                    return (
                                        <button
                                            key={card.title}
                                            onClick={() => {
                                                setActiveCategorySlug(slugify(card.title));
                                            }}
                                            className="category-para-btn-wrap shrink-0"
                                            style={{
                                                '--btn-border-color': isActive ? card.color : 'rgba(0, 217, 255, 0.22)',
                                                transform: isActive ? 'scale(1.02)' : 'none',
                                                cursor: 'pointer',
                                                border: 'none',
                                                background: 'none',
                                                padding: 0,
                                            }}
                                        >
                                            <div
                                                className="category-para-btn-inner"
                                                style={{
                                                    background: isActive
                                                        ? `linear-gradient(180deg, ${card.color}25 0%, ${card.color}05 100%)`
                                                        : 'rgba(4, 18, 34, 0.95)',
                                                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                                                    textShadow: isActive ? `0 0 10px ${card.color}ee` : 'none',
                                                    boxShadow: isActive ? `0 0 15px ${card.color}35, inset 0 0 15px ${card.color}15` : 'none',
                                                    padding: '6px 14px 6px 18px',
                                                    fontSize: '10px',
                                                    gap: '6px',
                                                    clipPath: 'polygon(7.5px 0%, 100% 0%, calc(100% - 7.5px) 100%, 0% 100%)' // Slightly adjusted chamfer for smaller height
                                                }}
                                            >
                                                <span style={{ fontSize: '13px', lineHeight: 1, color: isActive ? card.color : 'rgba(255, 255, 255, 0.45)' }}>
                                                    {meta.iconChar}
                                                </span>
                                                <span style={{ fontSize: '9px', letterSpacing: '0.05em', fontWeight: 800, fontFamily: "'Rajdhani', sans-serif" }}>
                                                    {meta.shortName}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Scroll Indicator: >> */}
                            <span className="text-[9px] text-[#00d9ff] opacity-50 font-black animate-pulse select-none shrink-0" style={{ textShadow: '0 0 6px rgba(0, 217, 255, 0.8)' }}>
                                &gt;&gt;
                            </span>
                        </div>
                    </div>
                )}

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
                                <EventCard
                                    key={subEvent.title}
                                    subEvent={subEvent}
                                    idx={idx}
                                    activeCategory={activeCategory}
                                    categoryName={categoryName}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 w-full" />
                )}
                {/* Registration Overlay Modal */}
                <EventModal
                    activeEvent={activeEvent}
                    activeCategory={activeCategory}
                    handleCloseModal={handleCloseModal}
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

                {/* Bottom Footer Area */}
                <div className="w-full max-w-7xl mx-auto relative z-10 pointer-events-auto mt-auto pt-4 border-t border-white/5">
                    {(!activeCategory && !activeEvent) ? (
                        /* Redesigned Parallelogram Category Bar (Hidden on Mobile, visible on MD/Laptop/Desktop) */
                        <div className="hidden md:flex w-full flex-row justify-center gap-3">
                            {categoriesList.map((card, i) => {
                                const isActive = activeCategorySlug === slugify(card.title);
                                const meta = getCategoryMeta(card.title);
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
                                                SECT_{meta.id}
                                            </span>
                                            <span style={{ fontSize: '18px', lineHeight: 1 }}>{meta.iconChar}</span>
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
        </>
    );
}

