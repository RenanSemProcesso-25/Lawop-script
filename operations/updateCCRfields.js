import { logInfo, logSuccess, logError, logWarning } from '../utils/logs.js'
import { getRpaFields, deleteRpaFields, createRpaField } from '../services/rpaFields.service.js'
import { createKeyByLabel, createLabelByKey } from '../utils/normalize.js'
import { readFile } from 'fs/promises'
import { ObjectId } from 'mongodb'
import { join } from 'path'
import * as XLSX from 'xlsx'
import _ from 'lodash'

function conditionsOverlap(fieldA, fieldB) {
  for (const attA of fieldA.attached) {
    const attB = fieldB.attached.find(a => a.key === attA.key);

    // Se ambos têm mesma key e valores intersectam → overlap
    if (attB) {
      const intersec = attA.values.some(v => attB.values.includes(v));
      if (!intersec) return false;
    }
    else {
      // Se fieldB não possui essa chave, então ele é mais genérico,
      // logo existe possibilidade de overlap
      continue;
    }
  }
  return true;
}

function validateFieldCombination(field, fieldsList) {
  for (const existing of fieldsList) {
    // só compara campos com mesma key
    if (existing.key !== field.key) continue;

    // se possuem as mesmas opções
    const sameOptions = JSON.stringify(existing.options) === JSON.stringify(field.options);

    if (sameOptions && conditionsOverlap(existing, field)) {
      // mesclar conditions (attached)
      for (const att of field.attached) {
        const target = existing.attached.find(a => a.key === att.key);
        if (target) {
          target.values = [...new Set([...target.values, ...att.values])];
        } else {
          existing.attached.push(att);
        }
      }
      return fieldsList;
    }
  }

  // caso não tenha overlap, adiciona como novo campo
  fieldsList.push(field);
  return fieldsList;
}

// function validateFieldCombination(field, fieldsList) {
//   if(field.attached.find(a => a.values.includes('Ação de Cobrança'))) console.log(field.attached)
//   const existingEqualOptions = fieldsList.find(f => f.key === field.key && f.options.length === field.options.length && f.options.every(o => field.options.some(fo => fo.value === o.value)))
//   if(existingEqualOptions) {
//     console.log([...new Set([...existingEqualOptions.attached, ...field.attached])])
//     for(const att of field.attached) {
//       const target = existingEqualOptions.attached.find(a => a.key === att.key);
//       if (target) {
//         target.values = [...new Set([...target.values, ...att.values])];
//       } else {
//         existingEqualOptions.attached.push(att);
//       }
//     }
//     return fieldsList
//   }
//   else {
//     fieldsList.push(field)
//     return fieldsList
//   }
// }

const groupId = process.env.CCR_GROUP_ID

async function getDistrictDependences(orderBase) {

  const filePath = join(process.cwd(), 'documents', 'comarca-dependences.json')
  const buffer = await readFile(filePath, 'utf-8')
  const orgaoOptions = JSON.parse(buffer)

  const deleatedFieldsCount = await deleteRpaFields({ groupId, key: { $in: ['COMARCA', 'JUIZOS', 'FOROS', 'JUIZO', 'FORO'] } })
  logInfo(`${deleatedFieldsCount} campos deletados para o Fluxo de comarca, juizos e foros.`)

  let fieldsList = []
  for (const [orgaoOption, ufOptions] of Object.entries(orgaoOptions)) {
    for (const [ufOption, comarcaOptions] of Object.entries(ufOptions)) {
      if (!comarcaOptions || Object.keys(comarcaOptions).length === 0) continue
      const comarcaField = {
        key: 'COMARCA',
        label: 'Comarca',
        type: 'select',
        required: true,
        options: Object.keys(comarcaOptions).map(key => ({ label: key, value: key })),
        group: 'CCR',
        groupId: groupId,
        order: orderBase + 1,
        attached: [{
          key: 'ORGAO',
          values: [orgaoOption]
        }, {
          key: 'UF',
          values: [ufOption]
        }]
      }
      fieldsList = validateFieldCombination(comarcaField, fieldsList)

      for (const [comarcaOption, fields] of Object.entries(comarcaOptions)) {
        for (const [fieldKey, fieldOptions] of Object.entries(fields)) {
          if (!fieldOptions || fieldOptions.length === 0) continue
          const newField = {
            key: fieldKey,
            label: createLabelByKey(fieldKey),
            type: 'select',
            required: true,
            options: fieldOptions.map(o => ({ label: o.text, value: o.text })),
            group: 'CCR',
            groupId: groupId,
            order: orderBase + 2,
            attached: [
              {
                key: 'ORGAO',
                values: [orgaoOption]
              }, {
                key: 'UF',
                values: [ufOption]
              },
              {
                key: 'COMARCA',
                values: [comarcaOption]
              }]
          }
          fieldsList = validateFieldCombination(newField, fieldsList)
        }
      }
    }
  }

  for (const field of fieldsList) {
    await createRpaField(field)
    logSuccess(`Created RpaField ${field.key}`)
  }
}

