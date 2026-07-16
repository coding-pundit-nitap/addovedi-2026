import * as messageService from '../services/messageService.js';

export const getMessages = async (req, res) => {
    try {
        const messages = await messageService.getInboxMessages();
        return res.json(messages);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const createMessage = async (req, res) => {
    try {
        const msg = await messageService.saveContactMessage(req.body);
        return res.status(201).json(msg);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        await messageService.deleteContactMessage(req.params.id);
        return res.json({ message: 'Message successfully deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
