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
});

MedicalConditionSchema.set("toObject", {
  virtuals: true,
});
MedicalConditionSchema.set("toJSON", {
  virtuals: true,
});

MedicalConditionSchema.pre("validate", autonIncrement);

const MedicalCondition = mongoose.model(
  "MedicalCondition",
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
