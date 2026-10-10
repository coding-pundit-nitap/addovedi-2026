import Counter from '../models/Counter.js';
import Registration from '../models/Registration.js';

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

// Race-safe: two teammates accepting at the same instant each hold a stale copy in which the other is still
// pending, so readiness is re-checked on a FRESH read, and the Team ID is written with a conditional update
// (only if none exists and nobody is pending) so exactly one caller wins and a team never gets two IDs.
export async function finalizeIfReady(reg) {
    const fresh = await Registration.findById(reg._id);
    if (!fresh || !readyToFinalize(fresh)) return false;
    const teamId = await nextTeamId();
    const r = await Registration.updateOne(
        { _id: fresh._id, teamId: { $exists: false }, status: { $ne: 'CANCELLED' }, members: { $not: { $elemMatch: { status: 'PENDING' } } } },
        { $set: { teamId, teamFinalAt: new Date() } }
    );
    if (!r.modifiedCount) return false;
    reg.teamId = teamId;
    return true;
}
