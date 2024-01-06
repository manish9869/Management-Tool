import * as mongoose from "mongoose";
const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    customer_id: {
      type: Number,
      unique: true,
    },
    fullname: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
    },
    alt_mobile: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    DOB: {
      type: Date,
      default: null,
    },
    abha_card: {
      type: String,
      default: null,
    },
    insurance_policy: {
      type: String,
      default: null,
    },
    created_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the Customer model
      default: null,
    },
    updated_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the Customer model
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CustomerSchema.set("toObject", {
  virtuals: true,
});
CustomerSchema.set("toJSON", {
  virtuals: true,
});

CustomerSchema.pre("validate", autonIncrement);

const Customer = mongoose.model("customer", CustomerSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Customer.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.customer_id =
          newObj && newObj.customer_id ? newObj.customer_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Customer;
