import * as messageService from '../services/messageService.js';
import { verifyTurnstileToken } from '../utils/turnstile.js';
import { isValidEmail } from '../utils/validators.js';

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
        // Same Cloudflare Turnstile check as signup: stops scripts flooding the admin inbox.
        const { turnstileToken, name, email, subject, message } = req.body || {};
        const captchaOk = await verifyTurnstileToken(turnstileToken, req.ip);
        if (!captchaOk) {
            return res.status(400).json({ message: 'Security check failed. Please refresh the check and try again.' });
        }
        if ([name, email, subject, message].some(v => typeof v !== 'string' || !v.trim())) {
            return res.status(400).json({ message: 'Name, email, subject and message are required.' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        // Only the four known fields are stored (never the raw request body).
        const msg = await messageService.saveContactMessage({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
        return res.status(201).json({ _id: msg._id });
    } catch (err) {
        return res.status(400).json({ message: 'Could not send your message. Please check the fields and try again.' });
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
