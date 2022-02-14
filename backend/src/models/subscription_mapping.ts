import * as mongoose from "mongoose";
const { Schema } = mongoose;

const SubscriptionMappingSchema = new Schema(
  {
    subscription_mapping_id: {
      type: Number,
      unique: true,
    },
    customer_id: {
      type: Number,
      default: null
    },
    subscription_id: {
      type: String,
      default: null,
    },
    amount_paid: {
      type: Number,
      default: null,
    },
    pending_amount: {
      type: Number,
      default: null,
    },
    total_amount: {
      type: Number,
      default: null,
    },
    created_user_id: {
      type: Number,
    },
    updated_user_id: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

SubscriptionMappingSchema.set("toObject", {
  virtuals: true,
});
SubscriptionMappingSchema.set("toJSON", {
  virtuals: true,
});

SubscriptionMappingSchema.pre("validate", autonIncrement);

const SubscriptionMapping = mongoose.model("subscription_mapping", SubscriptionMappingSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    SubscriptionMapping.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.subscription_mapping_id =
          newObj && newObj.subscription_mapping_id ? newObj.subscription_mapping_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default SubscriptionMapping;
