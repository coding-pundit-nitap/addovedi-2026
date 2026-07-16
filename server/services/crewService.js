import Crew from '../models/Crew.js';

export const getCrewList = async () => {
    return await Crew.find().sort({ createdAt: 1 });
};

export const createCrewMember = async (data) => {
    const member = new Crew(data);
    return await member.save();
};

export const updateCrewMember = async (id, data) => {
    return await Crew.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCrewMember = async (id) => {
    const member = await Crew.findByIdAndDelete(id);
    if (!member) throw new Error('Crew member not found');
    return member;
};
