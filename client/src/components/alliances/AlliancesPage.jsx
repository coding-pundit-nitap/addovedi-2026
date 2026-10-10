/**
 * AlliancesPage.jsx — ADDOVEDI 2026 PARTNERS (Sponsors)
 *
 * Tiered partner showcase: Platinum / Gold / Silver sponsors, then Technical,
 * Event, Travel, Media and Barter partners. Card size scales with the tier.
 * Partners come from the backend (`/alliances`, managed in Admin), with a static fallback.
 */

import { useState, useEffect, useRef } from 'react';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';
import MotionCard from '../common/MotionCard';
import { API_BASE } from '../../constants/api';

// Admin-managed categories have a priority 1-5 that sets card size and order (1 = largest, shown first).
const SIZE_BY_PRIORITY = { 1: 'xl', 2: 'lg', 3: 'md', 4: 'sm', 5: 'xs' };

// Offline fallback, mirrors server/scripts/seedSponsors.js
const FALLBACK_CATEGORIES = [
    { name: 'PLATINUM', priority: 1, color: '#E5F6FF' },
    { name: 'GOLD', priority: 2, color: '#FFD700' },
    { name: 'SILVER', priority: 3, color: '#B8C4D6' },
    { name: 'TECHNICAL', priority: 4, color: '#00E5FF' },
    { name: 'EVENT', priority: 4, color: '#7A5CFF' },
    { name: 'TRAVEL', priority: 4, color: '#1FFF76' },
    { name: 'MEDIA', priority: 5, color: '#FF2CFB' },
    { name: 'BARTER', priority: 5, color: '#FBBF24' },
];

// Offline fallback sponsors; the live list comes from the backend.
const LOGO_FILES = {"TRUSCHOLAR": "truscholar.png", "SOLIDWORKS": "solidworks.svg", "AIMIL": "aimil.png", "NODWIN GAMING × KRAFTON": "nodwin.svg", "ZEBRONICS": "zebronics.png", "UNSTOP": "unstop.svg", "DENVER": "denver.png", "JIOSAAVN": "jiosaavn.svg", "EASEMYTRIP": "easemytrip.png", "CAMPUS KARMA": "campuskarma.jpg", "ABHIBUS": "abhibus.png"};
const f = (name, category, sub, desc, pending = false) => ({ name, category, sub, desc, pending, logoImage: `/sponsors/${LOGO_FILES[name]}` });
const FALLBACK = [
    f('TRUSCHOLAR', 'PLATINUM', 'Official Credential Partner', 'Every Addovedi 2026 certificate is issued through the TruScholar blockchain-powered digital credential platform, with a lifetime Smart Credential Wallet, AI Career Coach and a job & internship portal for participants.'),
    f('SOLIDWORKS', 'GOLD', 'Gold Sponsor', 'Powering SOLID SIEGE, with student licenses and certification vouchers for winners and an onboarding webinar on SOLIDWORKS design.'),
    f('AIMIL', 'SILVER', 'Sponsor', 'Supporting Addovedi 2026 as an official sponsor.'),
    f('NODWIN GAMING × KRAFTON', 'SILVER', 'Gaming Partner', 'Prize pools and branding for the BGMI and Real Cricket tournaments.', true),
    f('ZEBRONICS', 'TECHNICAL', 'Official Tech Partner', 'Stage pillars, campus standees and product goodies for the fest.', true),
    f('UNSTOP', 'TECHNICAL', 'Platform Partner', 'Event listing and registration platform, with goodies for participants.'),
    f('DENVER', 'EVENT', 'Fragrance Partner', 'Free sampling for attendees, an experience zone, games and hampers for winners.'),
    f('JIOSAAVN', 'EVENT', 'Official Music Streaming Partner', 'Pro codes as prizes and presence across music events and Pronite.'),
    f('EASEMYTRIP', 'TRAVEL', 'Official Travel Partner', '300 travel vouchers for flights and hotels, valid for 5 months.'),
    f('CAMPUS KARMA', 'MEDIA', 'Media Partner', 'Promotional posts and articles before and after the fest.'),
    f('ABHIBUS', 'BARTER', 'Barter Partner', 'Bus travel vouchers and student referral offers.', true),
];

