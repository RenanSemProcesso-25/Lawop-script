import { readFile } from 'fs/promises'
import { getRpaLog } from "../services/rpaLogs.service.js";
import * as XLSX from 'xlsx'
import { join } from 'path'
import { logSuccess, logError } from '../utils/logs.js';

const groupId = process.env.CCR_GROUP_ID

async function setRpaLogOtherInfoData(lawsuitNumber, otherInfo) {
    try {
        const rpaLog = await getRpaLog({lawsuitNumber, groupId})
        if(!rpaLog.otherInfos) rpaLog.otherInfos = {}
        rpaLog.otherInfos = otherInfo
        await rpaLog.save()
        logSuccess(`RpaLog otherInfo data updated for lawsuitNumber: ${lawsuitNumber}`)
    } catch (error) {
        logError(`Error updating RpaLog otherInfo data for lawsuitNumber: ${lawsuitNumber}`)
        throw error
    }
}

async function updateRpaLogs() {
    const filePath = join(process.cwd(), 'documents', 'rpa-data.json')
    console.log(filePath)
    const buffer = await readFile(filePath, 'utf-8')

    const rpaLogs = JSON.parse(buffer)
    for(const rpa of rpaLogs) {
        await setRpaLogOtherInfoData(rpa.lawsuitNumber, rpa.otherInfo)
    }
}

export default updateRpaLogs