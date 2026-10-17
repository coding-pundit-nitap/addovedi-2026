import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonNav from '../common/CommonNav';
import { useStore } from '../../store/useStore';
import { GUIDE_GROUPS, GUIDE_STEPS } from '../../data/registrationGuide';

// Lightweight on purpose: no 3D canvas, no animation loop, no loader. Only the current and the next
// two screenshots are ever requested (WebP, ~60KB each), so the page stays fast on phones.
const STYLES = `
.guide-wrap{position:fixed;inset:0;z-index:100;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;
  background:radial-gradient(circle at 15% 10%, rgba(0,217,255,.07) 0%, transparent 50%),radial-gradient(circle at 85% 70%, rgba(255,77,109,.06) 0%, transparent 50%),#05060a;color:#fff;font-family:'Rajdhani',sans-serif;}
.guide-in{max-width:1260px;margin:0 auto;padding:104px 20px 56px;}
.guide-grid{display:grid;grid-template-columns:290px minmax(0,1fr);gap:32px;align-items:start;}
.guide-side{display:flex;flex-direction:column;}
.guide-eyebrow{font-family:'Orbitron',monospace;font-size:11px;letter-spacing:.3em;color:#00D9FF;text-transform:uppercase;}
.guide-h1{font-family:'Orbitron',monospace;font-weight:900;font-size:clamp(26px,4vw,36px);letter-spacing:.06em;margin:8px 0 6px;}
.guide-sub{color:rgba(255,255,255,.62);font-size:clamp(14px,2vw,18px);line-height:1.5;max-width:640px;}
.guide-tabs{display:flex;flex-direction:column;gap:8px;margin:22px 0 0;}
.guide-tab{text-align:left;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;padding:11px 14px;border:1px solid rgba(0,217,255,.25);background:rgba(0,217,255,.04);color:rgba(255,255,255,.7);cursor:pointer;transition:background .2s,color .2s,border-color .2s;}
.guide-tab:hover{border-color:rgba(0,217,255,.6);color:#fff;}
.guide-tab.on{background:rgba(0,217,255,.16);border-color:#00D9FF;color:#00D9FF;}
.guide-card{width:100%;border:1px solid rgba(0,217,255,.28);background:linear-gradient(180deg,rgba(2,14,26,.9),rgba(2,8,16,.9));box-shadow:0 0 40px rgba(0,217,255,.08);}
.guide-shot{position:relative;width:100%;aspect-ratio:16/9;background:#030a14;overflow:hidden;cursor:zoom-in;}
.guide-shot img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;animation:guide-fade .25s ease;}
@keyframes guide-fade{from{opacity:.0}to{opacity:1}}
.guide-zoomhint{position:absolute;right:10px;bottom:10px;font-family:'Orbitron',monospace;font-size:9px;letter-spacing:.14em;padding:5px 9px;background:rgba(2,8,16,.82);border:1px solid rgba(0,217,255,.35);color:#9fe9f7;pointer-events:none;}
.guide-body{padding:18px 20px 20px;display:flex;flex-direction:column;gap:14px;}
.guide-step{font-family:'Orbitron',monospace;font-size:11px;letter-spacing:.2em;color:#FFB020;text-transform:uppercase;}
.guide-title{font-family:'Orbitron',monospace;font-weight:800;font-size:clamp(17px,3vw,24px);letter-spacing:.04em;margin:0;}
.guide-cap{font-size:clamp(15px,2.2vw,20px);line-height:1.5;color:rgba(235,246,255,.86);margin:0;}
.guide-bar{height:4px;background:rgba(255,255,255,.08);}
.guide-bar>i{display:block;height:100%;background:linear-gradient(90deg,#FFB020,#00D9FF);transition:width .3s ease;}
.guide-nav{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;}
.guide-btn{font-family:'Orbitron',monospace;font-size:12px;font-weight:800;letter-spacing:.12em;padding:13px 22px;border:1px solid rgba(0,217,255,.5);background:transparent;color:#00D9FF;cursor:pointer;transition:background .2s;min-width:120px;}
.guide-btn:hover:not(:disabled){background:rgba(0,217,255,.14);}
.guide-btn:disabled{opacity:.3;cursor:default;}
.guide-btn.pri{background:linear-gradient(135deg,#0891b2,#00D9FF);color:#02131c;border-color:transparent;}
.guide-btn.pri:hover:not(:disabled){filter:brightness(1.1);background:linear-gradient(135deg,#0891b2,#00D9FF);}
.guide-hint{font-size:13px;color:rgba(255,255,255,.4);}
.guide-cta{margin-top:18px;display:flex;flex-wrap:wrap;gap:12px;}
.guide-zoom{scroll-behavior:auto;position:fixed;inset:0;z-index:400;background:#02050a;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.guide-zoom.big{display:block;overflow:auto;-webkit-overflow-scrolling:touch;}
.guide-zoom img{display:block;user-select:none;-webkit-user-drag:none;}
.guide-zoom img.fit{width:100%;max-width:1700px;max-height:100%;height:auto;object-fit:contain;}
.guide-zoom img.big{width:max(210vw,1500px);max-width:none;height:auto;}
.guide-zoom img.rot{position:absolute;left:50%;top:50%;width:min(100dvh,177.78vw);max-width:none;height:auto;transform:translate(-50%,-50%) rotate(90deg);}
.guide-zbar{position:fixed;top:12px;right:12px;z-index:401;display:flex;gap:8px;}
.guide-zbtn{font:700 12px 'Orbitron',monospace;letter-spacing:.1em;color:#00D9FF;background:rgba(2,8,16,.9);border:1px solid rgba(0,217,255,.55);height:42px;min-width:42px;padding:0 12px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.guide-zbtn.rotbtn{display:none;}
.guide-zhint{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:401;font:600 12px 'Orbitron',monospace;letter-spacing:.1em;color:rgba(255,255,255,.55);background:rgba(2,8,16,.8);padding:7px 12px;pointer-events:none;white-space:nowrap;}
@media (orientation:portrait) and (max-width:900px){.guide-zbtn.rotbtn{display:flex}}
@media (max-width:900px){.guide-grid{grid-template-columns:1fr;gap:18px}.guide-tabs{flex-direction:row;flex-wrap:wrap;margin-top:14px}.guide-tab{padding:8px 11px}.guide-side{order:0}}
@media (max-width:640px){.guide-in{padding:112px 14px 48px}.guide-body{padding:14px}.guide-btn{flex:1;min-width:0;padding:13px 10px}.guide-hint{display:none}}
`;

