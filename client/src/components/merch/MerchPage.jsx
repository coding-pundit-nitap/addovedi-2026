import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CommonNav from '../common/CommonNav';
import CommonLoader from '../common/CommonLoader';
import ScrollIndicator from '../common/ScrollIndicator';
import BgCanvas from '../crew/BgCanvas';
import Tee3DBackground from './Tee3DBackground';
import { MERCH_ITEMS, MERCH_FORM_URL, MERCH_VARIANTS, MERCH_ORDER_DEADLINE } from '../../data/merch';

const ORDER_NOTES = [
    'Check the size chart carefully before ordering',
    'Regular and Oversize have different measurements',
    'The T-shirt fee is non-refundable',
    'Make the payment before submitting the form',
    'Ordering multiple tees? Pay the total amount accordingly',
];

const STYLES = `
.merch-ov-label{font-family:'Orbitron',monospace;letter-spacing:.2em;text-transform:uppercase;}
.merch-notch-sm{clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px);}
.merch-notch{clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);}
@keyframes merch-tee-float { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-14px) rotate(-0.6deg)} }
@keyframes merch-glow-pulse { 0%,100%{opacity:.55;transform:translateX(-50%) scale(1)} 50%{opacity:.9;transform:translateX(-50%) scale(1.08)} }
.merch-tee-card:hover .merch-tee-img{transform:scale(1.05) rotate(0.5deg);}
.merch-tee-card:hover{border-color:var(--tee-color-50);box-shadow:0 0 30px var(--tee-color-20);}
.merch-tee-card{transition:border-color .3s ease, box-shadow .3s ease;}
.merch-tee-img{transition:transform .5s cubic-bezier(.22,1,.36,1);}
.merch-cta-btn{transition:transform .25s ease, box-shadow .25s ease;}
.merch-cta-btn:hover{transform:translateY(-2px) scale(1.015);}
`;

function TeeCard({ item }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="merch-tee-card relative flex flex-col items-center overflow-hidden rounded-2xl px-6 pt-10 pb-8 md:px-8"
            style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))',
                border: `1px solid ${item.color}25`,
                '--tee-color-50': `${item.color}50`,
                '--tee-color-20': `${item.color}20`,
            }}
        >
            {/* dynamic ambient light, contained to the card */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(ellipse 80% 65% at 50% 32%, ${item.color}28, transparent 70%)` }}
            />
            <div
                className="pointer-events-none absolute left-1/2 top-[8%] rounded-full"
                style={{
                    width: '70%',
                    aspectRatio: '1 / 1',
                    background: `radial-gradient(circle, ${item.color}38, transparent 70%)`,
                    filter: 'blur(26px)',
                    animation: 'merch-glow-pulse 6s ease-in-out infinite',
                }}
            />

            <span className="merch-ov-label relative text-[10px] font-bold" style={{ color: item.color }}>
                {item.tag}
            </span>
            <h2 className="merch-ov-label relative mt-2 mb-2 text-center text-xl md:text-2xl font-black text-white">
                {item.name}
            </h2>
            <p className="relative mx-auto max-w-[360px] text-center text-[13px] text-white/55 leading-relaxed">
                {item.desc}
            </p>

            <div className="relative mt-2 flex w-full items-center justify-center" style={{ minHeight: 260 }}>
                <Tee3DBackground img={item.img} color={item.color} />
                <div
                    className="pointer-events-none absolute"
                    style={{
                        width: '56%', height: 12, left: '22%', bottom: '4%',
                        background: `radial-gradient(ellipse, ${item.color}60, transparent 75%)`,
                        filter: 'blur(6px)',
                    }}
                />
                <img
                    className="merch-tee-img relative w-[85%]"
                    src={item.img}
                    alt={item.name}
                    style={{
                        maxHeight: '100%',
                        objectFit: 'contain',
                        animation: 'merch-tee-float 5.5s ease-in-out infinite',
                        filter: `drop-shadow(0 0 18px ${item.color}99) drop-shadow(0 0 46px ${item.color}50) drop-shadow(0 16px 18px rgba(0,0,0,0.55))`,
                    }}
                />
            </div>

            <div className="relative mt-3 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2.5">
                    {MERCH_VARIANTS.map((variant) => (
                        <span
                            key={variant.label}
                            className="merch-ov-label merch-notch-sm text-[10px] font-bold"
                            style={{
                                padding: '6px 12px',
                                color: item.color,
                                border: `1px solid ${item.color}50`,
                                background: `${item.color}12`,
                            }}
                        >
                            {variant.label} ₹{variant.price}
                        </span>
                    ))}
                </div>
                <a
                    href={MERCH_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="merch-cta-btn merch-ov-label merch-notch text-[11px] font-bold text-white no-underline"
                    style={{
                        padding: '13px 26px',
                        background: `linear-gradient(135deg, ${item.color}e8, ${item.color}90)`,
                        boxShadow: `0 0 20px ${item.color}40`,
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

                <div className="relative z-10 mx-auto flex max-w-[1100px] flex-col pt-[108px] md:pt-[128px] pb-20 px-6 md:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-1.5 text-center mb-10 md:mb-14"
                    >
                        <h1 className="merch-ov-label text-4xl md:text-[52px] font-black text-white" style={{ letterSpacing: '0.07em', textShadow: '0 0 35px rgba(0, 217, 255, 0.35), 0 0 70px rgba(0, 217, 255, 0.15)' }}>
                            THE 2026 DROP
                        </h1>
                        <p className="merch-ov-label text-[13px] font-semibold text-[rgba(180,210,255,0.55)]" style={{ letterSpacing: '0.1em' }}>
                            2 OFFICIAL TEES · REGULAR ₹349 / OVERSIZE ₹399 · ORDER VIA GOOGLE FORM
                        </p>
                        <p className="merch-ov-label text-[11px] font-bold" style={{ letterSpacing: '0.12em', color: '#FF4D6D' }}>
                            LAST DATE TO ORDER: {MERCH_ORDER_DEADLINE.toUpperCase()}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {MERCH_ITEMS.map((item) => (
                            <TeeCard key={item.id} item={item} />
                        ))}
                    </div>

                    <div
                        className="relative mt-10 md:mt-14 rounded-xl px-6 py-5 md:px-8"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <span className="merch-ov-label block mb-3 text-[10px] font-bold" style={{ color: '#9b5cff' }}>
                            IMPORTANT
                        </span>
                        <ul className="flex flex-col gap-1.5">
                            {ORDER_NOTES.map((note) => (
                                <li key={note} className="text-[12px] text-white/55 leading-relaxed flex gap-2">
                                    <span style={{ color: '#9b5cff' }}>—</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
