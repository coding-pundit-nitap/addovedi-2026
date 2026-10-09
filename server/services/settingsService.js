import SiteSettings from '../models/SiteSettings.js';

export const getSettings = async () => {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return settings;
};

export const isRegistrationOpen = async () => (await getSettings()).registrationOpen === true;

export const setRegistrationOpen = async (open) => {
    const settings = await getSettings();
    settings.registrationOpen = open === true;
    return await settings.save();
};

export const setCrewVisible = async (visible) => {
    const settings = await getSettings();
    settings.crewVisible = visible === true;
    return await settings.save();
};

export const setEventsVisible = async (visible) => {
    const settings = await getSettings();
    settings.eventsVisible = visible === true;
    return await settings.save();
};
