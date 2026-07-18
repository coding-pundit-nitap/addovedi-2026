import { useStore } from '../../store/useStore';

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
    isRegistered,
    isMobileModal,
    btnThemeStyles
}) {
    const loggedInUser = JSON.parse(localStorage.getItem('addovedi_user') || 'null');

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
                            <span>SIGN IN // REGISTER PLAYER</span>
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

    // Check if this event is already registered in localStorage
    const storedRegs = JSON.parse(localStorage.getItem('addovedi_registrations') || '[]');
    const isCurrentEventRegistered = storedRegs.some(r => r.title === activeEvent.title);

    if (isCurrentEventRegistered || isRegistered) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: isMobileModal ? '40px 10px' : '60px 40px', fontFamily: "'Rajdhani', sans-serif", height: '100%' }}>
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black mb-2 animate-bounce"
                    style={{
                        background: `${activeEvent.color}15`,
                        color: activeEvent.color,
                        border: `2px solid ${activeEvent.color}`,
                        boxShadow: `0 0 20px ${activeEvent.color}40`,
                    }}
                >
                    ✓
                </div>
                <h3 style={{ fontSize: isMobileModal ? '16px' : '22px', fontFamily: "'Orbitron', sans-serif", fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                    MISSION_SECURED
                </h3>
                <p style={{ fontSize: isMobileModal ? '11px' : '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '400px', margin: 0 }}>
                    Your registration details have been synchronized with the database. Check your player profile dashboard to view mission enlists.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: "'Rajdhani', sans-serif", height: isMobileModal ? 'auto' : '100%', overflow: isMobileModal ? 'visible' : 'hidden' }}>
            <div style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.25em', fontWeight: 900, color: activeEvent.color, opacity: 0.8 }}>
                {'// INITIATE_REGISTRATION_PROTOCOL'}
            </div>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="cyber-rules-scrollbar">
                <div style={{ display: 'flex', flexDirection: isMobileModal ? 'column' : 'row', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2 }}>
                        <label htmlFor="teamName" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: activeEvent.color }}>▸</span> TEAM NAME // CALLSIGN
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input id="teamName" type="text" required placeholder="ENTER TEAM NAME..." value={teamName} onChange={(e) => setTeamName(e.target.value)}
                                className={inputClass} style={{ ...inputStyle, textTransform: 'uppercase' }} onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <label htmlFor="teamSize" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: activeEvent.color }}>▸</span> TEAM SIZE
                        </label>
                        <select id="teamSize" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))}
                            className={inputClass} style={{ ...inputStyle, background: '#02050c', color: '#fff', cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}
                        >
                            {[1, 2, 3, 4, 5].map(n => (
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
                                <label htmlFor="leaderUID" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER UNIQUE ID // G-ID</label>
                                <input id="leaderUID" type="text" required disabled value={leaderUID}
                                    className={inputClass} style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label htmlFor="leaderPhone" style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>LEADER PHONE // COMMS</label>
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
                                    <label htmlFor={`member${i}-uid`} style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.15em', fontWeight: 900, color: 'rgba(255,255,255,0.6)' }}>MEMBER {i + 2} UNIQUE ID // G-ID</label>
                                    <input
                                        id={`member${i}-uid`}
                                        type="text"
                                        required
                                        placeholder={`ENTER MEMBER ${i + 2} G-ID...`}
                                        value={member.uid || ''}
                                        onChange={(e) => {
                                            const updated = [...members];
                                            updated[i] = { ...updated[i], uid: e.target.value };
                                            setMembers(updated);
                                        }}
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
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
                        CONFIRM ENLISTMENT
                        <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold leading-none">▶</span>
                    </span>
                </button>
            </div>
        </form>
    );
}
