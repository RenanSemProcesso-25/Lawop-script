import  RpaFieldModel  from '../models/rpaFields.model.js'
import { logError, logWarning } from '../utils/logs.js'



export async function createRpaField(rpaField) {
  try {
    const createdRpaField = await RpaFieldModel.create(rpaField)
    if(!createdRpaField) {
        throw new Error('No RpaField created')
    }
    return createdRpaField
  } catch (error) {
    logError(error)
    throw error
  }
}

export async function getRpaFields(where = {}) {
  try {
    const rpaFields = await RpaFieldModel.find(where)
    if(rpaFields.length === 0) {
        throw new Error('No RpaFields found')
    }
    return rpaFields
  } catch (error) {
    logError(error)
    throw error
  }
}

export async function getRpaField(where) {
    try {
        const rpaField = await RpaFieldModel.findOne(where)
        if(!rpaField) {
            throw new Error('No RpaField found')
        }
        return rpaField
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function updateRpaFields(where,params) {
    try {
        const updatedRpaFields = await RpaFieldModel.updateMany(where, params, { new: true })
        if(updatedRpaFields.modifiedCount === 0) {
            throw new Error('No RpaFields found to update')
        }
        return updatedRpaFields
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function updateRpaField(where, rpaField) {
    try {
        const updatedRpaField = await RpaFieldModel.findOneAndUpdate(where, rpaField, { new: true })
        if(!updatedRpaField) {
            throw new Error('No RpaField found to update')
        }
        return updatedRpaField
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function deleteRpaFields(where) {
    try {
        const deletedRpaFields = await RpaFieldModel.deleteMany(where)
        if(deletedRpaFields.deletedCount === 0) {
            logWarning('No RpaFields found to delete')
        }
        return deletedRpaFields.deletedCount
    } catch (error) {
        logError(error)
        throw error
    }
}

export async function deleteRpaField(where) {
    try {
        const deletedRpaField = await RpaFieldModel.findOneAndDelete(where)
        if(!deletedRpaField) {
            throw new Error('No RpaField found to delete')
        }
        return deletedRpaField
    } catch (error) {
        logError(error)
        throw error
    }
}