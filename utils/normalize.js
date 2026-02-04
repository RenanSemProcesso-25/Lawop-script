export function createKeyByLabel(label) {
  if (!label) return ''
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .toUpperCase()
}

export function createLabelByKey(key) {
  return key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase())
}

export function createKeyByLabelSimplefied(label) {
  if (!label) return ''
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)    
    .filter((word) => word.length !== 2)
    .join('_')
    .toUpperCase()
}