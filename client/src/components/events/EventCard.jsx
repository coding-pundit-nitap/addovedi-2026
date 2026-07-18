import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../data/events';

export default function EventCard({ subEvent, idx, activeCategory, categoryName }) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
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
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 border-0 cursor-pointer"
                            style={{
                                background: isHovered ? '#ffffff' : `linear-gradient(135deg, ${activeCategory.color}e0 0%, ${activeCategory.color}80 100%)`,
                                color: isHovered ? '#000000' : '#ffffff',
                                boxShadow: isHovered ? `0 0 15px #ffffff` : `0 0 10px ${activeCategory.color}40`,
                                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                            }}
                        >
                            ENTER ARENA ⊕
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
