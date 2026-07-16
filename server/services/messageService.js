import ContactMessage from '../models/ContactMessage.js';

export const getInboxMessages = async () => {
    return await ContactMessage.find().sort({ createdAt: -1 });
};

export const saveContactMessage = async (data) => {
    const msg = new ContactMessage(data);
    return await msg.save();
};

export const deleteContactMessage = async (id) => {
    const msg = await ContactMessage.findByIdAndDelete(id);
    if (!msg) throw new Error('Message not found');
    return msg;
};
