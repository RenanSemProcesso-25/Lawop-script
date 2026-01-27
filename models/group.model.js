import mongoose, { Schema } from 'mongoose'

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
    document: { type: String, required: true },
    features: {
      capture: { type: Boolean, default: false },
      captureToRpa: { type: Boolean, default: false },
      documentManagement: { type: Boolean, default: false },
      doubleAuth: { type: Boolean, default: false },
      monitoring: { type: Boolean, default: false },
      obligation: { type: Boolean, default: false },
      officialLetter: { type: Boolean, default: false },
      rebot: { type: Boolean, default: false },
      rpa: { type: Boolean, default: false },
      sonda: { type: Boolean, default: false },
      subsidies: { type: Boolean, default: false },
      legalNotifications: { type: Boolean, default: false },
      lexxyBpoCapture: { type: Boolean, default: false },
      terms: { type: Boolean, default: false },
    },

    // Lawop Modules
    captureConfig: {
      solucionareId: { type: Number, default: null },
      sqlGroupId: { type: String, default: null },
      statusOnCreate: { type: String, default: 'captured' },
      digestoToken: [{ type: String, default: null }],
    },
    documentManagementConfig: {
      bucketName: { type: String, default: null },
      primaryKey: { type: String, default: null },
      columns: [
        {
          key: { type: String, required: true },
          type: { type: String, default: null },
          title: { type: String, required: true },
          width: { type: String, required: true },
          admin: { type: Boolean, default: false },
        },
      ],
      filters: [
        {
          key: { type: String, required: true },
          type: { type: String, required: true }, // "radio", "checkbox"
          title: { type: String, required: true },
          options: [
            {
              value: { type: String, required: true },
              label: { type: String, required: true },
            },
          ],
        },
      ],
      linearFilters: [
        {
          key: { type: String, required: true },
          title: { type: String, required: true },
          enable: { type: Boolean, default: false },
          icon: { type: String, default: null },
          value: { type: Number, default: null },
        },
      ],
      headerActions: [{ type: String, default: null }],
    },
    legalNotificationsConfig: {
      legalDepartments: [{ type: String, default: null }],
      digestoToken: { type: String, default: null },
    },
    monitoringConfig: {
      bucketName: { type: String, default: null },
      columns: [
        {
          key: { type: String, required: true },
          type: { type: String, default: null },
          title: { type: String, required: true },
          width: { type: String, required: true },
        },
      ],
      filters: [
        {
          key: { type: String, required: true },
          type: { type: String, required: true }, // "radio", "checkbox"
          title: { type: String, required: true },
          options: [
            {
              value: { type: String, required: true },
              label: { type: String, required: true },
            },
          ],
        },
      ],
      linearFilters: [
        {
          key: { type: String, required: true },
          title: { type: String, required: true },
          enable: { type: Boolean, default: false },
          icon: { type: String, default: null },
          value: { type: Number, default: null },
        },
      ],
      headerActions: [{ type: String, default: null }],
    },
    obligationConfig: {
      bucketName: { type: String, default: null },
      primaryKey: { type: String, default: null },
      teams: [{ type: String, default: null }],
      formActions: [
        {
          action: { type: String, default: null },
          title: { type: String, default: null },
          btnVariation: { type: String, enum: ['outlined', 'contained'], default: 'outlined' },
        },
      ],
      listConfig: {
        columns: [
          {
            key: { type: String, required: true },
            type: { type: String, default: null },
            title: { type: String, required: true },
            width: { type: String, required: true },
            admin: { type: Boolean, default: false },
          },
        ],
        filters: [
          {
            key: { type: String, required: true },
            type: { type: String, required: true }, // "radio", "checkbox"
            title: { type: String, required: true },
            options: [
              {
                value: { type: String, required: true },
                label: { type: String, required: true },
              },
            ],
          },
        ],
        linearFilters: [
          {
            key: { type: String, required: true },
            title: { type: String, required: true },
            enable: { type: Boolean, default: false },
          },
        ],
      },
      dictionary: [
        {
          columnName: { type: String, default: null },
          formKey: { type: String, default: null },
          valueExpression: { type: String, default: null },
        },
      ],
    },
    officialLetterConfig: {
      checkboxOptions: [
        {
          model: { type: String, default: null },
          name: { type: String, default: null },
          label: { type: String, default: null },
        },
      ],
      modelOptions: [
        {
          value: { type: String, default: null },
          label: { type: String, default: null },
        },
      ],
      filterOptions: [
        {
          key: { type: String, required: true },
          options: [
            {
              value: { type: String, required: true },
              label: { type: String, required: true },
            },
          ],
          selected: [{ type: String, default: null }],
          title: { type: String, required: true },
          type: { type: String, required: true }, // "radio", "checkbox"
        },
      ],
      primaryKey: { type: String, default: null },
      modelTemplates: [
        {
          model: { type: String, default: null },
          file: { type: String, default: null }, // from assets/templates/...
        },
      ],
    },
    rebotConfig: {
      active: { type: Boolean, default: false },
    },
    reportConfig: {
      bucketName: { type: String, default: 'lawop-report-files' },
    },
    rpaConfig: {
      rpaGroupId: { type: String, default: null },
      bucketName: { type: String, default: null },
      teams: [{ type: String, default: null }],
      dictionary: [
        {
          formKey: { type: String, default: null },
          captureKey: { type: String, default: null },
          type: { type: String, default: 'text' },
        },
      ],
      columns: [
        {
          key: { type: String, required: true },
          type: { type: String, default: null },
          title: { type: String, required: true },
          width: { type: String, required: true },
          admin: { type: Boolean, default: false },
        },
      ],
      filters: [
        {
          key: { type: String, required: true },
          type: { type: String, required: true }, // "radio", "checkbox"
          title: { type: String, required: true },
          options: [
            {
              value: { type: String, required: true },
              label: { type: String, required: true },
            },
          ],
        },
      ],
      linearFilters: [
        {
          key: { type: String, required: true },
          title: { type: String, required: true },
          enable: { type: Boolean, default: false },
          icon: { type: String, default: null },
          value: { type: Number, default: null },
        },
      ],
      headerActions: [{ type: String, default: null }],
      rpaUrl: { type: String, default: null },
    },
    sondaConfig: {
      accuracyBreakPoint: { type: Number, default: 95 },
      keys: { type: Object, default: null },
      sondaSources: [{ type: String, default: null }],
    },
    subsidiesConfig: {
      bucketName: { type: String, default: null },
      primaryKey: { type: String, default: null },
      teams: [{ type: String, default: null }],
      formActions: [
        {
          action: { type: String, default: null },
          title: { type: String, default: null },
          btnVariation: { type: String, default: null },
        },
      ],
      checklist: {
        enableExpression: { type: String, default: null },
        checklistInitialNameExpression: { type: String, default: null },
        pdfTemplate: { type: String, default: null },
        names: [{ type: String, default: null }],
      },
      columns: [
        {
          key: { type: String, required: true },
          type: { type: String, default: null },
          title: { type: String, required: true },
          width: { type: String, required: true },
          admin: { type: Boolean, default: false },
          sort: { type: Boolean, default: false },
        },
      ],
      filters: [
        {
          key: { type: String, required: true },
          type: { type: String, required: true }, // "radio", "checkbox", "date"
          title: { type: String, required: true },
          options: [
            {
              value: { type: Schema.Types.Mixed, required: true },
              label: { type: String, required: true },
            },
          ],
        },
      ],
      linearFilters: [
        {
          key: { type: String, required: true },
          title: { type: String, required: true },
          enable: { type: Boolean, default: false },
          icon: { type: String, default: null },
          value: { type: Number, default: null },
        },
      ],
      headerActions: [{ type: String, default: null }],
      importRules: {
        initialValidation: {
          params: [{ type: String, default: null }],
          expression: { type: String, default: null },
        },
        statusDictionary: {
          params: [{ type: String, default: null }],
          expression: { type: String, default: null },
        },
        userSegmentation: {
          params: [{ type: String, default: null }],
          expression: { type: String, default: null },
        },
        userList: { type: Object, default: null },
      },
      dictionary: [
        {
          columnName: { type: String, default: null },
          formKey: { type: String, default: null },
          valueExpression: { type: String, default: null },
        },
      ],
      dashboard: {
        teamFilters: [{ type: Object, default: null }],
        priorityFilters: [{ type: Object, default: null }],
        teamList: [{ type: String, default: null }],
        teamColorDictionary: { type: Object, default: null },
        priorityColorDictionary: { type: Object, default: null },
        dailyPerformancePriorityLegend: [{ type: Object, default: null }],
        priorityList: [{ type: String, default: null }],
      },
    },
    ticketConfig: {
      status: [
        {
          key: { type: String, default: null },
          name: { type: String, default: null },
          color: { type: String, default: null },
          type: { type: String, enum: ['pending', 'doing', 'done', 'archived'], default: null },
        },
      ],
    },

    credentials: {
      google: { type: Object, default: null },
      consumidorGov: {
        clientId: { type: String, default: null },
        clientSecret: { type: String, default: null },
        code: { type: String, default: null },
        userDocument: { type: String, default: null },
      },
    },
    webhook: [
      {
        name: { type: String, default: null },
        token: { type: String, default: null },
      },
    ],
    logoUrl: { type: String, default: null },
    active: { type: Number, enum: [0, 1], default: 1 },
    autoCreateRpa: { type: Boolean, default: false },
  },
  { collection: 'groups', timestamps: true }
)

export default mongoose.model('groups', groupSchema)