async function getCategoryDependences(orderBase) {

  const filePath = join(process.cwd(), 'documents', 'categoria-tipo-assunto.json')
  const buffer = await readFile(filePath, 'utf-8')
  const categoryOptions = JSON.parse(buffer)

  const deleatedFieldsCount = await deleteRpaFields({ groupId, key: { $in: ['TIPO', 'ASSUNTO'] } })
  logInfo(`${deleatedFieldsCount} campos deletados para o Fluxo de tipo e assunto.`)

  let fieldsList = []

  for (const [categoryOption, localityOptions] of Object.entries(categoryOptions)) {
    if (!localityOptions || Object.keys(localityOptions).length === 0) continue
    const localityField = {
      key: 'TIPO',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: Object.keys(localityOptions).map(key => ({ label: key, value: key })),
      group: 'CCR',
      groupId: groupId,
      order: orderBase + 2,
      attached: [{
        key: 'CATEGORIA',
        values: [categoryOption]
      }]
    }
    fieldsList = validateFieldCombination(localityField, fieldsList)
    for (const [localotyOption, subjectsOptions] of Object.entries(localityOptions)) {
      if (!subjectsOptions || subjectsOptions.length === 0) continue
      const subjectField = {
        key: 'ASSUNTO',
        label: 'Assunto',
        type: 'select',
        required: true,
        options: subjectsOptions.map(subject => ({ label: subject.text, value: subject.text })),
        group: 'CCR',
        groupId: groupId,
        order: orderBase + 3,
        attached: [{
          key: 'CATEGORIA',
          values: [categoryOption]
        }, {
          key: 'TIPO',
          values: [localotyOption]
        }]
      }
      fieldsList = validateFieldCombination(subjectField, fieldsList)
    }
  }

  for (const field of fieldsList) {
    await createRpaField(field)
    logSuccess(`Created RpaField ${field.key}`)
  }
}

async function getLocalityDependences(orderBase) {
  const filePath = join(process.cwd(), 'documents', 'categoria-localidade.json')
  const buffer = await readFile(filePath, 'utf-8')
  const categoryOptions = JSON.parse(buffer)

  const deleatedFieldsCount = await deleteRpaFields({ groupId, key: { $in: ['LOCALIDADE'] } })
  logInfo(`${deleatedFieldsCount} campos deletados para o Fluxo de localidade.`)

  let fieldsList = []
  for (const [categoryOption, localityOptions] of Object.entries(categoryOptions)) {
    if (!localityOptions || localityOptions.length === 0) continue
    const localityField = {
      key: 'LOCALIDADE',
      label: 'Localidade',
      type: 'select',
      required: true,
      options: localityOptions.map(i => ({ label: i.text, value: i.text })),
      group: 'CCR',
      groupId: groupId,
      order: orderBase + 1,
      attached: [{
        key: 'CATEGORIA',
        values: [categoryOption]
      }]
    }
    fieldsList = validateFieldCombination(localityField, fieldsList)
  }
  for (const field of fieldsList) {
    await createRpaField(field)
    logSuccess(`Created RpaField ${field.key}`)
  }
}

