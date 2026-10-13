import * as eventService from '../services/eventService.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { clientMessage } from '../utils/errors.js';

export const getEvents = async (req, res) => {
    try {
        const data = await eventService.getEventsAndCategories();
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
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
        return res.status(400).json({ message: clientMessage(err) });
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
        return res.status(400).json({ message: clientMessage(err) });
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
        return res.status(500).json({ message: clientMessage(err) });
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
        return res.status(400).json({ message: clientMessage(err) });
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
        return res.status(400).json({ message: clientMessage(err) });
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
        return res.status(500).json({ message: clientMessage(err) });
    }
};

// Admin only: close / re-open registration for ONE event. Does not touch existing registrations, teams or any other field.
export const setSubEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id)) return res.status(400).json({ message: 'Invalid event.' });
        if (typeof req.body?.closed !== 'boolean') return res.status(400).json({ message: 'closed must be true or false.' });
        const sub = await eventService.setSubEventRegistrationClosed(id, req.body.closed);
        if (!sub) return res.status(404).json({ message: 'SubEvent not found' });
        await recordAuditLog(req, { action: req.body.closed ? 'EVENT_REGISTRATION_CLOSED' : 'EVENT_REGISTRATION_OPENED', details: { subEventId: id, title: sub.title } });
        return res.json({ title: sub.title, registrationClosed: sub.registrationClosed === true });
    } catch (err) {
        return res.status(500).json({ message: clientMessage(err) });
    }
};
