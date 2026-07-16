import Category from '../models/Category.js';
import SubEvent from '../models/SubEvent.js';

export const getEventsAndCategories = async () => {
    const categories = await Category.find().sort({ createdAt: 1 });
    const subEvents = await SubEvent.find().sort({ createdAt: 1 });
    return { categories, subEvents };
};

export const createCategory = async (data) => {
    const cat = new Category(data);
    return await cat.save();
};

export const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategoryAndCascade = async (id) => {
    const cat = await Category.findByIdAndDelete(id);
    if (!cat) throw new Error('Category not found');
    
    // Cascade delete sub-events belonging to this category title
    await SubEvent.deleteMany({ categoryTitle: cat.title });
    return cat;
};

export const createSubEvent = async (data) => {
    const sub = new SubEvent(data);
    return await sub.save();
};

export const updateSubEvent = async (id, data) => {
    return await SubEvent.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSubEvent = async (id) => {
    const sub = await SubEvent.findByIdAndDelete(id);
    if (!sub) throw new Error('SubEvent not found');
    return sub;
};
