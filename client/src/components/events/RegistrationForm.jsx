import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { API_BASE } from '../../constants/api';

export default function RegistrationForm({
    activeEvent,
    activeCategory,
    onClose,
    teamName,
    setTeamName,
    leaderName,
    leaderUID,
    leaderPhone,
    teamSize,
    setTeamSize,
    members,
    setMembers,
    handleRegisterSubmit,
    handleCancelRegistration,
    isRegistered,
    existingReg,
    isMobileModal,
    btnThemeStyles
}) {
    const loggedInUser = JSON.parse(localStorage.getItem('addovedi_user') || 'null');
    const [unstopInitiated, setUnstopInitiated] = useState(false);
    const [unstopRefId, setUnstopRefId] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    // Tracks each team member's Addovedi-ID verification: undefined (not yet
    // checked), 'checking', 'valid', or 'invalid'. Keyed by member index.
    const [memberUidStatus, setMemberUidStatus] = useState({});

    const checkMemberUid = async (index, uid) => {
        const trimmed = (uid || '').trim();
        if (!trimmed) {
            setMemberUidStatus(prev => ({ ...prev, [index]: undefined }));
            return;
        }
        setMemberUidStatus(prev => ({ ...prev, [index]: 'checking' }));
        try {
            const res = await fetch(`${API_BASE}/participants/check-uid/${encodeURIComponent(trimmed)}`);
            const data = await res.json();
            setMemberUidStatus(prev => ({ ...prev, [index]: data.exists ? 'valid' : 'invalid' }));
        } catch (err) {
            setMemberUidStatus(prev => ({ ...prev, [index]: 'invalid' }));
        }
    };

    const inputClass = `w-full bg-[#02050c]/85 border text-white placeholder-white/30 ${isMobileModal ? 'px-3 py-1.5' : 'px-4 py-2.5'} focus:outline-none transition-all duration-300 rounded-none tracking-wider`;
    const inputStyle = {
        fontSize: isMobileModal ? '11px' : '14px',
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 600,
        borderColor: `${activeEvent.color}30`,
        boxShadow: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%)',
        backgroundSize: '100% 4px',
        letterSpacing: '0.05em'
    };

    const onFocus = (e) => { 
        e.target.style.borderColor = activeEvent.color; 
        e.target.style.boxShadow = `0 0 20px ${activeEvent.color}35, inset 0 0 20px ${activeEvent.color}08`; 
    };
    
    const onBlur = (e) => { 
        e.target.style.borderColor = `${activeEvent.color}30`; 
        e.target.style.boxShadow = 'none'; 
    };

    if (!loggedInUser) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '40px 10px' : '60px 40px', fontFamily: "'Rajdhani', sans-serif" }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid #FF2EA6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF2EA6',
                    fontSize: '20px',
                    fontWeight: 900,
                    boxShadow: '0 0 15px rgba(255, 46, 166, 0.4)',
                }}>
                    ⚠
                </div>
                <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: isMobileModal ? '14px' : '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>SECURE ACCESS KEY REQUIRED</h3>
                    <p style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px', maxWidth: '380px', lineHeight: 1.6 }}>
                        All event enlistments require player authentication. Establish connection with the database to register.
                    </p>
                </div>
                <div className="event-reg-btn-wrap" style={btnThemeStyles}>
                    <button
                        onClick={() => {
                            onClose();
                            useStore.getState().setAuthModalOpen(true);
                        }}
                        className="event-reg-btn group py-3 px-8 text-xs font-bold font-mono border-0 cursor-pointer"
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                backgroundSize: '250% 250%',
                                animation: 'border-flow 2.8s ease infinite',
                            }}
                        />
                        <div
                            className="absolute"
                            style={{
                                inset: '1.5px',
                                clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                            }}
                        />
                        <span className="event-reg-fill" />
                        <span className="relative z-10 flex items-center gap-1 font-bold text-xs" style={{ fontFamily: "'Orbitron', monospace", letterSpacing: '0.12em', color: '#fff' }}>
                            <span>SIGN IN · REGISTER PLAYER</span>
                            <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold leading-none" style={{ color: '#00D9FF' }}>▶</span>
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    if (!loggedInUser.isGlobalRegistered) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '40px 10px' : '60px 40px', fontFamily: "'Rajdhani', sans-serif" }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid #F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B',
                    fontSize: '20px',
                    fontWeight: 900,
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
                }}>
                    ℹ
                </div>
                <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: isMobileModal ? '14px' : '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>GLOBAL REGISTRATION REQUIRED</h3>
                    <p style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px', maxWidth: '380px', lineHeight: 1.6 }}>
                        Please compile your Addovedi global profile first to acquire a unique Addovedi ID. Only verified players can enlist in arena missions.
                    </p>
                </div>
                <div className="event-reg-btn-wrap" style={btnThemeStyles}>
                    <button
                        onClick={() => {
                            onClose();
                            useStore.getState().setAuthModalOpen(true);
                        }}
                        className="event-reg-btn group py-3 px-8 text-xs font-bold font-mono border-0 cursor-pointer"
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(135deg, #0891b2 0%, #00D9FF 40%, #67e8f9 70%, #0891b2 100%)',
                                backgroundSize: '250% 250%',
                                animation: 'border-flow 2.8s ease infinite',
                            }}
                        />
                        <div
                            className="absolute"
                            style={{
                                inset: '1.5px',
                                clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                                background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                            }}
                        />
                        <span className="event-reg-fill" />
                        <span className="relative z-10 flex items-center gap-1 font-bold text-xs" style={{ fontFamily: "'Orbitron', monospace", letterSpacing: '0.12em', color: '#fff' }}>
                            <span>COMPILE GLOBAL PROFILE</span>
                            <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold leading-none" style={{ color: '#00D9FF' }}>▶</span>
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    // existingReg comes from the server (the real registration record, as
    // leader or as a team member) via props — no more reading a local cache.
    const isCurrentEventRegistered = Boolean(existingReg) || isRegistered;
    const isVerified = existingReg?.status === 'VERIFIED';

    const addovediId = loggedInUser.addovediId || loggedInUser.uniqueId || 'ADV26-REC1';

    // If registration is already saved on website
    if (isCurrentEventRegistered) {
        const isMember = existingReg && existingReg.isLeader === false;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '30px 10px' : '50px 30px', fontFamily: "'Rajdhani', sans-serif", height: '100%' }}>
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mb-1 ${isVerified ? '' : 'animate-pulse'}`}
                    style={{
                        background: `${isVerified ? '#1FFF76' : activeEvent.color}15`,
                        color: isVerified ? '#1FFF76' : activeEvent.color,
                        border: `2px solid ${isVerified ? '#1FFF76' : activeEvent.color}`,
                        boxShadow: `0 0 20px ${isVerified ? '#1FFF76' : activeEvent.color}40`,
                    }}
                >
                    {isVerified ? '✓' : '⏳'}
                </div>
                <h3 style={{ fontSize: isMobileModal ? '16px' : '22px', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                    {isVerified ? 'MISSION_SECURED' : 'UNSTOP_VERIFICATION_PENDING'}
                </h3>
                <p style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '420px', margin: 0 }}>
                    Team <strong>"{existingReg?.teamName || teamName || 'Your Team'}"</strong> logged on Addovedi database.<br />
                    {isMember && existingReg?.leaderName ? <>You're registered as a team member (led by <strong>{existingReg.leaderName}</strong>).<br /></> : null}
                    {isVerified
                        ? 'Admin has verified this registration against the Unstop participant roster.'
                        : (existingReg?.unstopRefId ? `Unstop Ref ID: ${existingReg.unstopRefId}` : 'Final verification pending against Unstop participant roster.')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px', marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={() => window.open(activeEvent.unstopUrl || 'https://unstop.com', '_blank')}
                        style={{
                            padding: '12px',
                            background: activeEvent.color,
                            color: '#02050c',
                            fontWeight: 900,
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 0 20px ${activeEvent.color}80`
                        }}
                    >
                        RE-VISIT UNSTOP EVENT PAGE ↗
                    </button>

                    {isMember ? (
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
                            Only the team leader ({existingReg.leaderName}) can cancel this registration.
                        </p>
                    ) : (
                        <button
                            type="button"
                            disabled={isCancelling}
                            onClick={async () => {
                                setIsCancelling(true);
                                if (handleCancelRegistration) {
                                    await handleCancelRegistration();
                                }
                                setIsCancelling(false);
                            }}
                            style={{
                                padding: '10px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                color: '#f87171',
                                fontWeight: 700,
                                fontFamily: "'Orbitron', sans-serif",
                                fontSize: '11px',
                                letterSpacing: '0.08em',
                                cursor: 'pointer'
                            }}
                        >
                            {isCancelling ? 'CANCELING...' : 'DID NOT REGISTER ON UNSTOP? CANCEL / RESET REGISTRATION ✕'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Handler when user submits initial team form to open Unstop
    const handleInitiateUnstop = (e) => {
        e.preventDefault();
        if (!teamName || !leaderName || !leaderUID || !leaderPhone) return;

        // Every team member's Addovedi ID must have been verified to exist
        // before the team can proceed.
        if ((members || []).some(m => !(m?.uid || '').trim())) {
            alert('Every team member needs an Addovedi ID. Fill in the blank teammate ID(s) or reduce the team size.');
            return;
        }
        const allVerified = (members || []).every((m, idx) => memberUidStatus[idx] === 'valid');
        if (!allVerified) {
            alert('Please wait for all team member Addovedi IDs to be verified (or fix any that show as not found) before proceeding.');
            return;
        }

        // Open Unstop portal in new tab
        window.open(activeEvent.unstopUrl || 'https://unstop.com', '_blank');
        setUnstopInitiated(true);
    };

    // Step 2: Unstop opened in new tab. Waiting for confirmation
    if (unstopInitiated) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '30px 10px' : '40px 30px', fontFamily: "'Rajdhani', sans-serif", height: '100%' }}>
                <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    border: '2px solid #F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#F59E0B',
                    fontSize: '24px',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                }}>
                    ⏳
                </div>

                <div>
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: isMobileModal ? '15px' : '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.08em', margin: 0 }}>
                        UNSTOP PORTAL OPENED IN NEW TAB
                    </h3>
                    <p style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', maxWidth: '420px', lineHeight: 1.5 }}>
                        Complete registration on <strong>Unstop</strong> and type the team leader's Addovedi ID in the <strong>Addovedi ID</strong> field: <strong style={{ color: activeEvent.color }}>{leaderUID || addovediId}</strong>. Registrations without it can't be matched and won't be accepted.
                    </p>
                </div>

                <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                    <label style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>
                        UNSTOP REGISTRATION ID / APP NO. (OPTIONAL)
                    </label>
                    <input
                        type="text"
                        placeholder="E.G. UNSTOP-102948"
                        value={unstopRefId}
                        onChange={(e) => setUnstopRefId(e.target.value)}
                        className={inputClass}
                        style={{ ...inputStyle, textTransform: 'uppercase' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px', marginTop: '6px' }}>
                    <button
                        type="button"
                        onClick={(e) => handleRegisterSubmit(e, unstopRefId)}
                        style={{
                            padding: '12px',
                            background: activeEvent.color,
                            color: '#02050c',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '12px',
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: `0 0 20px ${activeEvent.color}80`
                        }}
                    >
                        I HAVE COMPLETED REGISTRATION ON UNSTOP ✓
                    </button>

                    <button
                        type="button"
                        onClick={() => window.open(activeEvent.unstopUrl || 'https://unstop.com', '_blank')}
                        style={{
                            padding: '10px',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${activeEvent.color}50`,
                            color: '#fff',
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            cursor: 'pointer'
                        }}
                    >
                        RE-OPEN UNSTOP TAB ↗
                    </button>

                    <button
                        type="button"
                        onClick={() => setUnstopInitiated(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f87171',
                            fontSize: '11px',
                            fontFamily: "'Orbitron', sans-serif",
                            cursor: 'pointer',
                            marginTop: '4px'
                        }}
                    >
                        ✕ Cancel / I did not complete Unstop registration
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleInitiateUnstop} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: "'Rajdhani', sans-serif", height: isMobileModal ? 'auto' : '100%', overflow: isMobileModal ? 'visible' : 'hidden' }}>
            {/* ADDOVEDI ID & UNSTOP PARTNERSHIP CARD */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(5, 12, 24, 0.95) 100%)',
                border: `1px solid ${activeEvent.color}50`,
                padding: '10px 14px',
                borderRadius: '2px',
                boxShadow: `0 0 15px ${activeEvent.color}15`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: activeEvent.color }}>
                            ADDOVEDI ID · OFFICIAL ACCESS TOKEN
                        </div>
                        <div style={{ fontSize: isMobileModal ? '15px' : '18px', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: '#ffffff', letterSpacing: '0.15em', marginTop: '2px', textShadow: `0 0 10px ${activeEvent.color}80` }}>
                            {addovediId}
                        </div>
                    </div>
                    <span style={{ fontSize: '9px', background: `${activeEvent.color}20`, border: `1px solid ${activeEvent.color}50`, color: '#fff', padding: '4px 8px', borderRadius: '2px', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.08em' }}>
                        UNSTOP PARTNERED
                    </span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', lineHeight: 1.3 }}>
                    Provide this Addovedi ID during registration on <strong>Unstop</strong>. Submitting redirects you to the official Unstop portal.
                </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="cyber-rules-scrollbar">
                <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2 }}>
                        <label htmlFor="teamName" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: activeEvent.color }}>▸</span> TEAM NAME · CALLSIGN
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input id="teamName" type="text" required placeholder="ENTER TEAM NAME..." value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                className={inputClass} style={{ ...inputStyle, textTransform: 'uppercase' }} onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <label htmlFor="teamSize" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: activeEvent.color }}>▸</span> TEAM SIZE{(activeEvent.minTeam ?? 1) === (activeEvent.maxTeam ?? 5) ? ` (FIXED: ${activeEvent.minTeam ?? 1})` : ` (${activeEvent.minTeam ?? 1}-${activeEvent.maxTeam ?? 5})`}
                        </label>
                        <select id="teamSize" value={teamSize} disabled={(activeEvent.minTeam ?? 1) === (activeEvent.maxTeam ?? 5)} onChange={(e) => setTeamSize(Number(e.target.value))}
                            className={inputClass} style={{ ...inputStyle, background: '#02050c', color: '#fff', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}
                        >
                            {Array.from({ length: Math.max(1, (activeEvent.maxTeam ?? 5) - (activeEvent.minTeam ?? 1) + 1) }, (_, i) => (activeEvent.minTeam ?? 1) + i).map(n => (
                                <option key={n} value={n} style={{ background: '#02050c', color: '#fff' }}>{n} {n === 1 ? 'MEMBER' : 'MEMBERS'}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                    <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: activeEvent.color, fontWeight: 900, marginBottom: '8px' }}>
                        [ LEADER_METADATA ]
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <label htmlFor="leaderName" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER NAME</label>
                                <input id="leaderName" type="text" required disabled value={leaderName}
                                    className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <label htmlFor="leaderUID" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>ADDOVEDI ID · G-ID</label>
                                <input id="leaderUID" type="text" required disabled value={addovediId || leaderUID}
                                    className={inputClass} style={{ ...inputStyle, opacity: 0.8, color: activeEvent.color, fontWeight: 800, cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label htmlFor="leaderPhone" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER PHONE · COMMS</label>
                            <input id="leaderPhone" type="tel" required disabled value={leaderPhone}
                                className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>
                </div>

                {members && members.map((member, i) => (
                    <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '4px' }}>
                        <div style={{ fontSize: '9px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', color: activeEvent.color, fontWeight: 900, marginBottom: '8px' }}>
                            [ MEMBER_{i + 2}_METADATA ]
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <label htmlFor={`member${i}-name`} style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>MEMBER {i + 2} NAME</label>
                                    <input
                                        id={`member${i}-name`}
                                        type="text"
                                        required
                                        placeholder={`ENTER MEMBER ${i + 2} NAME...`}
                                        value={member.name || ''}
                                        onChange={(e) => {
                                            const updated = [...members];
                                            updated[i] = { ...updated[i], name: e.target.value };
                                            setMembers(updated);
                                        }}
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <label htmlFor={`member${i}-uid`} style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>MEMBER {i + 2} ADDOVEDI ID</label>
                                    <input
                                        id={`member${i}-uid`}
                                        type="text"
                                        required
                                        placeholder={`ADV26-XXXX...`}
                                        value={member.uid || ''}
                                        onChange={(e) => {
                                            const updated = [...members];
                                            updated[i] = { ...updated[i], uid: e.target.value };
                                            setMembers(updated);
                                            setMemberUidStatus(prev => ({ ...prev, [i]: undefined }));
                                        }}
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={(e) => { onBlur(e); checkMemberUid(i, member.uid); }}
                                    />
                                    {memberUidStatus[i] === 'checking' && (
                                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>Verifying...</span>
                                    )}
                                    {memberUidStatus[i] === 'valid' && (
                                        <span style={{ fontSize: '9px', color: '#1FFF76', fontFamily: 'monospace' }}>✓ ID verified</span>
                                    )}
                                    {memberUidStatus[i] === 'invalid' && (
                                        <span style={{ fontSize: '9px', color: '#ff1f4f', fontFamily: 'monospace' }}>✕ Addovedi ID not found — member must sign up first</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="event-reg-btn-wrap" style={{ ...btnThemeStyles, marginTop: 'auto', alignSelf: 'flex-end', width: isMobileModal ? '100%' : 'auto' }}>
                <button type="submit" className="event-reg-btn group py-3 px-10 text-xs font-bold font-mono w-full border-0 cursor-pointer">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg, ${activeEvent.color} 0%, #ffffff 50%, ${activeEvent.color} 100%)`,
                            backgroundSize: '250% 250%',
                            animation: 'border-flow 2.8s ease infinite',
                        }}
                    />
                    <div
                        className="absolute"
                        style={{
                            inset: '1.5px',
                            clipPath: 'polygon(7.5px 0, 100% 0, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 0 100%, 0 7.5px)',
                            background: 'linear-gradient(135deg, #020e1a 0%, #041824 100%)',
                        }}
                    />
                    <span className="event-reg-fill" />
                    <span className="relative z-10 flex items-center justify-center gap-1.5 font-bold" style={{ textShadow: `0 0 10px ${activeEvent.color}` }}>
                        PROCEED TO UNSTOP REGISTRATION ↗
                    </span>
                </button>
            </div>
        </form>
    );
}
