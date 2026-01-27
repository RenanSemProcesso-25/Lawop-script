import groupModel from "../models/group.model.js";
import { logError, logInfo, logSuccess, logWarning } from "../utils/logs.js";

export async function createGroup(group) {
    try {
        const createdGroup = await groupModel.create(group)
        return createdGroup
    } catch (error) {
        throw error
    }
}

export async function listGroups(where) {
    try {
        const groups = await groupModel.find(where)
        if(groups.length === 0) {
            logWarning('No groups found')
        }
        return groups
    } catch (error) {
        throw error
    }
}

export async function findGroup(where) {
    try {
        const group = await groupModel.findOne(where)
        if(!group) {
            throw new Error('Group not found')
        }
        return group
    } catch (error) {
        throw error
    }
}

export async function updateGroup(where, data) {
    try {
        const updatedGroup = await groupModel.updateOne(where, data)
        if(updatedGroup.modifiedCount === 0) {
            logWarning('No groups updated')
        } else {
            logSuccess(`Successfully updated ${updatedGroup.modifiedCount} groups`)
        }
        return updatedGroup
    } catch (error) {
        throw error
    }
}

export async function updateGroups(where, data) {
    try {
        const updatedGroup = await groupModel.updateMany(where, data)
        if(updatedGroup.modifiedCount === 0) {
            logWarning('No groups updated')
        } else {
            logSuccess(`Successfully updated ${updatedGroup.modifiedCount} groups`)
        }
        return updatedGroup
    } catch (error) {
        throw error
    }
}
