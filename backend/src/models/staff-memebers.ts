import * as mongoose from "mongoose";
const { Schema } = mongoose;

const Staff_membersSchema = new Schema(
  {
    staff_member_id: {
      type: Number,
      unique: true,
    },
    fullname: {
      type: String,
      default: null,
    },
    position: {
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

Staff_membersSchema.set("toObject", {
  virtuals: true,
});
Staff_membersSchema.set("toJSON", {
  virtuals: true,
});

Staff_membersSchema.pre("validate", autonIncrement);

const Staff_members = mongoose.model("staff_member", Staff_membersSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Staff_members.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.staff_member_id =
          newObj && newObj.staff_member_id ? newObj.staff_member_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Staff_members;
