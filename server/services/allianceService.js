import Sponsor from '../models/Sponsor.js';

export const getAlliancesList = async () => {
    return await Sponsor.find().sort({ createdAt: 1 });
};

export const createAlliance = async (data) => {
    const alliance = new Sponsor(data);
    return await alliance.save();
};

export const updateAlliance = async (id, data) => {
    return await Sponsor.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAlliance = async (id) => {
    const alliance = await Sponsor.findByIdAndDelete(id);
    if (!alliance) throw new Error('Alliance sponsor not found');
    return alliance;
};