const stepFromHash = () => {
    const n = parseInt((window.location.hash || '').replace('#', ''), 10);
    return Number.isFinite(n) && n >= 1 && n <= GUIDE_STEPS.length ? n - 1 : 0;
};

export default function HowToRegisterPage() {
    const navigate = useNavigate();
    const [i, setI] = useState(stepFromHash);
    const [zoom, setZoom] = useState(false); // false | 'fit' | 'big' | 'rot'
    const touchX = useRef(null);
    const step = GUIDE_STEPS[i];
    const last = i === GUIDE_STEPS.length - 1;

    const go = useCallback((k) => setI((cur) => Math.min(GUIDE_STEPS.length - 1, Math.max(0, typeof k === 'function' ? k(cur) : k))), []);

    // keep the address in sync (shareable, survives refresh) without adding history entries
    useEffect(() => { window.history.replaceState(null, '', `#${i + 1}`); }, [i]);

    useEffect(() => {
        const onHash = () => setI(stepFromHash());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // warm the next two screenshots only
    useEffect(() => {
        [1, 2].forEach((d) => { const s = GUIDE_STEPS[i + d]; if (s) { const im = new Image(); im.decoding = 'async'; im.src = s.img; } });
    }, [i]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') go((c) => c + 1);
            else if (e.key === 'ArrowLeft') go((c) => c - 1);
            else if (e.key === 'Escape') setZoom(false);
            else if (e.key === '+' || e.key === '=') setZoom('big');
            else if (e.key === '-') setZoom((z) => (z ? 'fit' : z));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [go]);

    useEffect(() => {
        if (!zoom) return undefined;
        const wrap = document.querySelector('.guide-wrap');
        const prev = wrap ? wrap.style.overflowY : '';
        if (wrap) wrap.style.overflowY = 'hidden';
        return () => { if (wrap) wrap.style.overflowY = prev; };
    }, [zoom]);

    // when entering the zoomed view, start in the middle of the picture
    const zoomRef = useRef(null);
    useEffect(() => {
        if (zoom !== 'big') return undefined;
        const center = () => { const el = zoomRef.current; if (el) el.scrollTo({ left: (el.scrollWidth - el.clientWidth) / 2, top: (el.scrollHeight - el.clientHeight) / 2, behavior: 'instant' }); };
        center();
        const id = requestAnimationFrame(() => { center(); requestAnimationFrame(center); });
        return () => cancelAnimationFrame(id);
    }, [zoom]);

    useEffect(() => { const t = document.title; document.title = 'How to Register · Addovedi 2026'; return () => { document.title = t; }; }, []);

    const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go((c) => c + (dx < 0 ? 1 : -1));
    };

    return (
        <div className="guide-wrap">
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <CommonNav />
            <div className="guide-in">
              <div className="guide-grid">
                <aside className="guide-side">
                <div className="guide-eyebrow">Player guide</div>
                <h1 className="guide-h1">HOW TO REGISTER</h1>
                <p className="guide-sub">New here? Follow these {GUIDE_STEPS.length} short steps: account, profile, team and admin verification. Follow the amber arrows.</p>

                <div className="guide-tabs" role="tablist" aria-label="Guide sections">
                    {GUIDE_GROUPS.map((g) => (
                        <button key={g.id} role="tab" aria-selected={step.group === g.id} className={`guide-tab${step.group === g.id ? ' on' : ''}`} onClick={() => go(g.first - 1)}>{g.label}</button>
                    ))}
                </div>
                </aside>

                <div className="guide-main">
                <div className="guide-card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    <div className="guide-shot" onClick={() => setZoom('fit')} role="button" aria-label="Enlarge screenshot">
                        <img key={step.n} src={step.img} alt={`${step.title}. ${step.caption}`} width="1600" height="900" decoding="async" fetchpriority={i === 0 ? 'high' : 'auto'} />
                        <span className="guide-zoomhint">TAP TO ENLARGE</span>
                    </div>
                    <div className="guide-bar" aria-hidden="true"><i style={{ width: `${((i + 1) / GUIDE_STEPS.length) * 100}%` }} /></div>
                    <div className="guide-body">
                        <div className="guide-step">Step {step.n} of {GUIDE_STEPS.length} · {GUIDE_GROUPS.find((g) => g.id === step.group).label}</div>
                        <h2 className="guide-title">{step.title}</h2>
                        <p className="guide-cap">{step.caption}</p>
                        <div className="guide-nav">
                            <button className="guide-btn" onClick={() => go(i - 1)} disabled={i === 0}>◀ BACK</button>
                            <span className="guide-hint">Use the ← → keys or swipe</span>
                            {last
                                ? <button className="guide-btn pri" onClick={() => navigate('/event')}>START REGISTERING ▶</button>
                                : <button className="guide-btn pri" onClick={() => go(i + 1)}>NEXT ▶</button>}
                        </div>
                    </div>
                </div>

                <div className="guide-cta">
                    <button className="guide-btn" onClick={() => useStore.getState().setAuthModalOpen(true)}>CREATE / LOG IN</button>
                    <button className="guide-btn" onClick={() => navigate('/event')}>BROWSE EVENTS</button>
                </div>
                </div>
              </div>
            </div>

            {zoom && (
                <div className={`guide-zoom${zoom === 'big' ? ' big' : ''}`} ref={zoomRef} onClick={() => { if (zoom === 'fit') setZoom(false); }}>
                    <div className="guide-zbar" onClick={(e) => e.stopPropagation()}>
                        <button className="guide-zbtn" onClick={() => setZoom((z) => (z === 'big' ? 'fit' : 'big'))} aria-label={zoom === 'big' ? 'Fit to screen' : 'Zoom in'}>{zoom === 'big' ? '⤡ FIT' : '⤢ ZOOM'}</button>
                        <button className="guide-zbtn rotbtn" onClick={() => setZoom((z) => (z === 'rot' ? 'fit' : 'rot'))} aria-label="Rotate view">{zoom === 'rot' ? '⟲ BACK' : '⟳ ROTATE'}</button>
                        <button className="guide-zbtn" onClick={() => setZoom(false)} aria-label="Close">✕</button>
                    </div>
                    <img className={zoom} src={step.img} alt={step.title} draggable="false" onClick={(e) => { e.stopPropagation(); setZoom((z) => (z === 'fit' ? 'big' : z === 'big' ? 'fit' : 'fit')); }} />
                    <div className="guide-zhint">{zoom === 'fit' ? 'TAP IMAGE TO ZOOM · TAP OUTSIDE TO CLOSE' : zoom === 'big' ? 'DRAG TO LOOK AROUND · TAP TO FIT' : 'ROTATED VIEW · USE BACK TO RETURN'}</div>
                </div>
            )}
        </div>
    );
}
