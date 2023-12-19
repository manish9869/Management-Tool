import mongoose from "mongoose";

const TreatmentSchema = new mongoose.Schema({
  treatment_id: {
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
  cost: {
    type: Number,
    default: null,
  },
  duration: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
});

TreatmentSchema.set("toObject", {
  virtuals: true,
});
TreatmentSchema.set("toJSON", {
  virtuals: true,
});

TreatmentSchema.pre("validate", autonIncrement);

const Treatment = mongoose.model("Treatment", TreatmentSchema);

function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Treatment.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj) => {
        self.treatment_id =
          newObj && newObj.treatment_id ? newObj.treatment_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Treatment;
