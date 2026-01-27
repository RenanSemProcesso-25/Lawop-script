import {findGroup, updateGroup} from '../services/groups.service.js'
import { logError, logInfo, logSuccess } from '../utils/logs.js'
import { ObjectId } from 'bson'

async function updateGroupsColumns() {
    try {
        const group = await findGroup({_id: new ObjectId('609c0bb765e7b8491b3716fa') })
        console.log(group.subsidiesConfig.columns)
        logSuccess(`Successfully found group ${group.name}`)

        await updateGroup({_id: group._id}, {
            $set: {
                columns: [...group.columns, {
                    title: 'Tempo médio',
                    width: '100px',
                    key: 'formData.Data Registrado da tarefa',
                    type: 'text'
                }]
            }
        })
        logSuccess(`Successfully updated group ${group.name}`)
    } catch (error) {
        logError(error.message)
    }
}

export default updateGroupsColumns