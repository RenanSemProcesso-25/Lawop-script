import  ProcessProgressFieldModel  from '../models/processProgressField.model.js'
import { logError, logWarning } from '../utils/logs.js'



export async function createProcessProgressField(processProgressField) {
  try {
    const createdProcessProgressField = await ProcessProgressFieldModel.create(processProgressField)
    if(!createdProcessProgressField) {
        throw new Error('No ProcessProgressField created')
    }
    return createdProcessProgressField
  } catch (error) {
    logError(error)
    throw error
  }
}

export async function getProcessProgressFields(where = {}) {
  try {
    const processProgressFields = await ProcessProgressFieldModel.find(where)
    if(processProgressFields.length === 0) {
        throw new Error('No ProcessProgressFields found')
    }
    return processProgressFields
  } catch (error) {
    logError(error)
    throw error
  }
}

export async function getProcessProgressField(where) {
    try {
        const processProgressField = await ProcessProgressFieldModel.findOne(where)
        if(!processProgressField) {
            throw new Error('No ProcessProgressField found')
        }
        return processProgressField
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function updateProcessProgressFields(where,params) {
    try {
        const updatedProcessProgressFields = await ProcessProgressFieldModel.updateMany(where, params, { new: true })
        if(updatedProcessProgressFields.modifiedCount === 0) {
            throw new Error('No ProcessProgressFields found to update')
        }
        return updatedProcessProgressFields
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function updateProcessProgressField(where, processProgressField) {
    try {
        const updatedProcessProgressField = await ProcessProgressFieldModel.findOneAndUpdate(where, processProgressField, { new: true })
        if(!updatedProcessProgressField) {
            throw new Error('No ProcessProgressField found to update')
        }
        return updatedProcessProgressField
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function deleteProcessProgressFields(where) {
    try {
        const deletedProcessProgressFields = await ProcessProgressFieldModel.deleteMany(where)
        if(deletedProcessProgressFields.deletedCount === 0) {
            logWarning('No ProcessProgressFields found to delete')
        }
        return deletedProcessProgressFields.deletedCount
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function deleteProcessProgressField(where) {
    try {
        const deletedProcessProgressField = await ProcessProgressFieldModel.findOneAndDelete(where)
        if(!deletedProcessProgressField) {
            throw new Error('No ProcessProgressField found to delete')
        }
        return deletedProcessProgressField
    } catch (error) {
        logError(error)
        throw error
    }
}