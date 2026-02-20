import { logError } from "../utils/logs.js";
import { getProcessProgressFields, createProcessProgressField, deleteProcessProgressField, deleteProcessProgressFields, getProcessProgressField, updateProcessProgressField } from "../services/processsProgressFields.service.js";
import readTableData from "../utils/readTableData.js";
import mongoose from "mongoose";
import { createKeyByLabelSimplefied } from "../utils/normalize.js";

const groupId = process.env.COGNA_GROUP_ID

function formattOptions(optionsData) {
    const optionsMap = {}
    optionsData.forEach(row => {
    Object.entries(row).forEach(([colName, value]) => {
        if (value === undefined || value === null || String(value).trim() === '') return
        const key = colName.trim()
        const strValue = String(value).trim()
        if (!optionsMap[key]) optionsMap[key] = []
        if (!optionsMap[key].some(o => o.value === strValue)) optionsMap[key].push({ label: strValue, value: strValue })
        })
    })
    return optionsMap
}

function formattAttacheds(attachedsData) {
    const depsMap = {}
    attachedsData.forEach(row => {
    if (!row.fieldKey || !row.attachedKey || !row.values) return
    const attKey = row.attachedKey.split('.').pop()
    const dep = {
        _id: new mongoose.Types.ObjectId(),
        key: attKey,
        values: String(row.values).split(',').map(v => v.trim()),
        hasValue: row.hasValue || null
    }
    if (!depsMap[row.fieldKey]) depsMap[row.fieldKey] = []
    if (depsMap[row.fieldKey].some(d => d.key === dep.key)) {
        depsMap[row.fieldKey].find(d => d.key === dep.key).values.push(...dep.values)
    }
    else { depsMap[row.fieldKey].push(dep) }
    })
    return depsMap
}

async function formattFields() {

    const { fields, options, attacheds } = await readTableData({ fileName: 'cogna-process-progress-fields.xlsx' })

    const optionsMap = formattOptions(options)
    const attachedsMap = formattAttacheds(attacheds)

    const rootFields = fields
      .filter(row => !row.fieldParent)
      .map((row, index) => {
        const key = createKeyByLabelSimplefied(row.label)
        return {
          groupId,
          group: 'COGNA',
          order: index,
          key,
          label: row.label,
          type: row.type,
          required: Boolean(row.required),
          toSubmit: row.toSubmit === undefined ? true : Boolean(row.toSubmit),
          lawsuitNumber: row.type === 'lawsuitnumber',
          isMultipleField: row.isMultipleField === undefined ? true : Boolean(row.isMultipleField),
          mask: row.mask || null,
          placeholder: row.placeholder || null,
          options: optionsMap[row.label] || [],
          attached: attachedsMap[key] || [],
          hasAiSearch: row.hasAiSearch || false,
        }
      })

    const subFields = fields
      .filter(row => row.fieldParent)
      .map((row, index) => {
        const parentKey = createKeyByLabelSimplefied(row.fieldParent)
        const key = createKeyByLabelSimplefied(row.label)
        return {
          key,
          label: row.label,
          type: row.type,
          required: Boolean(row.required),
          order: index,
          options: optionsMap[`${row.fieldParent}.${row.label}`] || [],
          attached: attachedsMap[`${parentKey}.${key}`] || [],
          fieldParent: parentKey,
          hasAiSearch: row.hasAiSearch,
        }
      })

    const parentToSubs = subFields.reduce((acc, sf) => {
      if (!acc[sf.fieldParent]) acc[sf.fieldParent] = []
      acc[sf.fieldParent].push(sf)
      return acc
    }, {})

    const data = rootFields.map(f => ({
      ...f,
      subFields: parentToSubs[f.key] || []
    }))

    return data
}

async function createProgressProgressFields() {
    try {
        // await deleteProcessProgressFields({groupId})
        const fieldsData = await formattFields()

        const currentFormFields = await getProcessProgressFields({groupId})

        for(const field of currentFormFields) {
          const isFieldInNewData = fieldsData.some(f => f.key === field.key)
          if(!isFieldInNewData) {
            await deleteProcessProgressField({groupId, key: field.key})
          }
        }
        
        for(const field of fieldsData) {
            const findedField = currentFormFields.find(f => f.key === field.key)
            if(findedField) {
              console.log('Atualizando campo ',field.label)
              await updateProcessProgressField({groupId,key:field.key}, field)
            }
            else{
              console.log('Criando campo ', field.label)
              await createProcessProgressField(field)
            }
        }

    } catch (error) {
        logError(error)
        throw error
    }
}

export default createProgressProgressFields
