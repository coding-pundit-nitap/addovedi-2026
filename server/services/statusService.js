import ConnectStatus from '../models/ConnectStatus.js';

export const getStatusSettings = async () => {
    let status = await ConnectStatus.findOne();
    if (!status) {
        status = new ConnectStatus();
        await status.save();
    }
    return status;
};

export const updateStatusSettings = async (data) => {
    let status = await ConnectStatus.findOne();
    if (!status) {
        status = new ConnectStatus(data);
    } else {
        Object.assign(status, data);
    }
    return await status.save();
};
