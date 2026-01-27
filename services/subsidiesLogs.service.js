import subsidiesLogsModel from '../models/subsidiesLogs.model.js'


export async function getSubsidiesLogs(where) {
    try {
        const subsidiesLogs = await subsidiesLogsModel.find(where)
        return subsidiesLogs
    } catch (error) {
        throw error
    }
}

export async function getSubsidieLog(where) {
    try {
        const subsidiesLog = await subsidiesLogsModel.findOne(where)
        return subsidiesLog
    } catch (error) {
        throw error
    }
}