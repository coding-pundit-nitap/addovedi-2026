import { create } from 'zustand';

export const useStore = create((set) => ({
    // WebGL Timeline Variables
    cameraSpeed: 0,
    tunnelIntensity: 0,

    // UI Timeline Flags
    showLogo: false,
    showNavbar: false,
    showButton: false,
    showTextParticles: false,

    // State Setters (Targeted by GSAP onUpdate callbacks)
    setCameraSpeed: (speed) => set({ cameraSpeed: speed }),
    setTunnelIntensity: (intensity) => set({ tunnelIntensity: intensity }),
    setShowLogo: (show) => set({ showLogo: show }),
    setShowNavbar: (show) => set({ showNavbar: show }),
    setShowButton: (show) => set({ showButton: show }),
    setShowTextParticles: (show) => set({ showTextParticles: show }),
}));

