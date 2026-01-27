import mongoose, { Schema } from 'mongoose'

const rpaLogSchema = new Schema(
  {
    // Group data
    group: { type: String, required: true },
    groupId: { type: String, default: null },

    // User data
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },

    // Lawsuit data
    lawsuitNumber: { type: String, required: true }, // Lawsuit identifier

    form: { type: Object, default: null },
    formData: { type: Object, required: true },

    ai: {
      data: { type: Object, default: null },
      usage: {
        prompt_tokens: { type: Number, default: 0 },
        completion_tokens: { type: Number, default: 0 },
        total_tokens: { type: Number, default: 0 },
      },
      model: { type: String, default: null },
      assistantId: { type: String, default: null },
      reasoning_effort: { type: String, default: null },
      temperature: { type: String, default: null },
      topP: { type: String, default: null },
    },

    status: { type: String, required: true },
    statusDescription: { type: String, default: null },

    // Data form RPA
    rpaId: { type: String, default: null },
    fieldWithError: { type: String, default: null },
    otherInfos: { type: Object, default: null },

    // User metrics
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: String, required: true },
    userMetrics: {
      duration: { type: String, default: null },
      durationMs: { type: Number, default: 0 },
    },

    // History of events
    history: [
      {
        action: { type: String, default: null },
        dateTime: { type: Date, default: null },
        userId: { type: String, default: null },
        userName: { type: String, default: null },
        userEmail: { type: String, default: null },
        host: { type: String, default: null },
      },
    ],

    priority: { type: Number, enum: [0, 1, 2, 3], default: 3 },
    tags: [{ type: String, default: null }],
    team: { type: String, default: null },
    isImported: { type: Boolean, default: false },
  },
  { collection: 'rpalogs', timestamps: true }
)

export default mongoose.model('rpaLogs', rpaLogSchema)