const SIZES = {
    xl: { pad: 56, name: 46, logoH: 120, minH: 380, w: 860, desc: 14 },
    lg: { pad: 40, name: 32, logoH: 80, minH: 270, w: 560, desc: 12.5 },
    md: { pad: 28, name: 22, logoH: 56, minH: 200, w: 400, desc: 11.5 },
    sm: { pad: 20, name: 17, logoH: 40, minH: 150, w: 300, desc: 11 },
    xs: { pad: 16, name: 15, logoH: 34, minH: 120, w: 260, desc: 10.5 },
};

function BgCanvas() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const GRID = 64;
        const stars = Array.from({ length: 70 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.08,
            r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.3 + 0.05
        }));

        let frame = 0;
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Faint Grid
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            // Floating Star Particles
            stars.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.a;
                ctx.fillStyle = '#00E5FF';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Slow data streams
            if (frame % 80 === 0) {
                ctx.globalAlpha = 0.02;
                ctx.fillStyle = '#00E5FF';
                ctx.font = '8px monospace';
                ctx.fillText('ALLIANCE_LINK_SYNC', Math.random() * W, Math.random() * H);
            }

            frame++;
            requestAnimationFrame(tick);
        };
        const handle = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(handle); window.removeEventListener('resize', onResize); };
    }, []);

    return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

function PartnerCard({ partner, color, size, index = 0 }) {
    const s = SIZES[size];
    const premium = size === 'xl';
    return (
        <MotionCard delay={(index % 6) * 90} radius={14} style={{ width: '100%', maxWidth: s.w }} maxTilt={premium ? 4 : 7}>
        <div className={premium ? 'pt-premium' : undefined} style={{
            position: 'relative', width: '100%', maxWidth: s.w, minHeight: s.minH,
            padding: s.pad, borderRadius: 14, boxSizing: 'border-box',
            background: premium
                ? `radial-gradient(ellipse at 50% 0%, ${color}26, transparent 65%), linear-gradient(160deg, #0b1626, #050a14)`
                : `${color}08`,
            border: premium ? `1.5px solid ${color}aa` : `1.2px solid ${color}40`,
            boxShadow: premium ? `0 0 60px ${color}33, inset 0 0 40px ${color}12` : `0 0 22px ${color}12, inset 0 0 18px ${color}06`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        }}>
            {premium && <div className="pt-shine" />}
            {premium && <div style={{ fontSize: 22, color, marginBottom: 14, letterSpacing: '0.6em', textShadow: `0 0 14px ${color}` }}>✦ ✦ ✦</div>}
            {partner.pending && (
                <span style={{ position: 'absolute', top: 10, right: 14, fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', color: '#FBBF24' }}>JOINING SOON</span>
            )}
            {partner.logoImage && (
                <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: 10, padding: '10px 18px', marginBottom: 16, maxWidth: '80%', boxShadow: `0 0 18px ${color}33` }}>
                    <img src={partner.logoImage} alt={partner.name} style={{ display: 'block', height: s.logoH, maxWidth: '100%', objectFit: 'contain' }} />
                </div>
            )}
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: partner.logoImage ? 700 : 900, fontSize: `clamp(${Math.round(s.name * 0.6)}px, 4vw, ${s.name}px)`, color: '#fff', letterSpacing: '0.08em', textShadow: `0 0 ${premium ? 24 : 14}px ${color}88` }}>{partner.name}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: premium ? 12 : 10, letterSpacing: '0.22em', color, margin: '10px 0 14px', textTransform: 'uppercase' }}>{partner.sub}</div>
            <p style={{ fontFamily: 'monospace', fontSize: s.desc, lineHeight: 1.75, color: 'rgba(255,255,255,0.62)', margin: '0 auto', maxWidth: 640 }}>{partner.desc}</p>
        </div>
        </MotionCard>
    );
}

