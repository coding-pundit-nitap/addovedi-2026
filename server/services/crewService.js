import Crew from '../models/Crew.js';

export const getCrewList = async () => {
    return await Crew.find().sort({ createdAt: 1 });
};

export const createCrewMember = async (data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    const member = new Crew(cleanData);
    return await member.save();
};

export const updateCrewMember = async (id, data) => {
    const { _id, __v, createdAt, updatedAt, ...cleanData } = data || {};
    return await Crew.findByIdAndUpdate(id, cleanData, { new: true, runValidators: true });
};

export const deleteCrewMember = async (id) => {
    const member = await Crew.findByIdAndDelete(id);
    if (!member) throw new Error('Crew member not found');
    return member;
};
