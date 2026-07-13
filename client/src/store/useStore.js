import { create } from 'zustand';

const initialPath = typeof window !== 'undefined' ? window.location.pathname : '';
const initialIsEvent = initialPath.startsWith('/event');

export const useStore = create((set) => ({
    // WebGL Timeline Variables
    cameraSpeed: 0,
    tunnelIntensity: 0,
    shakeIntensity: 0,

    // UI Timeline Flags
    showLogo: false,
    showNavbar: false,
    showButton: false,
    showTextParticles: false,

    // Arena / Gun Entrance States
    isEntered: initialIsEvent,      // Triggers the 4-phase camera flight into the gun
    portalFlash: false,    // Black overlay for the barrel portal flash
    isEventPage: initialIsEvent,    // Shows the Events Page after the barrel entry

    // Gun / Portal Rotation (0 = faces camera directly)
    gunRotationY: 0,

    // Sun brightness override — 1.0 = normal, 0.0 = pitch black
    sunDimFactor: 1.0,
    showSun: true,          // Determines if the sun is active in the scene

    // Active category card slug inside the event lobby console
    activeCategorySlug: 'robotics-rc',

    // State Setters
    setCameraSpeed:       (v) => set({ cameraSpeed: v }),
    setTunnelIntensity:   (v) => set({ tunnelIntensity: v }),
    setShakeIntensity:    (v) => set({ shakeIntensity: v }),
    setShowLogo:          (v) => set({ showLogo: v }),
    setShowNavbar:        (v) => set({ showNavbar: v }),
    setShowButton:        (v) => set({ showButton: v }),
    setShowTextParticles: (v) => set({ showTextParticles: v }),
    setIsEntered:         (v) => set({ isEntered: v }),
    setPortalFlash:       (v) => set({ portalFlash: v }),
    setIsEventPage:       (v) => set({ isEventPage: v }),
    setGunRotationY:      (v) => set({ gunRotationY: v }),
    setSunDimFactor:      (v) => set({ sunDimFactor: v }),
    setShowSun:           (v) => set({ showSun: v }),
    setActiveCategorySlug: (v) => set({ activeCategorySlug: v }),
}));
