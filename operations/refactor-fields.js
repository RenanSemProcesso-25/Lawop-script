import { getRpaFields, deleteRpaFields } from "../services/rpaFields.service.js";

async function refactorFields() {
    const groupId = process.env.GROUP_ID
    const fields = await deleteRpaFields({ groupId, key: { $in: ["ASSUNTO", "LOCALIDADE"] } });
   

    
    console.log(fields)
}

export default refactorFields