import * as mongoose from "mongoose";
const { Schema } = mongoose;

const CaseHistorySchema = new Schema(
  {
    case_id: {
      type: Number,
      unique: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer", // Reference to the Customer model
    },
    staff_member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff_member", // Reference to the Customer model
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "medical_condition", // Reference to the MedicalCondition model
      },
    ],
    treatment_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "treatment", // Reference to the Treatment model
      },
    ],
    medicine_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "medicine", // Reference to the Medicine model
      },
    ],

    dental_history: {
      type: String,
    },
    medical_history: { type: String },
    case_documents: [
      {
        documentType: String,
        documentName: String,
        documentFolder: String,
      },
    ],
    created_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the Customer model
    },
    updated_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the Customer model
    },
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

const CaseHistory = mongoose.model("case_history", CaseHistorySchema);

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
