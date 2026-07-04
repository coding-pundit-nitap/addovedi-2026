import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

export default function HeroOverlay() {
    // Poll the global Zustand store that GSAP actively manipulates natively directly inside WebGL
    const showLogo = useStore(state => state.showLogo);
    const showNavbar = useStore(state => state.showNavbar);
    const showButton = useStore(state => state.showButton);

    return (
        <div className="absolute inset-0 z-10 flex flex-col pointer-events-none p-6 font-sans">
            {/* 5.5s: High-End Navbar */}
            <AnimatePresence>
                {showNavbar && (
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full flex justify-between items-center text-white pointer-events-auto px-12 py-4 top-0"
                    >
                        <div className="font-bold text-2xl tracking-widest flex items-center gap-4">
                            <span className="text-[#00D9FF]">ADDOVEDI</span>
                            <span className="text-[#FF2EA6] text-sm">2026</span>
                        </div>
                        <div className="flex gap-12 text-sm font-semibold uppercase tracking-widest">
                            <a href="#" className="hover:text-[#00D9FF] transition-all hover:scale-110">Home</a>
                            <a href="#" className="hover:text-[#FF2EA6] transition-all hover:scale-110">Events</a>
                            <a href="#" className="hover:text-[#00D9FF] transition-all hover:scale-110">Schedule</a>
                            <a href="#" className="hover:text-[#FF2EA6] transition-all hover:scale-110">Sponsors</a>
                        </div>
                        <button className="border-2 border-[#FF2EA6] text-white px-8 py-2 rounded-xl bg-[#FF2EA6]/10 hover:bg-[#FF2EA6] hover:text-white transition-all shadow-[0_0_20px_rgba(255,46,166,0.3)] hover:shadow-[0_0_30px_rgba(255,46,166,0.7)] tracking-widest font-bold">
                            REGISTER
                        </button>
                    </motion.nav>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col items-center justify-start pt-[12vh] relative">
                {/* 4.0s: Massive Logo Reveal – letters stagger in over the settling particles */}
                <AnimatePresence>
                    {showLogo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="text-center mix-blend-overlay"
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 0.7, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                                className="text-gray-300 tracking-[0.5em] uppercase text-xs mb-6"
                            >
                                NIT Arunachal Pradesh
                            </motion.h2>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* 6.0s: Action Button */}
                <AnimatePresence>
                    {showButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, ease: "easeOut" }}
                            className="mt-[44vh] pointer-events-auto"
                        >
                            <button className="relative px-20 py-4 bg-transparent border-t-2 border-b-2 border-[#00D9FF] text-white tracking-[0.2em] font-black uppercase transition-all duration-300 hover:bg-[#00D9FF]/20 text-xl"
                                style={{
                                    boxShadow: "inset 0px 0px 30px 0px rgba(0, 217, 255, 0.4), 0px 0px 20px 0px rgba(0, 217, 255, 0.2)"
                                }}>
                                ENTER THE ARENA
                                {/* Cyberpunk accent brackets */}
                                <span className="absolute left-0 top-0 h-full w-2 border-l-2 border-[#00D9FF]"></span>
                                <span className="absolute right-0 top-0 h-full w-2 border-r-2 border-[#00D9FF]"></span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
