import React, { useState, useEffect } from "react";
import MainCanvas from "../../three/Canvas/MainCanvas";
import { useStore } from "../../store/useStore";

const checkWebGL = () => {
    if (typeof window === "undefined") return true;
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext && 
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
};

export default function HeroCanvas() {
    const isSidebarOpen = useStore(s => s.isSidebarOpen);
    const [hasWebGL, setHasWebGL] = useState(checkWebGL);

    useEffect(() => {
        const detectWebGL = () => {
            try {
                const canvas = document.createElement("canvas");
                const available = !!(
                    window.WebGLRenderingContext && 
                    (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
                );
                setHasWebGL(available);
            } catch (e) {
                setHasWebGL(false);
            }
        };
        detectWebGL();
    }, []);

    if (!hasWebGL) {
        // Safe 2D fallback background so the page loads and functions without WebGL/GPU crash in Lighthouse
        return (
            <div className="absolute inset-0 bg-[#020617]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#0b132b] opacity-80" />
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />
            </div>
        );
    }

    return (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <MainCanvas />
        </div>
    );
}