async function getPlatformDependences(orderBase, totalDealershipOptions) {

  const filePath = join(process.cwd(), 'documents', 'concessionaria-plataforma.json')
  const buffer = await readFile(filePath, 'utf-8')
  const dealershipOptions = JSON.parse(buffer)

  const deleatedFieldsCount = await deleteRpaFields({ groupId, key: { $in: ['PLATAFORMA'] } })
  logInfo(`${deleatedFieldsCount} campos deletados para o Fluxo de tipo e assunto.`)

  let fieldsList = []
  let findedDealershipOptions = []
  for (const [dealershipOption, platformOptions] of Object.entries(dealershipOptions)) {
    if (!platformOptions || platformOptions.length === 0) { console.log(`No platforms found for dealership ${dealershipOption}`); continue }
    findedDealershipOptions.push({ label: dealershipOption, value: dealershipOption })
    const platformField = {
      key: 'PLATAFORMA',
      label: 'Plataforma',
      type: 'select',
      required: true,
      options: platformOptions.map(platform => ({ label: platform.text, value: platform.text })),
      group: 'CCR',
      groupId: groupId,
      order: orderBase + 1,
      attached: [{
        key: 'CONCESSIONARIA',
        values: [dealershipOption]
      }]
    }
    fieldsList = validateFieldCombination(platformField, fieldsList)
  }
  const notFoundDealershipOptions = totalDealershipOptions.filter(option => !findedDealershipOptions.some(f => f.value === option.value))
  const otherCasesPlatformField = {
    key: 'PLATAFORMA',
    label: 'Plataforma',
    type: 'select',
    required: true,
    options: [{ label: 'Outros', value: 'Outros' }],
    group: 'CCR',
    groupId: groupId,
    order: orderBase + 1,
    attached: [{
      key: 'CONCESSIONARIA',
      values: notFoundDealershipOptions.map(o => o.value)
    }]
  }
  fieldsList.push(otherCasesPlatformField)
  for (const field of fieldsList) {
    await createRpaField(field)
    logSuccess(`Created RpaField ${field.key}`)
  }
  return fieldsList
}

