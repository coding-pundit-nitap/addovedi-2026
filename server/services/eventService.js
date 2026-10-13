import Category from '../models/Category.js';
import SubEvent from '../models/SubEvent.js';

export const getEventsAndCategories = async () => {
    const categories = await Category.find().sort({ createdAt: 1 });
    const subEvents = await SubEvent.find().sort({ createdAt: 1 });
    return { categories, subEvents };
};

export const createCategory = async (data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    const cat = new Category(cleanData);
    return await cat.save();
};

export const updateCategory = async (id, data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    return await Category.findByIdAndUpdate(id, cleanData, { new: true, runValidators: true });
};

export const deleteCategoryAndCascade = async (id) => {
    const cat = await Category.findByIdAndDelete(id);
    if (!cat) throw new Error('Category not found');
    
    // Cascade delete sub-events belonging to this category title
    await SubEvent.deleteMany({ categoryTitle: cat.title });
    return cat;
};

// Only these fields can be written to an event, each as a plain value of the right type. Nothing from the request body is
// passed to the database as an object (so it can never carry query/update operators), unknown keys are ignored, and
// `registrationClosed` is deliberately absent: it only changes through its own endpoint.
const TEXT_FIELDS = ['categoryTitle', 'title', 'subtitle', 'desc', 'overview', 'fee', 'color', 'xp', 'difficulty', 'iconType', 'modelType', 'unstopUrl'];
const bad = (message) => Object.assign(new Error(message), { status: 400 });
const asText = (v, name) => { if (typeof v !== 'string') throw bad(`${name} must be text.`); return v; };
const asInt = (v, name) => { const n = typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN); if (!Number.isInteger(n)) throw bad(`${name} must be a whole number.`); return n; };
const asDay = (v, name) => (v === '' || v == null ? null : asInt(v, name));
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export const buildSubEventFields = (data) => {
    const src = isPlainObject(data) ? data : {};
    const out = {};
    for (const k of TEXT_FIELDS) if (src[k] !== undefined) out[k] = asText(src[k], k);
    for (const k of ['minTeam', 'maxTeam']) if (src[k] !== undefined) out[k] = asInt(src[k], k);
    if (src.heads !== undefined) {
        if (!Array.isArray(src.heads) || src.heads.length > 10) throw bad('heads must be a short list.');
        out.heads = src.heads.map(h => ({ name: typeof h?.name === 'string' ? h.name : '', phone: typeof h?.phone === 'string' ? h.phone : '' }));
    }
    if (src.timeline !== undefined) {
        const t = src.timeline;
        if (!isPlainObject(t)) throw bad('timeline must be an object.');
        const tl = {};
        for (const k of ['time', 'end', 'label', 'venue', 'mode', 'prize']) if (t[k] !== undefined) tl[k] = asText(t[k], `timeline.${k}`);
        for (const k of ['day', 'endDay']) if (t[k] !== undefined) tl[k] = asDay(t[k], `timeline.${k}`);
        if (t.sessions !== undefined) {
            if (!Array.isArray(t.sessions) || t.sessions.length > 10) throw bad('timeline.sessions must be a short list.');
            tl.sessions = t.sessions.map(x => {
                if (!isPlainObject(x)) throw bad('Each session must be an object.');
                const ses = { day: asInt(x.day, 'session day') };
                for (const k of ['time', 'end', 'venue', 'label']) if (x[k] !== undefined) ses[k] = asText(x[k], `session ${k}`);
                if (x.endDay !== undefined) ses.endDay = asDay(x.endDay, 'session endDay');
                return ses;
            });
        }
        out.timeline = tl;
    }
    return out;
};

export const createSubEvent = async (data) => {
    const sub = new SubEvent(buildSubEventFields(data));
    return await sub.save();
};

const OBJECT_ID = /^[a-f0-9]{24}$/i;
export const updateSubEvent = async (id, data) => {
    if (typeof id !== 'string' || !OBJECT_ID.test(id)) throw bad('Invalid event.');
    return await SubEvent.findByIdAndUpdate(id, { $set: buildSubEventFields(data) }, { new: true, runValidators: true });
};

export const setSubEventRegistrationClosed = async (id, closed) => {
    if (typeof id !== 'string' || !OBJECT_ID.test(id) || typeof closed !== 'boolean') throw bad('Invalid request.');
    return await SubEvent.findByIdAndUpdate(id, { $set: { registrationClosed: closed } }, { new: true });
};

export const deleteSubEvent = async (id) => {
    const sub = await SubEvent.findByIdAndDelete(id);
    if (!sub) throw new Error('SubEvent not found');
    return sub;
};
