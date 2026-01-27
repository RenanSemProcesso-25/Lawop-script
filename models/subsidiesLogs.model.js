import mongoose, { Schema } from 'mongoose'

const subsidiesLogSchema = new Schema(
  {
    // Group data
    groupId: { type: Schema.Types.ObjectId, ref: 'groups', required: true },

    // User data
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: false },

    // Subsidy data
    primaryKey: { type: String, required: true }, // Subsidy identifier

    status: { type: String, required: true },
    statusDescription: { type: String, default: null },

    formRPA: { type: Object, default: null },
    formData: { type: Object, default: null },
    checklists: [
      {
        checklistId: { type: String, required: true },
        status: { type: String, required: true },
        name: { type: String, required: true },
        form: { type: Object, default: null },
      },
    ],

    // Data form RPA
    rpaId: { type: String, default: null },
    rpaFlow: { type: String, default: 'save' },
    fieldWithError: { type: String, default: null },

    // User metrics
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    duration: { type: String, default: null },
    userMetrics: {
      duration: { type: String, default: null },
      durationMs: { type: Number, default: 0 },
    },

    // History of events
    history: [
      {
        action: { type: String, default: null },
        description: { type: String, default: null },
        createdAt: { type: Date, default: null },
        userId: { type: String, default: null },
        userName: { type: String, required: null },
        userEmail: { type: String, required: null },
        host: { type: String, default: null },
      },
    ],

    priority: { type: Number, enum: [0, 1, 2, 3], default: 3 },
    tags: [{ type: String, default: null }],
    team: { type: String, default: null },
    isReentry: { type: Boolean, default: false },
  },
  { collection: 'subsidieslogs', timestamps: true }
)

const subsidiesLogsModel = mongoose.model('subsidieslogs', subsidiesLogSchema)

/**
 * @param {Schema.Types.ObjectId} groupId - The group id
 * @param {string} key - The key name
 * @param {*} value - The value of the key
 * @param {object?} projection
 * @example
 * findByKey("651c84e1c5e3930035d7cd5d", "formData.id_elaw", 111223)
 * @example
 * findByKey("651c84e1c5e3930035d7cd5d", "formData.id_elaw", 111223, { userId: 1, userName: 1 })
 */
async function findByKey(groupId, key, value, projection) {
  try {
    return await subsidiesLogsModel.find({ groupId, [key]: value }, { ...projection })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export { findByKey }
export default subsidiesLogsModel