async function getRpaFieldsByDocument() {

  const filePath = join(process.cwd(), 'documents', 'ccr-rpa-fields.xlsx')
  const buffer = await readFile(filePath)


  const workbook = XLSX.read(buffer, { type: 'buffer' })

  // Read "Campos" sheet
  const fieldsSheet = workbook.Sheets['Campos']
  if (!fieldsSheet) throw new Error('Sheet "Campos" not found')
  const fieldsData = XLSX.utils.sheet_to_json(fieldsSheet)

  // Read "Opções" sheet
  const optionsSheet = workbook.Sheets['Opções']
  const optionsData = optionsSheet ? XLSX.utils.sheet_to_json(optionsSheet, { defval: undefined }) : []

  // Read "Dependencias" sheet
  const depsSheet = workbook.Sheets['Dependencias']
  const depsData = depsSheet ? XLSX.utils.sheet_to_json(depsSheet, { defval: undefined }) : []

  // Build options map: key is label (or parentLabel.subLabel), value is array of options
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

  // Build dependencies map: key is fieldKey, value is array of dependency objects
  const depsMap = {}
  depsData.forEach(row => {
    if (!row.fieldKey || !row.attachedKey || !row.values) return
    const attKey = row.attachedKey.split('.').pop()
    const dep = {
      _id: new ObjectId(),
      key: attKey,
      type: row.type,
      values: String(row.values).split(',').map(v => v.trim()),
      hasValue: row.hasValue || null
    }
    if (!depsMap[row.fieldKey + ' - ' + row.type]) depsMap[row.fieldKey + ' - ' + row.type] = []
    if (depsMap[row.fieldKey + ' - ' + row.type].some(d => d.key === dep.key)) {
      depsMap[row.fieldKey + ' - ' + row.type].find(d => d.key === dep.key).values.push(...dep.values)
    }
    else { depsMap[row.fieldKey + ' - ' + row.type].push(dep) }
  })

  // Separate root fields and subFields based on fieldParent
  const rootFields = []
  const subFieldsMap = {} // key: parentLabel, value: array of subField rows

  fieldsData.forEach(row => {
    if (Boolean(row.render) === false) return
    if (row.fieldParent) {
      // It's a subField
      if (!subFieldsMap[row.fieldParent]) subFieldsMap[row.fieldParent] = []
      subFieldsMap[row.fieldParent].push(row)
    } else {
      // It's a root field
      rootFields.push(row)
    }
  })

  // Process root fields
  const fields = rootFields.map((row, index) => {

    const fieldKey = createKeyByLabel(row.label)

    let field = {
      order: index * 5,
      key: fieldKey,
      lawsuitNumber: row.type === "lawsuitnumber",
      label: row.label,
      type: row.type,
      required: Boolean(row.required),
      group: 'CCR',
      groupId: groupId,
      mask: row.mask || undefined,
      placeholder: row.placeholder || undefined,
      defaultValue: row.defaultValue || undefined,
      attached: depsMap[fieldKey + ' - ' + row.type] || [],
      isMultipleField: row.type === 'fieldarray' && Boolean(row.isMultipleField),
      options: [],
      subFields: row.type === 'fieldarray' ? [] : null,
      disabled: Boolean(row.disabled) || false
    }

    if(field.label === 'Adverso já cadastrado?'){
      console.log(field)
    }

    // Attach options if exists
    if (optionsMap[row.label] && row.type === 'select') {
      field.options = optionsMap[row.label]
    }

    // Attach subFields if any
    if (subFieldsMap[row.label]) {
      field.subFields = subFieldsMap[row.label].map(subRow => {
        const subFieldKey = createKeyByLabel(subRow.label)
        const fullKey = `${field.key}.${subFieldKey}`

        const subField = {
          key: subFieldKey,
          label: subRow.label,
          type: subRow.type || 'text',
          required: Boolean(subRow.required),
          mask: subRow.mask || undefined,
          placeholder: subRow.placeholder || undefined,
          defaultValue: subRow.defaultValue || undefined,
          options: optionsMap[`${subRow.fieldParent}.${subRow.label}`] || [],
          attached: depsMap[fullKey + ' - ' + subRow.type] || [],
          disabled: Boolean(subRow.disabled) || false
        }
        if (optionsMap[subRow.label] && subRow.type === 'select') {
          subField.options = optionsMap[subRow.label]
        }
        return subField
      })
    }

    // // Handle subFields for fieldArray (legacy support)
    // if (row.type === 'fieldarray') {
    //   const prefix = row.label + '.'
    //   const subFieldLabels = new Set()
    //   Object.keys(optionsMap).forEach(k => {
    //     if (k.startsWith(prefix)) {
    //       subFieldLabels.add(k)
    //     }
    //   })
    //   const legacySubFields = Array.from(subFieldLabels).map(subKey => {
    //     const subLabel = subKey.slice(prefix.length)
    //     const subFieldKey = createKeyByLabel(subLabel)
    //     const fullKey = `${field.key}.${subFieldKey}`
    //     return {
    //       key: subFieldKey,
    //       label: subLabel,
    //       type: 'text',
    //       required: false,
    //       options: optionsMap[subKey] || undefined,
    //       attached: depsMap[fullKey] || undefined,
    //     }
    //   })
    //   // Merge legacy subFields with fieldParent-based ones
    //   if (legacySubFields.length > 0) {
    //     field.subFields = (field.subFields || []).concat(legacySubFields)
    //   }
    // }

    return field
  })

  const deletedFieldsCount = await deleteRpaFields({ groupId, key: { $in: fields.map(f => f.key) } })
  logInfo(`${deletedFieldsCount} campos deletados`)
  for (const field of fields) {
    await createRpaField(field)
    logSuccess(`Campo ${field.key} criado`)
  }
  return fields
}

async function updateCCRfields() {
  try {
    if (!groupId) {
      throw new Error('GROUP_ID not found in environment variables')
    }
    // logInfo(`Updating RpaFields for group ${groupId}`)
    // const deletedCount = await deleteRpaFields({ groupId })
    // logInfo(`Deleted ${deletedCount} RpaFields for group ${groupId}`)

    const ccrFields = await getRpaFieldsByDocument()
    const ufOrder = ccrFields.find(f => f.key === 'UF').order
    const categoryOrder = ccrFields.find(f => f.key === 'CATEGORIA').order
    const dealership = ccrFields.find(f => f.key === 'CONCESSIONARIA')
    const dealershipOrder = dealership.order
    // const DistrictDependencesCount = await getDistrictDependences(ufOrder)
    // const categoryDependencesCount = await getCategoryDependences(categoryOrder)
    // const localityDependencesCount = await getLocalityDependences(categoryOrder)
    // const platformDependencesCount = await getPlatformDependences(dealershipOrder, dealership.options)

  } catch (error) {
    logError(error)
  }
}

export default updateCCRfields
