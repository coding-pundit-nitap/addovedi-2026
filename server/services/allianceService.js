import Sponsor from '../models/Sponsor.js';
import SponsorCategory from '../models/SponsorCategory.js';

export const getAlliancesList = async () => {
    return await Sponsor.find().sort({ createdAt: 1 });
};

export const createAlliance = async (data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    const alliance = new Sponsor(cleanData);
    return await alliance.save();
};

export const updateAlliance = async (id, data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    return await Sponsor.findByIdAndUpdate(id, cleanData, { new: true, runValidators: true });
};

export const deleteAlliance = async (id) => {
    const alliance = await Sponsor.findByIdAndDelete(id);
    if (!alliance) throw new Error('Alliance sponsor not found');
    return alliance;
};

/* ── Sponsor categories (name + priority 1-5, drives card size and order) ── */
export const getCategories = async () => {
    return await SponsorCategory.find().sort({ priority: 1, createdAt: 1 });
};

export const createCategory = async ({ name, priority, color }) => {
    return await SponsorCategory.create({ name, priority, color });
};

export const updateCategory = async (id, { name, priority, color }) => {
    const existing = await SponsorCategory.findById(id);
    if (!existing) return null;
    const oldName = existing.name;
    if (name !== undefined) existing.name = name;
    if (priority !== undefined) existing.priority = priority;
    if (color !== undefined) existing.color = color;
    await existing.save();
    // Sponsors reference their category by name, so keep them attached on rename.
    if (existing.name !== oldName) await Sponsor.updateMany({ category: oldName }, { category: existing.name });
    return existing;
};

export const deleteCategory = async (id) => {
    const cat = await SponsorCategory.findById(id);
    if (!cat) throw new Error('Category not found');
    const inUse = await Sponsor.countDocuments({ category: cat.name });
    if (inUse > 0) throw new Error(`Cannot delete: ${inUse} sponsor(s) still use "${cat.name}". Move them to another category first.`);
    await cat.deleteOne();
};
