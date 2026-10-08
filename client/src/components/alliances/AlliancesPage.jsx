/**
 * AlliancesPage.jsx — ADDOVEDI 2026 PARTNERS (Sponsors)
 *
 * Tiered partner showcase: Platinum / Gold / Silver sponsors, then Technical,
 * Event, Travel, Media and Barter partners. Card size scales with the tier.
 * Data is static and sourced from the Addovedi 2026 sponsorship report.
 */

import { useState, useEffect, useRef } from 'react';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';

// `pending: true` = not fully finalized yet; shown with a "Joining soon" tag.
const TIERS = [
    {
        id: 'platinum', label: 'PLATINUM SPONSOR', color: '#E5F6FF', cols: 1, size: 'xl',
        partners: [
            { name: 'TRUSCHOLAR', title: 'Official Credential Partner', desc: 'Every Addovedi 2026 certificate is issued through the TruScholar blockchain-powered digital credential platform, with a lifetime Smart Credential Wallet, AI Career Coach and a job & internship portal for participants.' },
        ],
    },
    {
        id: 'gold', label: 'GOLD SPONSOR', color: '#FFD700', cols: 1, size: 'lg',
        partners: [
            { name: 'SOLIDWORKS', title: 'Gold Sponsor', desc: 'Powering SOLID SIEGE, with student licenses and certification vouchers for winners and an onboarding webinar on SOLIDWORKS design.' },
        ],
    },
    {
        id: 'silver', label: 'SILVER SPONSORS', color: '#B8C4D6', cols: 2, size: 'md',
        partners: [
            { name: 'AIMIL', title: 'Sponsor', desc: 'Supporting Addovedi 2026 as an official sponsor.' },
            { name: 'NODWIN GAMING × KRAFTON', title: 'Gaming Partner', desc: 'Prize pools and branding for the BGMI and Real Cricket tournaments.', pending: true },
        ],
    },
    {
        id: 'tech', label: 'TECHNICAL PARTNERS', color: '#00E5FF', cols: 3, size: 'sm',
        partners: [
            { name: 'ZEBRONICS', title: 'Official Tech Partner', desc: 'Stage pillars, campus standees and product goodies for the fest.', pending: true },
            { name: 'UNSTOP', title: 'Platform Partner', desc: 'Event listing and registration platform, with goodies for participants.' },
        ],
    },
    {
        id: 'event', label: 'EVENT SPONSORS', color: '#7A5CFF', cols: 3, size: 'sm',
        partners: [
            { name: 'DENVER', title: 'Fragrance Partner', desc: 'Free sampling for attendees, an experience zone, games and hampers for winners.' },
            { name: 'JIOSAAVN', title: 'Official Music Streaming Partner', desc: 'Pro codes as prizes and presence across music events and Pronite.' },
        ],
    },
    {
        id: 'travel', label: 'TRAVEL PARTNER', color: '#1FFF76', cols: 3, size: 'sm',
        partners: [
            { name: 'EASEMYTRIP', title: 'Official Travel Partner', desc: '300 travel vouchers for flights and hotels, valid for 5 months.' },
        ],
    },
    {
        id: 'media', label: 'MEDIA & COMMUNITY', color: '#FF2CFB', cols: 3, size: 'xs',
        partners: [
            { name: 'CAMPUS KARMA', title: 'Media Partner', desc: 'Promotional posts and articles before and after the fest.' },
            { name: 'ABHIBUS', title: 'Barter Partner', desc: 'Bus travel vouchers and student referral offers.', pending: true },
        ],
    },
];

const SIZES = {
    xl: { pad: 44, name: 40, minH: 260, max: 860 },
    lg: { pad: 36, name: 32, minH: 220, max: 760 },
    md: { pad: 28, name: 24, minH: 180, max: 1000 },
    sm: { pad: 22, name: 19, minH: 150, max: 1000 },
    xs: { pad: 18, name: 16, minH: 120, max: 1000 },
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

function PartnerCard({ partner, color, size }) {
    const s = SIZES[size];
    return (
        <div style={{
            position: 'relative', flex: '1 1 280px', maxWidth: s.max, minHeight: s.minH,
            padding: s.pad, background: `${color}08`, border: `1.2px solid ${color}40`,
            borderRadius: 12, boxShadow: `0 0 28px ${color}12, inset 0 0 22px ${color}06`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',
            clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
        }}>
            {partner.pending && (
                <span style={{ position: 'absolute', top: 10, right: 14, fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', color: '#FBBF24' }}>JOINING SOON</span>
            )}
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: `clamp(${Math.round(s.name * 0.6)}px, 4vw, ${s.name}px)`, color: '#fff', letterSpacing: '0.08em', textShadow: `0 0 14px ${color}66` }}>{partner.name}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, letterSpacing: '0.2em', color, margin: '8px 0 12px', textTransform: 'uppercase' }}>{partner.title}</div>
            <p style={{ fontFamily: 'monospace', fontSize: size === 'xs' ? 11 : 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: '0 auto', maxWidth: 640 }}>{partner.desc}</p>
        </div>
    );
}

export default function AlliancesPage() {
    const [booted, setBooted] = useState(false);
    const pageRef = useRef(null);

    return (
        <div ref={pageRef} className="scrollbar-none smooth-scroll" style={{ position: 'fixed', inset: 0, background: '#010307', zIndex: 100, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
            <ScrollIndicator scrollRef={pageRef} />
            <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');` }} />
            <BgCanvas />
            {!booted && <CommonLoader onDone={() => setBooted(true)} pageName="Partners" />}

            {booted && (
                <>
                    <CommonNav />
                    <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '120px 16px 80px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(26px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '0.1em', margin: 0, textShadow: '0 0 20px rgba(0,229,255,0.4)' }}>OUR PARTNERS</h1>
                            <p style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginTop: 12 }}>The brands powering Addovedi 2026, Arunachal Pradesh's biggest technical fest.</p>
                        </div>

                        {TIERS.map(tier => (
                            <section key={tier.id} style={{ marginBottom: 56 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${tier.color}66)` }} />
                                    <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(11px, 2vw, 15px)', fontWeight: 900, letterSpacing: '0.3em', color: tier.color, margin: 0, textShadow: `0 0 10px ${tier.color}66` }}>{tier.label}</h2>
                                    <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${tier.color}66)` }} />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                                    {tier.partners.map(p => <PartnerCard key={p.name} partner={p} color={tier.color} size={tier.size} />)}
                                </div>
                            </section>
                        ))}

                        <div style={{ textAlign: 'center', border: '1.2px solid rgba(0,229,255,0.12)', borderRadius: 12, padding: '40px 20px', background: 'rgba(0,229,255,0.01)' }}>
                            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(12px, 2vw, 18px)', fontWeight: 700, letterSpacing: '0.25em', color: '#00E5FF', marginBottom: 10 }}>BECOME A PARTNER</div>
                            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Interested in collaborating? Reach out through the About page.</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
