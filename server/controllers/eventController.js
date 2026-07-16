import * as eventService from '../services/eventService.js';

export const getEvents = async (req, res) => {
    try {
        const data = await eventService.getEventsAndCategories();
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const cat = await eventService.createCategory(req.body);
        return res.status(201).json(cat);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const cat = await eventService.updateCategory(req.params.id, req.body);
        if (!cat) return res.status(404).json({ message: 'Category not found' });
        return res.json(cat);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await eventService.deleteCategoryAndCascade(req.params.id);
        return res.json({ message: 'Category and all corresponding sub-events cascade deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createSubEvent = async (req, res) => {
    try {
        const sub = await eventService.createSubEvent(req.body);
        return res.status(201).json(sub);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateSubEvent = async (req, res) => {
    try {
        const sub = await eventService.updateSubEvent(req.params.id, req.body);
        if (!sub) return res.status(404).json({ message: 'SubEvent not found' });
        return res.json(sub);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteSubEvent = async (req, res) => {
    try {
        await eventService.deleteSubEvent(req.params.id);
        return res.json({ message: 'Sub-Event successfully deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
