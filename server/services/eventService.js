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

export const createSubEvent = async (data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    const sub = new SubEvent(cleanData);
    return await sub.save();
};

export const updateSubEvent = async (id, data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    return await SubEvent.findByIdAndUpdate(id, cleanData, { new: true, runValidators: true });
};

export const deleteSubEvent = async (id) => {
    const sub = await SubEvent.findByIdAndDelete(id);
    if (!sub) throw new Error('SubEvent not found');
    return sub;
};
