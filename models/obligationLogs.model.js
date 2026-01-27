import _ from 'lodash'
import mongoose, { Schema, Types } from 'mongoose'

const obligationLogsSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'groups', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },

    // Obligation data
    primaryKey: { type: String, required: true },
    lawsuitNumber: { type: String, required: true },
    status: { type: String, default: 'draft' },
    form: { type: Object, default: null },
    origin: { type: String, enum: ['user', 'rpa'], default: 'user' },
    priority: { type: Number, enum: [0, 1, 2, 3], default: 3 },
    tags: [{ type: String, default: null }],
    team: { type: String, default: null },

    // Data to/from RPA
    rpa: {
      id: { type: String, default: null },
      flow: { type: String, enum: ['save', 'analysis', 'audit'], default: 'save' },
      form: { type: Object, default: null },
      fieldWithError: { type: String, default: null },
      errorDescription: { type: String, default: null },
      originalData: { type: Object, default: null },
    },

    // User metrics
    userMetrics: {
      duration: { type: String, default: null },
      durationMs: { type: Number, default: 0 },
    },

    // History of events
    history: [
      {
        action: { type: String, required: true },
        description: { type: String, default: null, required: true },
        userSchema: { type: String, enum: ['users', 'groups'], required: true },
        userId: { type: Schema.Types.ObjectId, refPath: 'history.userSchema', required: true },
        toSchema: { type: String, enum: ['users', 'groups'] },
        toId: { type: Schema.Types.ObjectId, refPath: 'history.toSchema' },
        createdAt: { type: Date, default: Date.now, required: true },
      },
    ],

    lawsuitDocuments: { type: Array, default: null },
    isReentry: { type: Boolean, default: false },
  },
  { collection: 'obligationsLogs', timestamps: true }
)

const obligationLogsModel = mongoose.model('obligationsLogs', obligationLogsSchema)

export default obligationLogsModel
