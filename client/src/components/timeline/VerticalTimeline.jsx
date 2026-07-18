import { useState } from 'react';
import { CATEGORY_ICONS } from './MissionNode';

const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.trim().split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

export function getEventStatus(ev) {
    return ev.status || 'UPCOMING';
}

function TimelineCard({ ev, catInfo, isSelected, isHovered, statusText, statusColor, onClick, onMouseEnter, onMouseLeave }) {
    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="timeline-track-card-wrap"
            style={{
                width: '100%',
                maxWidth: '320px',
                '--btn-border-color': isSelected 
                    ? catInfo.color 
                    : isHovered 
                        ? catInfo.color + 'aa' 
                        : 'rgba(0, 229, 255, 0.15)',
                transform: isSelected ? 'scale(1.02)' : isHovered ? 'translateY(-2px)' : 'none',
                boxShadow: isSelected 
                    ? `0 0 20px ${catInfo.color}35` 
                    : isHovered 
                        ? `0 0 12px ${catInfo.color}15` 
                        : 'none',
            }}
        >
            <div className="timeline-track-card-inner">
                {/* Top header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '9px',
                        color: catInfo.color,
                        letterSpacing: '0.12em',
                        fontWeight: 700
                    }}>
                        {ev.time} – {ev.end}
                    </span>
                    
                    {/* Live status badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: statusColor,
                            boxShadow: statusColor !== 'rgba(255,255,255,0.4)' ? `0 0 6px ${statusColor}` : 'none',
                            animation: statusText === 'LIVE NOW' ? 'slotPulse 1.2s ease-in-out infinite' : 'none'
                        }} />
                        <span style={{
                            fontFamily: "'Orbitron', monospace",
                            fontSize: '7px',
                            color: statusColor,
                            letterSpacing: '0.1em',
                            fontWeight: 'bold'
                        }}>
                            {statusText}
                        </span>
                    </div>
                </div>

                {/* Main event info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h3 style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '13px',
                        fontWeight: 900,
                        color: '#ffffff',
                        margin: 0,
                        letterSpacing: '0.05em',
                        textShadow: isSelected ? `0 0 8px ${catInfo.color}40` : 'none'
                    }}>
                        {ev.title}
                    </h3>
                    <p style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '8px',
                        color: 'rgba(255,255,255,0.4)',
                        margin: 0,
                        letterSpacing: '0.1em'
                    }}>
                        {ev.subtitle}
                    </p>
                </div>

                {/* Info row */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '8px',
                    marginTop: '2px'
                }}>
                    <span style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '7px',
                        color: 'rgba(255,255,255,0.3)',
                        letterSpacing: '0.1em'
                    }}>
                        VENUE: <strong style={{ color: '#fff' }}>{ev.venue}</strong>
                    </span>
                    <span style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '7px',
                        color: catInfo.color,
                        border: `1px solid ${catInfo.color}40`,
                        background: `${catInfo.color}08`,
                        padding: '1.5px 6px',
                        borderRadius: '3px',
                        fontWeight: 700
                    }}>
                        {ev.category.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function VerticalTimeline({ events, selectedId, onSelect, revealed, dayColor, now24 }) {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div style={{ position: 'relative', width: '100%', padding: '20px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative', zIndex: 1 }}>
                {events.map((ev, i) => {
                    const isLeft = i % 2 === 0;
                    const catInfo = CATEGORY_ICONS[ev.category] || { icon: '◆', color: '#00E5FF' };
                    const isSelected = selectedId === ev.id;
                    const isHovered = hoveredId === ev.id;
                    const status = getEventStatus(ev);
                    
                    const statusText = status === 'LIVE' ? 'LIVE NOW' : status === 'COMPLETED' ? 'COMPLETED' : 'UPCOMING';
                    const statusColor = status === 'LIVE' ? '#FF1F4F' : status === 'COMPLETED' ? '#1FFF76' : 'rgba(255,255,255,0.4)';

                    const activeSize = '38px';
                    const inactiveSize = '30px';
                    const currentSize = isSelected || isHovered ? activeSize : inactiveSize;

                    return (
                        <div
                            key={ev.id}
                            style={{
                                display: 'flex',
                                width: '100%',
                                position: 'relative',
                                minHeight: '120px',
                                alignItems: 'center',
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* Left Side Container */}
                            <div style={{
                                width: '43%',
                                display: 'flex',
                                alignItems: 'center',
                                justifycontent: 'flex-end',
                                boxSizing: 'border-box',
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? 'none' : `translateX(${isLeft ? '0' : '20px'})`,
                                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                            }}>
                                {isLeft && (
                                    <>
                                        <TimelineCard
                                            ev={ev}
                                            catInfo={catInfo}
                                            isSelected={isSelected}
                                            isHovered={isHovered}
                                            statusText={statusText}
                                            statusColor={statusColor}
                                            onClick={() => onSelect(ev)}
                                            onMouseEnter={() => setHoveredId(ev.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        />
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: isSelected || isHovered ? catInfo.color : `${dayColor}80`,
                                            boxShadow: isSelected || isHovered ? `0 0 10px ${catInfo.color}` : 'none',
                                            marginRight: '-3px',
                                            zIndex: 6,
                                            transition: 'all 0.3s ease'
                                        }} />
                                        <div style={{
                                            width: '35px',
                                            height: '2px',
                                            background: isSelected || isHovered 
                                                ? `linear-gradient(270deg, ${catInfo.color}, transparent)` 
                                                : `linear-gradient(270deg, ${dayColor}30, transparent)`,
                                            boxShadow: isSelected || isHovered ? `0 0 6px ${catInfo.color}` : 'none',
                                            zIndex: 1,
                                            transition: 'all 0.3s ease',
                                        }} />
                                    </>
                                )}
                            </div>

                            {/* Center Node Container */}
                            <div style={{
                                width: '14%',
                                display: 'flex',
                                position: 'relative',
                                zIndex: 5,
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: isLeft ? '0px' : 'auto',
                                    right: !isLeft ? '0px' : 'auto',
                                    top: '50%',
                                    transform: isLeft ? 'translate(-50%, -50%)' : 'translate(50%, -50%)',
                                    zIndex: 5,
                                    cursor: 'pointer',
                                }}
                                    onClick={() => onSelect(ev)}
                                    onMouseEnter={() => setHoveredId(ev.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div style={{
                                        width: currentSize,
                                        height: currentSize,
                                        borderRadius: '50%',
                                        border: `2px solid ${isSelected || isHovered ? catInfo.color : dayColor + '70'}`,
                                        background: isSelected || isHovered ? catInfo.color : '#06080F',
                                        boxShadow: isSelected || isHovered ? `0 0 15px ${catInfo.color}, inset 0 0 5px #fff` : `0 0 5px ${dayColor}30`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: isSelected || isHovered ? '18px' : '14px',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        color: isSelected || isHovered ? '#000' : 'rgba(255,255,255,0.6)'
                                    }}>
                                        {catInfo.icon}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side Container */}
                            <div style={{
                                width: '43%',
                                display: 'flex',
                                alignItems: 'center',
                                justifycontent: 'flex-start',
                                boxSizing: 'border-box',
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? 'none' : `translateX(${!isLeft ? '0' : '-20px'})`,
                                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                            }}>
                                {!isLeft && (
                                    <>
                                        <div style={{
                                            width: '35px',
                                            height: '2px',
                                            background: isSelected || isHovered 
                                                ? `linear-gradient(90deg, ${catInfo.color}, transparent)` 
                                                : `linear-gradient(90deg, ${dayColor}30, transparent)`,
                                            boxShadow: isSelected || isHovered ? `0 0 6px ${catInfo.color}` : 'none',
                                            zIndex: 1,
                                            transition: 'all 0.3s ease',
                                        }} />
                                        <div style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: isSelected || isHovered ? catInfo.color : `${dayColor}80`,
                                            boxShadow: isSelected || isHovered ? `0 0 10px ${catInfo.color}` : 'none',
                                            marginLeft: '-3px',
                                            zIndex: 6,
                                            transition: 'all 0.3s ease'
                                        }} />
                                        <TimelineCard
                                            ev={ev}
                                            catInfo={catInfo}
                                            isSelected={isSelected}
                                            isHovered={isHovered}
                                            statusText={statusText}
                                            statusColor={statusColor}
                                            onClick={() => onSelect(ev)}
                                            onMouseEnter={() => setHoveredId(ev.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        />
                                    </>
                                )}
                            </div>

                            {i < events.length - 1 && (() => {
                                return (
                                    <svg
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '43%',
                                            width: '14%',
                                            height: 'calc(100% + 30px)',
                                            pointerEvents: 'none',
                                            zIndex: 2,
                                        }}
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d={isLeft ? "M 0,0 L 0,20 L 100,80 L 100,100" : "M 100,0 L 100,20 L 0,80 L 0,100"}
                                            fill="none"
                                            stroke={isSelected || isHovered || selectedId === events[i+1].id || hoveredId === events[i+1].id ? catInfo.color : `${dayColor}40`}
                                            strokeWidth="2.5"
                                            strokeDasharray="6 4"
                                            style={{
                                                animation: 'strokeMove 0.8s linear infinite',
                                                filter: isSelected || isHovered || selectedId === events[i+1].id || hoveredId === events[i+1].id ? `drop-shadow(0 0 5px ${catInfo.color})` : 'none',
                                                transition: 'stroke 0.3s, filter 0.3s',
                                            }}
                                        />
                                    </svg>
                                );
                            })()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
