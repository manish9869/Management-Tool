import * as mongoose from "mongoose";
const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    subscription_id: {
      type: Number,
      unique: true,
    },
    subscription_plan_name: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: null,
    },
    validity: {
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

SubscriptionSchema.set("toObject", {
  virtuals: true,
});
SubscriptionSchema.set("toJSON", {
  virtuals: true,
});

SubscriptionSchema.pre("validate", autonIncrement);

const Subscription = mongoose.model("subscription_plans", SubscriptionSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Subscription.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.subscription_id =
          newObj && newObj.subscription_id ? newObj.subscription_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Subscription;
