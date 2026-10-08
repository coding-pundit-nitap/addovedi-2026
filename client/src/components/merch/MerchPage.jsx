import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';
import BgCanvas from '../crew/BgCanvas';
import { MERCH_ITEMS, MERCH_FORM_URL } from '../../data/merch';

const STYLES = `
.merch-ov-label{font-family:'Orbitron',monospace;letter-spacing:.2em;text-transform:uppercase;}
.merch-notch-sm{clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px);}
.merch-notch{clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);}
@keyframes merch-tee-float { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-18px) rotate(-0.6deg)} }
@keyframes merch-glow-pulse { 0%,100%{opacity:.55;transform:translateX(-50%) scale(1)} 50%{opacity:.9;transform:translateX(-50%) scale(1.08)} }
@keyframes merch-orbit-slow { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-80px) scale(1.15)} 100%{transform:translate(0,0) scale(1)} }
@keyframes merch-orbit-reverse { 0%{transform:translate(0,0) scale(1.15)} 50%{transform:translate(-70px,60px) scale(0.9)} 100%{transform:translate(0,0) scale(1.15)} }
.merch-tee-stage:hover .merch-tee-img{transform:scale(1.045) rotate(0.5deg);}
.merch-tee-img{transition:transform .5s cubic-bezier(.22,1,.36,1);}
.merch-cta-btn{transition:transform .25s ease, box-shadow .25s ease;}
.merch-cta-btn:hover{transform:translateY(-2px) scale(1.015);}
`;

function TeeSection({ item, reverse }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="merch-tee-stage relative flex flex-col items-center px-6 md:px-12 pt-14 pb-10 md:pt-20 md:pb-14"
            style={{ overflow: 'hidden' }}
        >
            {/* dynamic ambient light */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse 60% 55% at 50% 38%, ${item.color}30, transparent 68%)` }}
            />
            <div
                className="pointer-events-none absolute left-1/2 top-[14%] rounded-full"
                style={{
                    width: 'min(520px, 80vw)',
                    height: 'min(520px, 80vw)',
                    background: `radial-gradient(circle, ${item.color}40, transparent 70%)`,
                    filter: 'blur(30px)',
                    animation: 'merch-glow-pulse 6s ease-in-out infinite',
                }}
            />
            <div
                className="pointer-events-none absolute rounded-full"
                style={{
                    width: 260, height: 260,
                    left: reverse ? 'auto' : '4%', right: reverse ? '4%' : 'auto',
                    top: '10%',
                    background: `radial-gradient(circle, ${item.color}22, transparent 70%)`,
                    filter: 'blur(50px)',
                    animation: `${reverse ? 'merch-orbit-reverse' : 'merch-orbit-slow'} 22s ease-in-out infinite`,
                }}
            />

            <span className="merch-ov-label relative text-[10px] font-bold" style={{ color: item.color }}>
                {item.tag}
            </span>
            <h2 className="merch-ov-label relative mt-2 mb-2.5 text-center text-2xl md:text-[34px] font-black text-white">
                {item.name}
            </h2>
            <p className="relative mx-auto max-w-[520px] text-center text-sm text-white/55 leading-relaxed">
                {item.desc}
            </p>

            <div className="relative mt-2 flex w-full max-w-[640px] flex-1 items-center justify-center" style={{ minHeight: 320 }}>
                <div
                    className="pointer-events-none absolute"
                    style={{
                        width: '62%', height: 14, left: '19%', bottom: '6%',
                        background: `radial-gradient(ellipse, ${item.color}60, transparent 75%)`,
                        filter: 'blur(6px)',
                    }}
                />
                <img
                    className="merch-tee-img relative w-[88%] md:w-[75%]"
                    src={item.img}
                    alt={item.name}
                    style={{
                        maxHeight: '100%',
                        objectFit: 'contain',
                        animation: 'merch-tee-float 5.5s ease-in-out infinite',
                        filter: `drop-shadow(0 0 22px ${item.color}aa) drop-shadow(0 0 60px ${item.color}55) drop-shadow(0 20px 24px rgba(0,0,0,0.55))`,
                    }}
                />
            </div>

            <div className="relative mt-4 flex items-center gap-4 md:gap-5">
                <span className="merch-ov-label text-lg md:text-xl font-bold" style={{ color: item.color }}>
                    ₹{item.price}
                </span>
                <a
                    href={MERCH_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="merch-cta-btn merch-ov-label merch-notch text-[11px] font-bold text-white no-underline"
                    style={{
                        padding: '15px 28px',
                        background: `linear-gradient(135deg, ${item.color}e8, ${item.color}90)`,
                        boxShadow: `0 0 24px ${item.color}40`,
                    }}
                >
                    ORDER VIA GOOGLE FORM →
                </a>
            </div>
        </motion.div>
    );
}

export default function MerchPage() {
    const [booted, setBooted] = useState(false);
    const pageRef = useRef(null);

    return (
        <div
            ref={pageRef}
            className="scrollbar-none smooth-scroll"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at 15% 15%, rgba(0, 217, 255, 0.07) 0%, transparent 50%), radial-gradient(circle at 85% 65%, rgba(255, 77, 109, 0.07) 0%, transparent 50%), #05060a',
                zIndex: 100,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <ScrollIndicator scrollRef={pageRef} />
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />

            <BgCanvas />

            {/* background grid texture */}
            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    zIndex: 0,
                    backgroundImage: 'linear-gradient(rgba(0,217,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 40%, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 40%, transparent 90%)',
                }}
            />

            {!booted && <CommonLoader onDone={() => setBooted(true)} pageName="Supply Depot" />}

            <div style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: booted ? 'auto' : 'none' }}>
                <div style={{ position: 'relative', zIndex: 20 }}>
                    <CommonNav />
                </div>

                <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col pt-[108px] md:pt-[128px] pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-1.5 px-6 text-center"
                    >
                        <h1 className="merch-ov-label text-4xl md:text-[52px] font-black text-white" style={{ letterSpacing: '0.07em', textShadow: '0 0 35px rgba(0, 217, 255, 0.35), 0 0 70px rgba(0, 217, 255, 0.15)' }}>
                            THE 2026 DROP
                        </h1>
                        <p className="merch-ov-label text-[13px] font-semibold text-[rgba(180,210,255,0.55)]" style={{ letterSpacing: '0.1em' }}>
                            2 OFFICIAL TEES · ₹300 EACH · ORDER VIA GOOGLE FORM
                        </p>
                    </motion.div>

                    {MERCH_ITEMS.map((item, idx) => (
                        <TeeSection key={item.id} item={item} reverse={idx % 2 === 1} />
                    ))}
                </div>
            </div>
        </div>
    );
}
