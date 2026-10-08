import { useMemo, useState } from 'react';

// Compares an Unstop participant export (CSV, parsed locally in the browser, never
// uploaded) with the website's registrations for one event.
function parseCsv(text) {
    const src = text.replace(/^﻿/, '');
    const first = src.split(/\r?\n/, 1)[0] || '';
    const delim = [',', ';', '\t'].map(d => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
    const rows = [];
    let row = [], cell = '', quoted = false;
    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        if (quoted) {
            if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
            else if (ch === '"') quoted = false;
            else cell += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === delim) { row.push(cell); cell = ''; }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && src[i + 1] === '\n') i++;
            row.push(cell); cell = '';
            if (row.some(c => c.trim())) rows.push(row);
            row = [];
        } else cell += ch;
    }
    row.push(cell);
    if (row.some(c => c.trim())) rows.push(row);
    return rows;
}

const norm = (v) => (v || '').trim().toLowerCase();
const box = { border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 12, background: 'rgba(255,255,255,0.02)' };
const mono = { fontFamily: 'monospace', fontSize: 11 };

export default function UnstopReconcile({ apiBase, getHeaders, registrations, eventTitles, onDone }) {
    const [eventTitle, setEventTitle] = useState('');
    const [csv, setCsv] = useState(null); // { header: [], rows: [[]] }
    const [idCol, setIdCol] = useState(-1);
    const [emailCol, setEmailCol] = useState(-1);
    const [busy, setBusy] = useState(false);

    const onFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const rows = parseCsv(await file.text());
        if (rows.length < 2) { alert('That file has no data rows.'); return; }
        const [header, ...data] = rows;
        setCsv({ header, rows: data });
        setIdCol(header.findIndex(h => /addovedi/i.test(h)));
        setEmailCol(header.findIndex(h => /e-?mail/i.test(h)));
    };

    const result = useMemo(() => {
        if (!csv || !eventTitle || (idCol < 0 && emailCol < 0)) return null;
        const regs = registrations.filter(r => r.eventTitle === eventTitle && r.status !== 'CANCELLED');
        const csvIds = new Set(), csvEmails = new Set();
        csv.rows.forEach(r => {
            if (idCol >= 0 && norm(r[idCol])) csvIds.add(norm(r[idCol]));
            if (emailCol >= 0 && norm(r[emailCol])) csvEmails.add(norm(r[emailCol]));
        });
        const siteIds = new Set(), siteEmails = new Set();
        regs.forEach(r => {
            siteIds.add(norm(r.leaderUID));
            (r.members || []).forEach(m => siteIds.add(norm(m.uid)));
            if (r.userEmail) siteEmails.add(norm(r.userEmail));
        });
        const matched = [], websiteOnly = [];
        regs.forEach(r => {
            const hit = csvIds.has(norm(r.leaderUID)) || (r.userEmail && csvEmails.has(norm(r.userEmail)));
            (hit ? matched : websiteOnly).push(r);
        });
        const unstopOnly = csv.rows.filter(r => {
            const idHit = idCol >= 0 && siteIds.has(norm(r[idCol]));
            const mailHit = emailCol >= 0 && siteEmails.has(norm(r[emailCol]));
            return !idHit && !mailHit;
        });
        return { matched, websiteOnly, unstopOnly, pendingMatched: matched.filter(r => r.status !== 'VERIFIED') };
    }, [csv, eventTitle, idCol, emailCol, registrations]);

    const verifyMatched = async () => {
        const list = result.pendingMatched;
        if (!list.length || !confirm(`MARK ${list.length} MATCHED REGISTRATION(S) AS VERIFIED?`)) return;
        setBusy(true);
        let failed = 0;
        for (const r of list) {
            try {
                const res = await fetch(`${apiBase}/registrations/${r._id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status: 'VERIFIED' }) });
                if (!res.ok) failed++;
            } catch { failed++; }
        }
        setBusy(false);
        onDone();
        alert(failed ? `${list.length - failed} verified, ${failed} failed.` : `${list.length} registration(s) verified.`);
    };

    const colSelect = (label, value, set) => (
        <label style={{ ...mono, color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {label}
            <select value={value} onChange={e => set(Number(e.target.value))}>
                <option value={-1}>(none)</option>
                {csv.header.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
            </select>
        </label>
    );

    return (
        <div style={{ ...box, marginBottom: 24, borderColor: 'rgba(0,229,255,0.2)' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: '#00E5FF', letterSpacing: '0.15em', marginBottom: 6 }}>UNSTOP RECONCILIATION</div>
            <p style={{ ...mono, color: '#9CA3AF', lineHeight: 1.6, margin: '0 0 12px' }}>
                Download the participant list for an event from Unstop (CSV) and load it here. Teams are matched by the Addovedi ID participants typed on Unstop (and email, if you pick that column). The file is read in your browser only.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <label style={{ ...mono, color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    EVENT
                    <select value={eventTitle} onChange={e => setEventTitle(e.target.value)}>
                        <option value="">Select event...</option>
                        {eventTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>
                <label style={{ ...mono, color: '#9CA3AF', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    UNSTOP CSV
                    <input type="file" accept=".csv,text/csv" onChange={onFile} />
                </label>
                {csv && colSelect('ADDOVEDI ID COLUMN', idCol, setIdCol)}
                {csv && colSelect('EMAIL COLUMN (OPTIONAL)', emailCol, setEmailCol)}
            </div>

            {csv && eventTitle && idCol < 0 && emailCol < 0 && (
                <p style={{ ...mono, color: '#FBBF24', marginTop: 12 }}>No "Addovedi ID" column was found in this file. Pick the column that holds it (or an email column) above.</p>
            )}

            {result && (
                <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', ...mono }}>
                        <span style={{ color: '#1FFF76' }}>MATCHED: {result.matched.length}</span>
                        <span style={{ color: '#FBBF24' }}>ON WEBSITE, NOT ON UNSTOP: {result.websiteOnly.length}</span>
                        <span style={{ color: '#FF4D6D' }}>ON UNSTOP, NOT ON WEBSITE: {result.unstopOnly.length}</span>
                    </div>

                    {result.pendingMatched.length > 0 && (
                        <button type="button" disabled={busy} onClick={verifyMatched} style={{ alignSelf: 'start', padding: '8px 18px', border: 'none', background: '#1FFF76', color: '#000', fontFamily: 'monospace', fontWeight: 900, cursor: 'pointer' }}>
                            {busy ? 'VERIFYING...' : `VERIFY ${result.pendingMatched.length} MATCHED PENDING`}
                        </button>
                    )}

                    <div style={box}>
                        <div style={{ ...mono, color: '#FF4D6D', marginBottom: 6 }}>ON UNSTOP BUT NOT REGISTERED ON THE WEBSITE (these teams skipped the Addovedi registration)</div>
                        {result.unstopOnly.length === 0 ? <div style={{ ...mono, color: '#6B7280' }}>None</div> : result.unstopOnly.slice(0, 200).map((r, i) => (
                            <div key={i} style={{ ...mono, color: '#D1D5DB', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.filter(c => c.trim()).slice(0, 6).join('  ·  ')}</div>
                        ))}
                    </div>

                    <div style={box}>
                        <div style={{ ...mono, color: '#FBBF24', marginBottom: 6 }}>REGISTERED ON THE WEBSITE BUT NOT FOUND ON UNSTOP (may not have finished on Unstop, or typed the wrong ID)</div>
                        {result.websiteOnly.length === 0 ? <div style={{ ...mono, color: '#6B7280' }}>None</div> : result.websiteOnly.map(r => (
                            <div key={r._id} style={{ ...mono, color: '#D1D5DB', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{r.teamName}  ·  {r.leaderName}  ·  {r.leaderUID}  ·  {r.status}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
