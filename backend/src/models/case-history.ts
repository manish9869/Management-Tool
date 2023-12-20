import * as mongoose from "mongoose";
const { Schema } = mongoose;

const CaseHistorySchema = new Schema(
  {
    case_id: {
      type: Number,
      unique: true,
    },
    customer_id: {
      type: Number,
      required: true,
    },
    case_date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    condition_ids: [
      {
        type: Number,
        ref: "MedicalCondition", // Reference to the MedicalCondition model
      },
    ],
    treatment_ids: [
      {
        type: Number,
        ref: "Treatment", // Reference to the Treatment model
      },
    ],
    medicine_ids: [
      {
        type: Number,
        ref: "Medicine", // Reference to the Medicine model
      },
    ],

    dental_history: {
      type: String,
    },
    medical_history: { type: String },
    case_documents: [
      {
        documentType: String,
        documentUrl: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CaseHistorySchema.set("toObject", {
  virtuals: true,
});
CaseHistorySchema.set("toJSON", {
  virtuals: true,
});

CaseHistorySchema.pre("validate", autonIncrement);

const CaseHistory = mongoose.model("casehistory", CaseHistorySchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    CaseHistory.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.case_id = newObj && newObj.case_id ? newObj.case_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default CaseHistory;
