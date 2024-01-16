import mongoose from "mongoose";

const MedicalConditionSchema = new mongoose.Schema({
  condition_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  symptoms: [String],
  type: {
    type: String,
    default: null,
  },
  created_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the Customer model
  },
  updated_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the Customer model
  },
});

MedicalConditionSchema.set("toObject", {
  virtuals: true,
});
MedicalConditionSchema.set("toJSON", {
  virtuals: true,
});

MedicalConditionSchema.pre("validate", autonIncrement);

const MedicalCondition = mongoose.model(
  "medical_condition",
  MedicalConditionSchema
);

function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    MedicalCondition.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj) => {
        self.condition_id =
          newObj && newObj.condition_id ? newObj.condition_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default MedicalCondition;
