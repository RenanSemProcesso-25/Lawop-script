import mongoose from "mongoose"
import { updateRpaField, getRpaField } from "../services/rpaFields.service.js"
import readTableData from "../utils/readTableData.js"

const LABEL_FIELD_TO_UPDATE = 'Curso do Aluno'
const groupId = process.env.COGNA_GROUP_ID

async function getDataToUpdate() {
   const {Planilha1} = await readTableData({fileName:'Curso_do_Aluno-Elaw.xlsx'})
   return Planilha1.map(r => ({_id: new mongoose.Types.ObjectId(),label: r['Curso do aluno'],value:r['Curso do aluno']}))

}

async function updateRpaFields(){
    try {
        const data = await getDataToUpdate()
        const field = await getRpaField({groupId, label: LABEL_FIELD_TO_UPDATE})
        const updatedField = await updateRpaField({groupId, label:LABEL_FIELD_TO_UPDATE}, {...field,options:data})
        console.log(updatedField.options)

    } catch (error) {
        throw error
    }
}

export default updateRpaFields