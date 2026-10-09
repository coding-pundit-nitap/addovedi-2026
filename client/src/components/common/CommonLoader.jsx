import { useEffect } from 'react';

/**
 * The per-page "boot sequence" screen (battery / "ALL SYSTEMS ONLINE", ~3s) is switched off: it flashed a dark
 * full-screen page every time someone opened Crew, Timeline, Alliances, About or Merch. This keeps the same
 * component API so those pages are untouched: it just tells them it is done straight away and draws nothing.
 * The original animated version is in git history (before this change) if it is ever wanted back.
 */
export default function CommonLoader({ onDone }) {
    useEffect(() => { if (onDone) onDone(); }, [onDone]);
    return null;
}
