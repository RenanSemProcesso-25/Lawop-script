import { findGroup } from '../services/groups.service.js'
import { logError, logInfo, logSuccess } from '../utils/logs.js'
import { ObjectId } from 'bson'
import axios from 'axios'

const groupId = process.env.BOSCH_GROUP_ID
const DIGESTO_TERMS_URL = 'https://op.digesto.com.br/api/monitoramento/monitored_person'

async function getTermsToUpdate(token, page = 1) {
    try {
        const DIGESTO_TERMS_CONFIG = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
        }

        const {data: terms} = await axios.get(`${DIGESTO_TERMS_URL}?page=${page}&per_page=2048`, DIGESTO_TERMS_CONFIG)
        return terms

    } catch (error) {
        throw error
    }
}

async function updateTerm(term, token) {
    try {
        const DIGESTO_TERMS_CONFIG = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            }
        }

        const termId = term.$uri.split('/').pop()
        const body = {
            "is_active": true
        }
        await axios.patch(`${DIGESTO_TERMS_URL}/${termId}`, body, DIGESTO_TERMS_CONFIG)
        logSuccess(`Successfully updated term ${term.nome}`)
    } catch (error) {
        logError(error.message)
    }
}


async function updateTerms() {
    try {
        const groupData = await findGroup({_id: new ObjectId(groupId)})
    
        const digestoToken = groupData?.captureConfig?.digestoToken[0]
        if(!digestoToken) {
            throw new Error('Digesto token not found')
        }

        const terms = await getTermsToUpdate(digestoToken)
        let updatatedTermsCount = 0
        for(const term of terms) {
            await updateTerm(term, digestoToken)
            updatatedTermsCount++
        }
        console.log(`Successfully updated ${updatatedTermsCount} terms`)
    } catch (error) {
        logError(error.message)
    }
}

export default updateTerms
