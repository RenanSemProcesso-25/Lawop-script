import mongoose, { Schema } from 'mongoose'

const processProgressFieldSchema = new Schema(
  {
    groupId: { type: String, default: null },
    group: { type: String, required: true },

    order: { type: Number, required: true },
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },

    toSubmit: { type: Boolean, default: true }, // if false, the field will not be submitted to the server.
    lawsuitNumber: { type: Boolean, default: false }, // if true, defines the lawsuit number.
    isMultipleField: { type: Boolean, default: true },

    attached: [
      [
        {
          key: { type: String, default: null },
          values: [{ type: String, default: null }],
          hasValue: { type: Boolean, default: null },
        },
      ],
    ],

    tip: {
      title: { type: String, default: null },
      description: { type: String, default: null },
      top: { type: Boolean, default: null }, // if true, the hint will be aligned at the top of the field.
    },

    //Type: "text"
    mask: { type: String, default: null },
    placeholder: { type: String, default: null },

    //Type: "autocomplete"
    autocomplete: {
      path: { type: String, default: null },
      queries: [{ type: String, default: null }],
      assignments: [
        {
          valueOf: { type: String, default: null },
          setKey: { type: String, default: null },
        },
      ],
    },

    // Type: "select"
    options: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],

    // Type: "fieldsarray"
    subFields: [],

    // Type: "file"
    maxFileSize: { type: Number, default: 52428800 },
    multipleFiles: { type: Boolean, default: true },
  },
  { collection: 'processProgressFields', timestamps: true },
)

export default mongoose.model('processProgressFields', processProgressFieldSchema)
