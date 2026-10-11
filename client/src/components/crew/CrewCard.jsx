export default function CrewCard({ member, isFeatured, isMobile }) {
    const badgeColor = member.color || '#00E5FF';

    // Prefer a real uploaded photo (admin-portal `avatar` field); fall back to
    // a generated retro pixel-art avatar when none is set.
    const avatarUrl = member.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${member.avatarSeed || member.name}`;

    // Socials: static data has fixed `linkedin`/`insta` fields; DB-sourced
    // crew has a generic `links: [{ platform, url }]` array instead.
    const socialLinks = Array.isArray(member.links) && member.links.length > 0
        ? member.links.filter(l => l?.url)
        : [
            ...(member.linkedin ? [{ platform: 'LinkedIn', url: member.linkedin }] : []),
            ...(member.insta ? [{ platform: 'Instagram', url: member.insta }] : [])
        ];

    const hasContact = Boolean(member.phone || member.email || socialLinks.length);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: '12px',
                border: `1.2px solid ${isFeatured ? `${badgeColor}80` : 'rgba(0, 229, 255, 0.15)'}`,
                background: 'rgba(6, 12, 24, 0.85)',
                boxShadow: isFeatured
                    ? `0 0 25px ${badgeColor}40, inset 0 0 15px rgba(0, 229, 255, 0.12)`
                    : '0 4px 20px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                padding: isMobile ? '10px' : '14px',
                gap: isMobile ? '8px' : '12px',
                overflow: 'hidden'
            }}
        >
            {/* Department chip */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: isMobile ? '7px' : '8px',
                    letterSpacing: '0.15em',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${badgeColor}50`,
                    color: badgeColor,
                    background: `${badgeColor}12`
                }}>
                    SYSTEM CREW
                </span>
            </div>

            {/* Portrait: square, rounded corners (real photo or pixel-art fallback) */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '10px',
                overflow: 'hidden',
                border: `1.5px solid ${badgeColor}55`,
                background: 'rgba(3, 8, 16, 0.85)'
            }}>
                <img
                    src={avatarUrl}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    width="560"
                    height="560"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: member.avatar ? 'cover' : 'contain',
                        objectPosition: member.avatar ? 'center 20%' : 'center',
                        padding: member.avatar ? 0 : '10%',
                        boxSizing: 'border-box',
                        imageRendering: member.avatar ? 'auto' : 'pixelated',
                        display: 'block'
                    }}
                />
            </div>

            {/* Identity */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: isMobile ? '11px' : '14px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    color: '#fff',
                    lineHeight: 1.25,
                    overflowWrap: 'anywhere'
                }}>
                    {member.name.toUpperCase()}
                </div>
                <div style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: isMobile ? '10px' : '13px',
                    fontWeight: 800,
                    color: badgeColor,
                    letterSpacing: '0.08em',
                    marginTop: '6px',
                    textTransform: 'uppercase',
                    lineHeight: 1.3,
                    textShadow: `0 0 10px ${badgeColor}60`
                }}>
                    {member.role}
                </div>
            </div>

            {/* Contact details, always visible on the card */}
            {hasContact && (
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${badgeColor}25`, paddingTop: isMobile ? '8px' : '10px' }}>
                    {member.phone && (
                        <a href={`tel:${member.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'monospace', fontSize: isMobile ? '10px' : '12.5px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                            <span style={{ color: badgeColor }}>📞</span>{member.phone}
                        </a>
                    )}
                    {member.email && (
                        <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'monospace', fontSize: isMobile ? '9px' : '11.5px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', overflowWrap: 'anywhere', textAlign: 'center' }}>
                            <span style={{ color: badgeColor }}>✉</span>{member.email}
                        </a>
                    )}
                    {socialLinks.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {socialLinks.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        fontFamily: "'Orbitron', monospace",
                                        fontSize: isMobile ? '8px' : '10px',
                                        padding: isMobile ? '6px 0' : '7px 0',
                                        borderRadius: '4px',
                                        border: `1.2px solid ${badgeColor}55`,
                                        background: `${badgeColor}10`,
                                        color: badgeColor,
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {(link.platform || 'LINK').toUpperCase()}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
