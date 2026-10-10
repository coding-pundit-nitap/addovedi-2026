import Counter from '../models/Counter.js';

// TEAM-ADV26-0001, 0002, ... from an atomic counter (same two-step pattern as Addovedi IDs).
export async function nextTeamId() {
    await Counter.updateOne({ _id: 'teamId' }, { $setOnInsert: { seq: 0 } }, { upsert: true });
    const c = await Counter.findByIdAndUpdate('teamId', { $inc: { seq: 1 } }, { new: true });
    return `TEAM-ADV26-${c.seq.toString().padStart(4, '0')}`;
}

// Final = a live registration with no teamId yet, nobody pending, and every slot filled by an accepted
// teammate (accepted + leader === teamSize). Declined/expired entries are history, not members.
export const readyToFinalize = (reg) => {
    if (reg.teamId || reg.status === 'CANCELLED') return false;
    const members = reg.members || [];
    if (members.some(m => m.status === 'PENDING')) return false;
    const accepted = members.filter(m => (m.status || 'ACCEPTED') === 'ACCEPTED').length;
    return accepted + 1 === (reg.teamSize || 1);
};

export async function finalizeIfReady(reg) {
    if (!readyToFinalize(reg)) return false;
    reg.teamId = await nextTeamId();
    reg.teamFinalAt = new Date();
    await reg.save();
    return true;
}
