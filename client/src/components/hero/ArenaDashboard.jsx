import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function ArenaDashboard() {
    const setIsEntered = useStore(state => state.setIsEntered);
    const setShowButton = useStore(state => state.setShowButton);
    const setShowLogo = useStore(state => state.setShowLogo);
    const setShowNavbar = useStore(state => state.setShowNavbar);

    const [activeTab, setActiveTab] = useState('quests'); // 'quests' | 'leaderboard'
    const [selectedQuest, setSelectedQuest] = useState(null); // null | quest object
    const [formData, setFormData] = useState({ name: '', email: '', college: '' });
    const [registeredQuests, setRegisteredQuests] = useState([]); // list of quest IDs user joined
    const [showSuccess, setShowSuccess] = useState(false);

    const quests = [
        {
            id: 'coders',
            title: 'Coders Guild',
            subtitle: 'Competitive Coding & Hackathons',
            color: '#ff1f4f',
            glow: 'rgba(255, 31, 79, 0.4)',
            desc: 'Test your algorithmic execution in high-speed competitive programming battles and team hackathons. Formulate solutions to real-world gaming paradigms.',
            difficulty: 'Hard',
            reward: '5,000 XP',
        },
        {
            id: 'cyber',
            title: 'Cyber Sector',
            subtitle: 'Capture The Flag (CTF) Challenges',
            color: '#00d9ff',
            glow: 'rgba(0, 217, 255, 0.4)',
            desc: 'Infiltrate systems, decrypt complex cyphers, and patch vulnerabilities in live threat simulations. Defend your virtual node against hackers.',
            difficulty: 'Extreme',
            reward: '7,500 XP',
        },
        {
            id: 'creators',
            title: 'Creators Realm',
            subtitle: 'Game Design & UI Engineering',
            color: '#ff345f',
            glow: 'rgba(255, 52, 95, 0.4)',
            desc: 'Construct interactive 3D assets, sculpt gaming levels, and build fully playable game builds. Wow the judges with fluid game mechanics.',
            difficulty: 'Medium',
            reward: '4,000 XP',
        }
    ];

    const leaderboard = [
        { rank: 1, name: 'CipherCore', score: '38,200 XP', guild: 'Cyber Sector' },
        { rank: 2, name: 'NeonGhost', score: '35,150 XP', guild: 'Coders Guild' },
        { rank: 3, name: 'ShadowCode', score: '32,800 XP', guild: 'Creators Realm' },
        { rank: 4, name: 'ByteHunter', score: '29,400 XP', guild: 'Coders Guild' },
        { rank: 5, name: 'VectorBlade', score: '27,100 XP', guild: 'Creators Realm' },
    ];

    const handleExit = () => {
        setIsEntered(false);
        // Stagger visual return of the intro elements
        setTimeout(() => setShowLogo(true), 600);
        setTimeout(() => setShowNavbar(true), 1200);
        setTimeout(() => setShowButton(true), 1800);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setShowSuccess(true);
        setRegisteredQuests([...registeredQuests, selectedQuest.id]);
        
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedQuest(null);
            setFormData({ name: '', email: '', college: '' });
        }, 2200);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.0, ease: "easeOut" }} // delay until camera enters hangar
            className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12 font-sans overflow-y-auto pointer-events-auto bg-black/40 backdrop-blur-sm"
        >
            
            {/* Main Console Frame */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.2, ease: "easeOut" }} // delay to coordinate with flight
                className="w-full max-w-6xl h-full max-h-[85vh] bg-[#070b19]/80 border border-[#00d9ff]/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(0,217,255,0.15)] relative overflow-hidden"
                style={{
                    boxShadow: "inset 0 0 30px rgba(0, 217, 255, 0.05), 0 0 50px rgba(0, 217, 255, 0.1)"
                }}
            >
                {/* Cyberpunk background grid lines */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#00d9ff_1px,transparent_1px),linear-gradient(to_bottom,#00d9ff_1px,transparent_1px)] bg-[size:30px_30px]" />

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#00d9ff]/10 pb-6 z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#00d9ff] animate-pulse" />
                            <h1 className="text-white text-3xl font-black tracking-widest uppercase">THE ARENA</h1>
                        </div>
                        <p className="text-[#00d9ff]/60 text-xs mt-1 uppercase tracking-widest">Select quests, assign guilds, and track events</p>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="flex gap-6 bg-slate-900/40 border border-[#00d9ff]/10 rounded-2xl px-6 py-3 text-white text-sm">
                        <div className="text-center">
                            <span className="block text-slate-400 text-xxs uppercase tracking-wider">Level</span>
                            <span className="font-black text-[#00d9ff] text-lg">01</span>
                        </div>
                        <div className="h-8 w-px bg-[#00d9ff]/10 self-center" />
                        <div className="text-center">
                            <span className="block text-slate-400 text-xxs uppercase tracking-wider">XP Earned</span>
                            <span className="font-black text-white text-lg">
                                {registeredQuests.length * 500}
                            </span>
                        </div>
                        <div className="h-8 w-px bg-[#00d9ff]/10 self-center" />
                        <div className="text-center">
                            <span className="block text-slate-400 text-xxs uppercase tracking-wider">Status</span>
                            <span className="font-black text-[#ff345f] uppercase text-sm leading-7">Active</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mt-6 z-10">
                    <button 
                        onClick={() => setActiveTab('quests')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                            activeTab === 'quests' 
                            ? 'bg-[#00d9ff]/10 border-[#00d9ff] text-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.25)]' 
                            : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                    >
                        Active Quests
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaderboard')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                            activeTab === 'leaderboard' 
                            ? 'bg-[#00d9ff]/10 border-[#00d9ff] text-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.25)]' 
                            : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Tab Contents */}
                <div className="flex-1 min-h-[300px] mt-6 z-10 overflow-y-auto pr-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'quests' ? (
                            <motion.div 
                                key="quests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {quests.map((quest) => {
                                    const isJoined = registeredQuests.includes(quest.id);
                                    return (
                                        <motion.div
                                            key={quest.id}
                                            whileHover={{ y: -6, scale: 1.02 }}
                                            className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00d9ff]/40 transition-all cursor-pointer relative overflow-hidden group"
                                            style={{
                                                boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.8)`
                                            }}
                                            onClick={() => setSelectedQuest(quest)}
                                        >
                                            {/* Hover Glow Background */}
                                            <div 
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                                style={{
                                                    background: `radial-gradient(circle at 50% 120%, ${quest.glow}, transparent 60%)`
                                                }}
                                            />
                                            
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-white text-lg font-black tracking-wider uppercase">{quest.title}</h3>
                                                    <span className="text-xxs border border-slate-700 px-2.5 py-0.5 rounded-full text-slate-400 font-bold uppercase tracking-wider">
                                                        {quest.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-[#00d9ff] text-xs font-semibold uppercase tracking-wider mt-1">{quest.subtitle}</p>
                                                <p className="text-slate-400 text-xs mt-4 leading-relaxed line-clamp-3">{quest.desc}</p>
                                            </div>

                                            <div className="mt-6 border-t border-slate-800/60 pt-4 flex justify-between items-center">
                                                <div>
                                                    <span className="block text-slate-500 text-xxs uppercase tracking-wider">Reward</span>
                                                    <span className="text-white text-sm font-black tracking-wide" style={{ color: quest.color }}>{quest.reward}</span>
                                                </div>

                                                <button 
                                                    className={`px-5 py-2 rounded-xl text-xxs font-black uppercase tracking-widest border transition-all ${
                                                        isJoined 
                                                        ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400 cursor-default'
                                                        : 'bg-transparent border-slate-700 text-white hover:bg-white hover:text-black hover:border-white'
                                                    }`}
                                                    onClick={(e) => {
                                                        if (isJoined) return;
                                                        e.stopPropagation();
                                                        setSelectedQuest(quest);
                                                    }}
                                                >
                                                    {isJoined ? 'Joined' : 'Join Quest'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="leaderboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden"
                            >
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400 text-xxs uppercase font-black tracking-wider">
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">Username</th>
                                            <th className="px-6 py-4">Faction Guild</th>
                                            <th className="px-6 py-4 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white text-sm font-bold">
                                        {leaderboard.map((player) => (
                                            <tr key={player.rank} className="border-b border-slate-900/60 hover:bg-[#00d9ff]/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block h-6 w-6 text-center leading-6 rounded-full text-xs font-black ${
                                                        player.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                        player.rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' :
                                                        player.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                                                        'text-slate-500'
                                                    }`}>
                                                        {player.rank}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 tracking-wide font-black">{player.name}</td>
                                                <td className="px-6 py-4 text-[#00d9ff]/80 font-black">{player.guild}</td>
                                                <td className="px-6 py-4 text-right text-white font-black">{player.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center border-t border-[#00d9ff]/10 pt-6 mt-6 z-10">
                    <button 
                        onClick={handleExit}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.0}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Exit Arena
                    </button>
                    
                    <span className="text-[#00d9ff]/30 text-xxs uppercase tracking-widest font-black hidden md:inline">
                        Techfest Terminal v2.0.26
                    </span>
                </div>
            </motion.div>

            {/* Quest Joining Modal Dialog */}
            <AnimatePresence>
                {selectedQuest && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md pointer-events-auto"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-lg bg-[#070c1a] border border-[#00d9ff]/20 rounded-3xl p-6 md:p-8 relative overflow-hidden"
                            style={{
                                boxShadow: `0 0 40px ${selectedQuest.glow}`
                            }}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start border-b border-[#00d9ff]/10 pb-4 mb-6">
                                <div>
                                    <span className="text-xxs uppercase tracking-widest font-black" style={{ color: selectedQuest.color }}>Active Guild Quest</span>
                                    <h2 className="text-white text-2xl font-black uppercase tracking-wider mt-0.5">{selectedQuest.title}</h2>
                                </div>
                                <button 
                                    onClick={() => setSelectedQuest(null)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 bg-[#070c1a] flex flex-col items-center justify-center text-center p-6"
                                    >
                                        <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white text-xl font-black uppercase tracking-wider">QUEST ACCEPTED</h3>
                                        <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
                                            Welcome to the **{selectedQuest.title}**. Your credentials have been successfully registered into the database.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Quest Details & Registration Form */}
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-slate-400 text-xxs uppercase tracking-wider font-bold">Player Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your arcade name..." 
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d9ff]/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-slate-400 text-xxs uppercase tracking-wider font-bold">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="player@arena.com" 
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d9ff]/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-slate-400 text-xxs uppercase tracking-wider font-bold">College / Affiliation</label>
                                    <input 
                                        type="text"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                        placeholder="NIT Arunachal Pradesh" 
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00d9ff]/50 transition-colors"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedQuest(null)}
                                        className="flex-1 bg-transparent border border-slate-800 text-slate-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900/50 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    
                                    <button 
                                        type="submit"
                                        className="flex-1 text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-102"
                                        style={{ 
                                            backgroundColor: selectedQuest.color,
                                            color: '#ffffff',
                                            boxShadow: `0 0 20px ${selectedQuest.glow}`
                                        }}
                                    >
                                        Accept Quest
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
