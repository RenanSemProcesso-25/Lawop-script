import { readFile } from 'fs/promises'
import { ObjectId } from 'mongodb'
import { join } from 'path'
import * as XLSX from 'xlsx'
import _ from 'lodash'

export default async function readTableData({folder = 'documents', fileName =''}){
    const filePath = join(process.cwd(), folder, fileName)
    const buffer = await readFile(filePath)
    
    
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    
    const response = {}

    for(const [key,value] of Object.entries(workbook.Sheets)) {
        response[key] = XLSX.utils.sheet_to_json(value)
    }

    return response
}