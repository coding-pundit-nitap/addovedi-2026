import { verifiedCount, countsForXp, xpStats, XP_PER_REGISTRATION, MAX_LEVEL } from '../../utils/xp';

// Player XP / level card for the profile page. XP is earned when the admin verifies a registration.
export default function XpPanel({ registrations, onOpenLeaderboard, accent = '#00D9FF' }) {
    const regs = Array.isArray(registrations) ? registrations : [];
    const s = xpStats(verifiedCount(regs));
    // Registrations the player is on that the admin has not verified yet: each one will add XP once verified.
    const waiting = regs.filter(r => r && r.status !== 'VERIFIED' && r.status !== 'CANCELLED' && r.myStatus !== 'PENDING' && r.myStatus !== 'REJECTED' && !countsForXp(r)).length;
    return (
        <div className="mb-4 border select-none" style={{ borderColor: `${accent}40`, background: `${accent}0a`, padding: '12px 14px' }} aria-label="Your XP and level">
            <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col">
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', color: accent }}>PLAYER_LEVEL</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '26px', fontWeight: 900, color: '#fff', lineHeight: 1.1, textShadow: `0 0 14px ${accent}99` }}>
                        LVL {String(s.level).padStart(2, '0')}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px' }}>/ {MAX_LEVEL}</span>
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', color: accent }}>TOTAL_XP</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '22px', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{s.xp.toLocaleString('en-IN')} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>XP</span></span>
                </div>
            </div>
            <div className="mt-3" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.progress} aria-label="Progress to next level" style={{ height: '8px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${s.progress}%`, height: '100%', background: accent, boxShadow: `0 0 10px ${accent}` }} />
            </div>
            <div className="mt-1.5 text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {s.nextLevelXp === null ? 'MAX LEVEL REACHED' : `${s.xpToNext} XP TO LEVEL ${s.level + 1}`}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', margin: '8px 0 0' }}>
                You earn <strong style={{ color: '#fff' }}>{XP_PER_REGISTRATION} XP</strong> each time the admin verifies one of your registrations.
                {waiting > 0 && <> <strong style={{ color: '#F59E0B' }}>{waiting}</strong> registration{waiting === 1 ? ' is' : 's are'} waiting for verification.</>}
            </p>
            <button
                type="button"
                onClick={onOpenLeaderboard}
                className="mt-3 w-full cursor-pointer font-black tracking-widest uppercase"
                style={{ padding: '10px 12px', border: `1px solid ${accent}`, background: `${accent}18`, color: accent, fontFamily: "'Orbitron', monospace", fontSize: '10px', letterSpacing: '0.16em' }}
            >
                🏆 VIEW LEADERBOARD
            </button>
        </div>
    );
}
