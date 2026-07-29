import { useState, useEffect } from 'react';

export default function ScrollIndicator({ scrollRef }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const element = scrollRef?.current;
        if (!element) return;

        const updateProgress = () => {
            const maxScroll = element.scrollHeight - element.clientHeight;
            const nextProgress = maxScroll > 0 ? Math.min(Math.max(element.scrollTop / maxScroll, 0), 1) : 0;
            setProgress(nextProgress);
        };

        updateProgress();
        element.addEventListener('scroll', updateProgress, { passive: true });
        return () => element.removeEventListener('scroll', updateProgress);
    }, [scrollRef]);

    return (
        <div className="scroll-indicator-track">
            <div className="scroll-indicator-thumb" style={{ top: `calc(${progress * 100}% )` }} />
        </div>
    );
}
