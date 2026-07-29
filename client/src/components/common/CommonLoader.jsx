import React, { useState, useEffect } from 'react';

export default function CommonLoader({ onDone, pageName = "SYSTEM" }) {
    const [pct, setPct] = useState(0);
    const [flicker, setFlicker] = useState(false);

    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        let start = null;
        let raf;
        const duration = 2000; // 2.0s loading speed

        const go = (ts) => {
            if (!start) start = ts;
            const progress = ts - start;
            const p = Math.min(100, Math.floor((progress / duration) * 100));
            setPct(p);

            if (p < 100) {
                raf = requestAnimationFrame(go);
            } else {
                setTimeout(() => {
                    setFlicker(true);
                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(onDone, 500); // unmount after fade-out transition
                    }, 300);
                }, 150);
            }
        };

        raf = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf);
    }, [onDone]);

    // Tech diagnostic logs that update based on percentage
    const getLogText = (p) => {
        if (p < 20) return "BOOTSEQ: KERNEL SECURE // CORRELATING CHANNELS...";
        if (p < 40) return "ESTABLISHING NEURAL OVERLINK TO MECHA NET...";
        if (p < 60) return `DECRYPTING ${pageName.toUpperCase()} PROTOCOLS [HASH: 0x8F9B]...`;
        if (p < 80) return "SYNCHRONIZING ADDOVEDI POWER CELLS [CORES: 4/4]...";
        if (p < 100) return "CALIBRATING QUANTUM FIELD STABILIZERS...";
        return "ALL SYSTEMS ONLINE // INGRESS APPROVED.";
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#06080F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Orbitron', monospace",
            animation: flicker && !isExiting ? 'bootFlick 0.35s steps(3,end) forwards' : 'none',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s',
            opacity: isExiting ? 0 : 1,
            visibility: isExiting ? 'hidden' : 'visible',
            pointerEvents: isExiting ? 'none' : 'auto',
        }}>
            <style>{`
                @keyframes bootFlick { 
                    0%, 100% { opacity: 1; }
                    33% { opacity: 0; }
                    66% { opacity: 1; }
                    83% { opacity: 0; }
                }
                @keyframes batteryPulse {
                    0%, 100% { box-shadow: 0 0 10px rgba(0, 229, 255, 0.1), inset 0 0 5px rgba(0, 229, 255, 0.05); }
                    50% { box-shadow: 0 0 25px rgba(0, 229, 255, 0.35), inset 0 0 12px rgba(0, 229, 255, 0.15); }
                }
                @keyframes scanLine {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>

            {/* Futuristic Tech Background Overlay Grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.03) 0%, transparent 70%), linear-gradient(rgba(0, 229, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.02) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                zIndex: -1,
                pointerEvents: 'none',
            }} />

            {/* Glowing Scanline */}
            <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.25), transparent)',
                top: 0,
                bottom: 0,
                animation: 'scanLine 3s linear infinite',
                pointerEvents: 'none',
                zIndex: 1,
            }} />

            {/* Main Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', zIndex: 10 }}>
                
                {/* Header text */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '11px',
                        color: '#00E5FF',
                        letterSpacing: '0.6em',
                        marginBottom: '8px',
                        textShadow: '0 0 12px rgba(0, 229, 255, 0.6)',
                        opacity: 0.9,
                        fontWeight: 700,
                    }}>
                        {pageName.toUpperCase()} INGRESS
                    </div>
                    <div style={{
                        fontSize: '8px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.3em',
                    }}>
                        ADDOVEDI MECHA ENGINE v4.8
                    </div>
                </div>

                {/* Vertical Battery Loader - The 'I' of ADDOVEDI */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    
                    {/* The Battery Body */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Battery Nub (Positive Terminal) */}
                        <div style={{
                            width: '16px',
                            height: '5px',
                            background: '#00E5FF',
                            borderRadius: '2px 2px 0 0',
                            boxShadow: '0 0 8px rgba(0, 229, 255, 0.5)',
                            marginBottom: '2px',
                        }} />
                        
                        {/* Battery Core Chassis */}
                        <div style={{
                            width: '42px',
                            height: '110px',
                            border: '2px solid #00E5FF',
                            borderRadius: '6px',
                            padding: '4px',
                            boxSizing: 'border-box',
                            background: '#04060B',
                            animation: 'batteryPulse 2s infinite ease-in-out',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column-reverse', // Fill from bottom up
                            justifyContent: 'flex-start',
                            gap: '3px',
                        }}>
                            {/* Inner rising charge level fluid */}
                            <div style={{
                                width: '100%',
                                height: `${pct}%`,
                                background: 'linear-gradient(to top, #7A5CFF, #00E5FF)',
                                borderRadius: '2px',
                                transition: 'height 0.05s linear',
                                boxShadow: '0 0 12px rgba(0, 229, 255, 0.4)',
                            }} />

                            {/* Grid/Segments Overlay Lines (to look like distinct battery bars/grid) */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '4px 0',
                                pointerEvents: 'none',
                            }}>
                                {[...Array(6)].map((_, idx) => (
                                    <div key={idx} style={{
                                        width: '100%',
                                        height: '1.5px',
                                        background: 'rgba(6, 8, 15, 0.85)',
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Percentage and Progress Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{
                            fontSize: '48px',
                            fontWeight: 900,
                            color: '#00E5FF',
                            lineHeight: 1,
                            textShadow: '0 0 20px rgba(0, 229, 255, 0.7), 0 0 40px rgba(0, 229, 255, 0.3)',
                            letterSpacing: '-0.02em',
                        }}>
                            {pct}<span style={{ fontSize: '20px', fontWeight: 400, marginLeft: '2px', opacity: 0.7 }}>%</span>
                        </div>
                        <div style={{
                            fontSize: '9px',
                            color: 'rgba(0, 229, 255, 0.7)',
                            letterSpacing: '0.2em',
                            marginTop: '6px',
                            fontWeight: 600,
                        }}>
                            CHARGING CELL
                        </div>
                    </div>

                </div>

                {/* Boot Log Console */}
                <div style={{
                    width: '320px',
                    textAlign: 'center',
                    padding: '8px 12px',
                    background: 'rgba(0, 229, 255, 0.01)',
                    border: '1px solid rgba(0, 229, 255, 0.05)',
                    borderRadius: '6px',
                    height: '36px',
                    maxHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        fontSize: '8px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        lineHeight: 1.4,
                    }}>
                        {getLogText(pct)}
                    </div>
                </div>

            </div>
        </div>
    );
}
