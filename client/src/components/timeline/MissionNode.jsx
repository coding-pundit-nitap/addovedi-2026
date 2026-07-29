import { useState, useEffect, useRef } from 'react';

import { CATEGORY_ICONS } from '../../data/events';
export { CATEGORY_ICONS };

export default function MissionNode({ ev, isSelected, isCompleted, onClick, revealed, delay }) {
    const [hov, setHov] = useState(false);
    const [angle, setAngle] = useState(0);
    const raf = useRef(null);
    const catInfo = CATEGORY_ICONS[ev.category] || { icon: '◆', color: '#00E5FF' };
    const nodeColor = catInfo.color;

    useEffect(() => {
        let a = 0;
        const go = () => { a += (isSelected || hov) ? 0.06 : 0.015; setAngle(a); raf.current = requestAnimationFrame(go); };
        raf.current = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf.current);
    }, [isSelected, hov]);

    const size = isSelected ? 56 : hov ? 50 : 42;

    return (
        <div style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
            cursor:'pointer',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'scale(1)' : 'scale(0.1)',
            transition: `opacity 0.4s ease ${delay}s, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
        }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onClick={onClick}
        >
            {/* Reactor node */}
            <div style={{ position:'relative', width:`${size + 16}px`, height:`${size + 16}px`, display:'flex', alignItems:'center', justifycontent:'center' }}>
                {/* Outer rotating ring */}
                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', transform:`rotate(${angle}rad)` }} viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="32" fill="none" stroke={nodeColor} strokeWidth="1.5"
                        strokeDasharray={isSelected || hov ? "4 2" : "6 4"}
                        opacity={isSelected ? 1 : hov ? 0.8 : 0.4}
                        style={{ filter: (isSelected || hov) ? `drop-shadow(0 0 4px ${nodeColor})` : 'none' }}
                    />
                    {(isSelected || hov) && [0, 120, 240].map(d => {
                        const r = d * Math.PI / 180;
                        return <circle key={d} cx={36 + 32 * Math.cos(r)} cy={36 + 32 * Math.sin(r)} r="2.5" fill={nodeColor} />;
                    })}
                </svg>

                {/* Middle glow ring */}
                <div style={{
                    position:'absolute',
                    width:`${size - 8}px`, height:`${size - 8}px`,
                    borderRadius:'50%',
                    border:`2px solid ${nodeColor}`,
                    boxShadow: isSelected
                        ? `0 0 18px ${nodeColor}, 0 0 36px ${nodeColor}60, inset 0 0 12px ${nodeColor}25`
                        : hov ? `0 0 10px ${nodeColor}80` : `0 0 4px ${nodeColor}40`,
                    background: `radial-gradient(circle, ${nodeColor}18 0%, transparent 70%)`,
                    transition:'box-shadow 0.3s',
                    animation:'nodePulse 2s ease-in-out infinite',
                }} />

                {/* Core icon */}
                <div style={{
                    position:'relative', zIndex:2,
                    fontSize: isSelected ? '20px' : '16px',
                    filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.8))' : 'none',
                    transition:'font-size 0.3s',
                }}>
                    {isCompleted ? '✓' : catInfo.icon}
                </div>

                {/* Ripple on select */}
                {isSelected && (
                    <div style={{
                        position:'absolute', inset:0,
                        borderRadius:'50%',
                        border:`2px solid ${nodeColor}`,
                        animation:'rippleOut 1s ease-out infinite',
                    }} />
                )}
            </div>

            {/* Time label */}
            <div style={{
                fontFamily:"'Orbitron',monospace",
                fontSize:'9px', fontWeight:700,
                color: isSelected ? '#FFF' : hov ? nodeColor : 'rgba(255,255,255,0.4)',
                letterSpacing:'0.12em',
                textShadow: isSelected ? `0 0 8px ${nodeColor}` : 'none',
                transition:'color 0.3s',
            }}>{ev.time}</div>

            {/* Category badge */}
            <div style={{
                fontSize:'7px',
                color: isSelected ? nodeColor : 'rgba(255,255,255,0.2)',
                letterSpacing:'0.15em',
                fontFamily:"'Orbitron',monospace",
                transition:'color 0.3s',
                whiteSpace:'nowrap',
            }}>
                {ev.category.toUpperCase()}
            </div>
        </div>
    );
}
