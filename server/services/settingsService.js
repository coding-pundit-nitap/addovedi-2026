import SiteSettings from '../models/SiteSettings.js';

export const getSettings = async () => {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return settings;
};

export const registrationModeOf = (s) => s.registrationMode || (s.registrationOpen === true ? 'open' : 'soon');

export const isRegistrationOpen = async () => registrationModeOf(await getSettings()) === 'open';

export const setRegistrationMode = async (mode) => {
    const settings = await getSettings();
    settings.registrationMode = mode;
    settings.registrationOpen = mode === 'open';
    return await settings.save();
};

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
