import * as mongoose from "mongoose";
const { Schema } = mongoose;

const ErrorLogsSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    req_id: {
      type: Number,
      default: null,
    },
    pagename: {
      type: String,
      default: null,
    },
    function_name: {
      type: String,
      default: null,
    },
    error_message: {
      type: String,
      default: null,
    },
    req_body: {
      type: JSON,
      default: null,
    },
    createddate: {
      type: Date,
      default: null,
    },
    created_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the Customer model
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ErrorLogsSchema.set("toObject", {
  virtuals: true,
});
ErrorLogsSchema.set("toJSON", {
  virtuals: true,
});

ErrorLogsSchema.pre("validate", autonIncrement);

const ErrorLogs = mongoose.model("errorlogs", ErrorLogsSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    ErrorLogs.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.id = newObj && newObj.id ? newObj.id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default ErrorLogs;
