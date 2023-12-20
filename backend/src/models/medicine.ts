import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
  medicine_id: {
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
});

MedicineSchema.set("toObject", {
  virtuals: true,
});
MedicineSchema.set("toJSON", {
  virtuals: true,
});

MedicineSchema.pre("validate", autonIncrement);

const Medicine = mongoose.model("Medicine", MedicineSchema);

function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Medicine.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj) => {
        self.medicine_id =
          newObj && newObj.medicine_id ? newObj.medicine_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Medicine;
