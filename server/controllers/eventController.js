import * as eventService from '../services/eventService.js';
import { recordAuditLog } from '../utils/auditLogger.js';

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

        await recordAuditLog(req, {
            action: 'CREATE_CATEGORY',
            details: { title: cat.title, categoryId: cat._id, body: req.body }
        });

        return res.status(201).json(cat);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const cat = await eventService.updateCategory(req.params.id, req.body);
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        await recordAuditLog(req, {
            action: 'UPDATE_CATEGORY',
            details: { categoryId: req.params.id, updatedTitle: cat.title, changes: req.body }
        });

        return res.json(cat);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await eventService.deleteCategoryAndCascade(req.params.id);

        await recordAuditLog(req, {
            action: 'DELETE_CATEGORY',
            details: { categoryId: req.params.id }
        });

        return res.json({ message: 'Category and all corresponding sub-events cascade deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createSubEvent = async (req, res) => {
    try {
        const sub = await eventService.createSubEvent(req.body);

        await recordAuditLog(req, {
            action: 'CREATE_SUB_EVENT',
            details: { subEventTitle: sub.title, categoryTitle: sub.categoryTitle, subEventId: sub._id }
        });

        return res.status(201).json(sub);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const updateSubEvent = async (req, res) => {
    try {
        const sub = await eventService.updateSubEvent(req.params.id, req.body);
        if (!sub) return res.status(404).json({ message: 'SubEvent not found' });

        await recordAuditLog(req, {
            action: 'UPDATE_SUB_EVENT',
            details: { subEventId: req.params.id, title: sub.title, changes: req.body }
        });

        return res.json(sub);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteSubEvent = async (req, res) => {
    try {
        await eventService.deleteSubEvent(req.params.id);

        await recordAuditLog(req, {
            action: 'DELETE_SUB_EVENT',
            details: { subEventId: req.params.id }
        });

        return res.json({ message: 'Sub-Event successfully deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
