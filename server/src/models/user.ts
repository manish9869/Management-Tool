import * as mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    user_id: {
      type: Number,
      unique: true,
    },
    user_name: {
      type: String,
      default: null,
    },
    profile_img: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    user_email: {
      type: String,
      default: null,
    },
    role_id: {
      type: Number,
      default: null,
    },
    status: {
      type: Number,
      default: 1,
    },
    twofa_auth_code: {
      type: String,
      default: null,
    },
    is_twofa_enabled: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.set("toObject", {
  virtuals: true,
});
UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.pre("validate", autonIncrement);

const User = mongoose.model("user", UserSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    User.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.user_id = newObj && newObj.user_id ? newObj.user_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default User;
