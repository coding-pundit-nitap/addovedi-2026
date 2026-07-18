import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ICONS } from './MissionNode';
import { EVENT_COORDINATORS } from '../../data/events';

export default function EventPanel({ ev, dayColor, visible, onClose }) {
    const navigate = useNavigate();
    const [scanPos, setScanPos] = useState(0);
    const [isRegHover, setIsRegHover] = useState(false);
    const raf = useRef(null);

    useEffect(() => {
        let pos = 0;
        const go = () => {
            pos = (pos + 0.4) % 110;
            setScanPos(pos);
            raf.current = requestAnimationFrame(go);
        };
        raf.current = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf.current);
    }, []);

    const catInfo = ev ? (CATEGORY_ICONS[ev.category] || { icon:'◆', color:'#00E5FF' }) : null;
    const color = ev ? (catInfo?.color || dayColor) : dayColor;

    return (
        <div style={{
            position:'relative',
            background:'rgba(6,8,15,0.92)',
            border:`1px solid ${visible && ev ? color + '60' : 'rgba(0,229,255,0.15)'}`,
            borderRadius:'12px',
            padding:'24px 20px',
            backdropFilter:'blur(16px)',
            boxShadow: visible && ev ? `0 0 30px ${color}20, inset 0 0 40px rgba(0,229,255,0.03)` : 'none',
            overflow:'hidden',
            transition:'border-color 0.4s, box-shadow 0.4s',
            minHeight:'360px',
            display:'flex',
            flexDirection:'column',
        }}>
            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '14px',
                        color: color,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        zIndex: 25,
                        fontFamily: 'monospace',
                        textShadow: `0 0 5px ${color}`
                    }}
                    aria-label="Close"
                >
                    ✕
                </button>
            )}

            {/* Corner brackets */}
            {[0,1,2,3].map(i => (
                <div key={i} style={{
                    position:'absolute', width:'14px', height:'14px',
                    ...(i===0 && { top:'6px', left:'6px', borderTop:`1.5px solid ${color}`, borderLeft:`1.5px solid ${color}` }),
                    ...(i===1 && { top:'6px', right:'6px', borderTop:`1.5px solid ${color}`, borderRight:`1.5px solid ${color}` }),
                    ...(i===2 && { bottom:'6px', left:'6px', borderBottom:`1.5px solid ${color}`, borderLeft:`1.5px solid ${color}` }),
                    ...(i===3 && { bottom:'6px', right:'6px', borderBottom:`1.5px solid ${color}`, borderRight:`1.5px solid ${color}` }),
                    opacity: 0.7,
                    transition:'border-color 0.4s',
                }} />
            ))}

            {/* Moving scan line */}
            <div style={{
                position:'absolute', left:0, right:0,
                top:`${scanPos}%`, height:'1px',
                background:`linear-gradient(90deg, transparent, ${color}30, transparent)`,
                pointerEvents:'none',
            }} />

            {!ev ? (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px' }}>
                    <div style={{ fontSize:'32px', opacity:0.15 }}>🎯</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'9px', color:'rgba(0,229,255,0.25)', letterSpacing:'0.35em', textAlign:'center', lineHeight:2 }}>
                        SELECT A MISSION NODE<br />TO VIEW DETAILS
                    </div>
                </div>
            ) : (
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition:'opacity 0.35s ease, transform 0.35s ease' }}>
                    {/* Header */}
                    <div style={{ borderBottom:`1px solid ${color}25`, paddingBottom:'14px', marginBottom:'14px' }}>
                        <div style={{ fontSize:'10px', fontFamily:"'Orbitron',monospace", color:color, letterSpacing:'0.3em', opacity:0.7 }}>
                            // {ev.id.toUpperCase()} — {ev.category.toUpperCase()}
                        </div>
                        <div style={{ fontSize:'clamp(14px,2vw,20px)', fontWeight:900, color:'#FFF', fontFamily:"'Orbitron',monospace", letterSpacing:'0.08em', marginBottom:'4px', lineHeight:1.2 }}>
                            {ev.title}
                        </div>
                        <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.2em', fontFamily:"'Orbitron',monospace" }}>
                            {ev.subtitle}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:'16px' }}>
                        {ev.desc}
                    </div>

                    {/* Details grid */}
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
                        {[
                            { label:'TIME',         val:`${ev.time} – ${ev.end}` },
                            { label:'VENUE',        val: ev.venue },
                            { label:'MODE',         val: ev.mode },
                            { label:'REGISTRATION', val:`${ev.registered} TEAMS / PLAYERS` },
                            { label:'PRIZE POOL',   val: ev.prize },
                        ].map(({ label, val }) => (
                            <div key={label} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', color:color, letterSpacing:'0.2em', opacity:0.65, minWidth:'90px', paddingTop:'1px' }}>
                                    {label}
                                </div>
                                <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.75)', fontWeight:600, lineHeight:1.4 }}>
                                    {val}
                                </div>
                            </div>
                        ))}

                        {/* Event Heads Contact */}
                        {EVENT_COORDINATORS[ev.title.toUpperCase()] && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '12px' }}>
                                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:'7px', color:color, letterSpacing:'0.2em', opacity:0.65, marginBottom: '6px' }}>
                                    EVENT HEADS
                                </div>
                                {EVENT_COORDINATORS[ev.title.toUpperCase()].map((c, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', marginBottom: '4px' }}>
                                        <span>{c.name}</span>
                                        <span style={{ color: color }}>{c.phone}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Register button */}
                    <button 
                        onClick={() => {
                            if (ev.categorySlug) {
                                navigate(`/event/${ev.categorySlug}/${ev.id}`);
                            } else {
                                navigate('/event');
                            }
                        }}
                        onMouseEnter={() => setIsRegHover(true)}
                        onMouseLeave={() => setIsRegHover(false)}
                        style={{
                            marginTop:'18px',
                            width:'100%', padding:'10px',
                            background: isRegHover
                                ? `linear-gradient(135deg, ${color}44, ${color}22)`
                                : `linear-gradient(135deg, ${color}22, ${color}12)`,
                            border: `1px solid ${isRegHover ? color : color + '80'}`,
                            borderRadius:'6px',
                            color: isRegHover ? '#ffffff' : color,
                            fontFamily:"'Orbitron',monospace",
                            fontSize:'10px', fontWeight:900,
                            letterSpacing:'0.35em',
                            cursor:'pointer',
                            boxShadow: isRegHover
                                ? `0 0 22px ${color}60, inset 0 0 10px ${color}30`
                                : `0 0 12px ${color}25`,
                            transform: isRegHover ? 'translateY(-2px)' : 'none',
                            transition:'all 0.25s ease-in-out',
                        }}
                    >
                        REGISTER →
                    </button>
                </div>
            )}
        </div>
    );
}
