import rpaLogsModel from '../models/rpaLogs.model.js'
import { logError } from '../utils/logs.js'

export async function getRpaLog(where) {
    try {
        const rpaLog = await rpaLogsModel.findOne(where)
        if(!rpaLog) {
            logError(`RpaLog not found for lawsuitNumber: ${where.lawsuitNumber}`)
            throw new Error(`RpaLog not found for lawsuitNumber: ${where.lawsuitNumber}`)
        }
        return rpaLog
    } catch (error) {
        throw error
    }
}