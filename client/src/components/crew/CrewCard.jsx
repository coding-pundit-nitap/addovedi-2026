import { useState, useRef } from 'react';

export default function CrewCard({ member, isFeatured, isMobile }) {
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

    const badgeColor = member.color;
    const isOverlayVisible = isMobile ? tapExpanded : isHovered;

    // Use a high-tech retro pixel seed avatar representation
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${member.avatarSeed}`;

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
                border: '1.2px solid rgba(0, 229, 255, 0.15)',
                background: isHovered || isFeatured 
                    ? 'rgba(6, 12, 24, 0.92)' 
                    : 'rgba(6, 12, 24, 0.65)',
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
                    SYSTEM CREW
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

                    {/* Pixel Art Avatar Image */}
                    <img 
                        src={avatarUrl} 
                        alt={member.name}
                        style={{
                            width: '80%',
                            height: '80%',
                            objectFit: 'contain',
                            imageRendering: 'pixelated',
                            zIndex: 1,
                            opacity: 0.9
                        }}
                    />
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

            {/* Hover Project / Social Slide-up Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(3, 8, 16, 0.98)',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isOverlayVisible ? 1 : 0,
                transform: isOverlayVisible ? 'translateY(0%)' : 'translateY(15%)',
                transition: 'opacity 0.18s ease-out, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
                pointerEvents: isOverlayVisible ? 'auto' : 'none',
                border: `1.2px solid ${badgeColor}`,
                borderRadius: '12px'
            }}>
                {/* Details list */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: isMobile ? '8px' : '12px',
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
                                <span style={{ color: badgeColor, fontSize: isMobile ? '8px' : '11px', lineHeight: 1.35 }}>▶</span>
                                <span style={{ fontFamily: 'monospace', fontSize: isMobile ? '9px' : '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.35 }}>{mission}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contacts & Social Networks */}
                <div>
                    <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: isMobile ? '8px' : '12px',
                        letterSpacing: '0.2em',
                        color: badgeColor,
                        borderBottom: `1px solid ${badgeColor}30`,
                        paddingBottom: '6px',
                        marginBottom: '8px'
                    }}>
                        COMMUNICATIONS
                    </div>

                    {/* Direct Contact info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                        {member.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '9px' : '12.5px', fontFamily: 'monospace', color: '#fff' }}>
                                <span style={{ color: badgeColor }}>📞</span>
                                <a href={`tel:${member.phone}`} onClick={e => e.stopPropagation()} style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none' }} className="hover:text-white">
                                    {member.phone}
                                </a>
                            </div>
                        )}
                        {member.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '9px' : '12.5px', fontFamily: 'monospace', color: '#fff', overflow: 'hidden' }}>
                                <span style={{ color: badgeColor }}>✉</span>
                                <a href={`mailto:${member.email}`} onClick={e => e.stopPropagation()} style={{ color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} className="hover:text-white">
                                    {member.email}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Socials buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: isMobile ? '7.5px' : '10px',
                                padding: isMobile ? '6px 0' : '8px 0',
                                borderRadius: '4px',
                                border: `1.2px solid ${badgeColor}30`,
                                background: 'rgba(255,255,255,0.02)',
                                color: badgeColor,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontWeight: 'bold'
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
                            LINKEDIN
                        </a>
                        <a
                            href={member.insta}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: "'Orbitron', monospace",
                                fontSize: isMobile ? '7.5px' : '10px',
                                padding: isMobile ? '6px 0' : '8px 0',
                                borderRadius: '4px',
                                border: `1.2px solid ${badgeColor}30`,
                                background: 'rgba(255,255,255,0.02)',
                                color: badgeColor,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                fontWeight: 'bold'
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
                            INSTAGRAM
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
