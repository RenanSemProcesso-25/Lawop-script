import { getSubsidiesLogs } from '../services/subsidiesLogs.service.js'
import { getRpaLog } from '../services/rpaLogs.service.js'
import mongoose from 'mongoose'


async function subsidiesRpaSearch() {
    console.log('iniciando')
    const ObjectId = mongoose.Types.ObjectId	
    const groupId = process.env.GROUP_ID

    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const subsidiesLogs = await getSubsidiesLogs({ groupId:new ObjectId(groupId), createdAt: { $gte: sixtyDaysAgo } })
    console.log(subsidiesLogs.length)

    let tableResult = []

    for(const subsidy of subsidiesLogs) {
        const lawsuitNumber = subsidy.formData?.['Número do Processo']
        let rpaLog
        if(lawsuitNumber) {
            console.log(lawsuitNumber)
            rpaLog = await getRpaLog({ groupId, lawsuitNumber })
        }
        if(rpaLog?.formData?.['OUTRAS PARTES']) {
            console.log('TEM UM RPA LOG')
            tableResult.push({
                "Número do Processo":lawsuitNumber,
                "ID do subisídio":subsidy.primaryKey,
                "ID do RPA":rpaLog.rpaId,
                "Valor de Outras Partes":rpaLog.formData?.['OUTRAS PARTES'],
            })
        }
        if(tableResult.length >= 10) {
            break
        }
    }

    console.table(tableResult)
}

export default subsidiesRpaSearch