export default function AlliancesPage() {
    const [booted, setBooted] = useState(false);
    const pageRef = useRef(null);
    const [partners, setPartners] = useState(FALLBACK);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

    // Poll so Admin edits (logos, tiers) show up without a reload.
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/alliances`, { cache: 'no-store' });
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) setPartners(data);
                const catRes = await fetch(`${API_BASE}/alliances/categories`, { cache: 'no-store' });
                if (catRes.ok && !cancelled) {
                    const cats = await catRes.json();
                    if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
                }
            } catch { /* keep current list */ }
        };
        load();
        const t = setInterval(load, 8000);
        return () => { cancelled = true; clearInterval(t); };
    }, []);

    return (
        <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{ position: 'fixed', inset: 0, background: '#010307', zIndex: 100, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
            <ScrollIndicator scrollRef={pageRef} />
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');\n@keyframes ptShine { 0% { transform: translateX(-120%) skewX(-20deg) } 60%,100% { transform: translateX(260%) skewX(-20deg) } }\n@keyframes ptGlow { 0%,100% { box-shadow: 0 0 50px #E5F6FF2a, inset 0 0 40px #E5F6FF10 } 50% { box-shadow: 0 0 85px #E5F6FF55, inset 0 0 50px #E5F6FF1c } }\n.pt-premium { animation: ptGlow 4s ease-in-out infinite; overflow: hidden }\n.pt-shine { position: absolute; top: 0; left: 0; width: 35%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent); animation: ptShine 5s ease-in-out infinite; pointer-events: none }` }} />
            <BgCanvas />
            <CommonLoader onDone={() => setBooted(true)} pageName="Partners" />

            {booted && (
                <div style={{ animation: 'allianceFadeIn 0.5s ease both' }}>
                    <style>{'@keyframes allianceFadeIn { from { opacity: 0 } to { opacity: 1 } }'}</style>
                    <CommonNav />
                    <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '120px 16px 80px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(26px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', margin: 0, textShadow: '0 0 20px rgba(0,229,255,0.4)' }}>OUR PARTNERS</h1>
                            <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginTop: 12 }}>The brands powering Addovedi 2026, Arunachal Pradesh's biggest technical fest.</p>
                        </div>

                        {[...categories].sort((x, y) => x.priority - y.priority).map(c => ({ id: c.name, label: c.name, color: c.color || '#00E5FF', size: SIZE_BY_PRIORITY[c.priority] || 'md', partners: partners.filter(x => x.category === c.name) })).filter(t => t.partners.length > 0).map((tier, i) => (
                            <section key={tier.id} style={{
                                marginBottom: 28, borderRadius: 16, boxSizing: 'border-box',
                                padding: tier.size === 'xl' ? '40px 20px 48px' : tier.size === 'lg' ? '32px 20px 36px' : '26px 16px 30px',
                                background: `linear-gradient(180deg, ${tier.color}${tier.size === 'xl' ? '14' : '0a'}, rgba(2,6,15,0.55))`,
                                border: `1px solid ${tier.color}${tier.size === 'xl' ? '55' : '26'}`,
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: tier.size === 'xl' ? 32 : 22 }}>
                                    <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.3em', color: `${tier.color}99`, marginBottom: 6 }}>TIER {String(i + 1).padStart(2, '0')}</div>
                                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: tier.size === 'xl' ? 'clamp(16px, 3vw, 26px)' : 'clamp(12px, 2vw, 17px)', fontWeight: 900, letterSpacing: '0.3em', color: tier.color, margin: 0, textShadow: `0 0 12px ${tier.color}77` }}>{tier.label}</h2>
                                    <div style={{ width: 80, height: 2, margin: '12px auto 0', background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }} />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: tier.size === 'xl' ? 24 : 16, justifyContent: 'center' }}>
                                    {tier.partners.map((p, pi) => <PartnerCard key={p._id || p.name} partner={p} color={tier.color} size={tier.size} index={pi} />)}
                                </div>
                            </section>
                        ))}

                        <div style={{ textAlign: 'center', border: '1.2px solid rgba(0,229,255,0.12)', borderRadius: 12, padding: '40px 20px', background: 'rgba(0,229,255,0.01)' }}>
                            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(12px, 2vw, 18px)', fontWeight: 700, letterSpacing: '0.25em', color: '#00E5FF', marginBottom: 10 }}>BECOME A PARTNER</div>
                            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Interested in collaborating? Reach out through the About page.</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
