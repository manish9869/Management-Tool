import * as mongoose from "mongoose";
const { Schema } = mongoose;

const CustomerAppointmentSchema = new Schema(
  {
    appointment_id: {
      type: Number,
      unique: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer", // Reference to the Customer model
    },
    staff_member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff_member", // Reference to the Customer model
    },
    appointment_date: {
      type: Date,
      default: null,
      validate: {
        validator: async function (value) {
          // Check if an appointment exists for the same staff_member_id and appointment_date
          const existingAppointment = await this.constructor.findOne({
            staff_member_id: this.staff_member_id,
            appointment_date: value,
          });

          if (existingAppointment) {
            return false; // Return false if an appointment for the same date-time already exists
          } else {
            // Check if the staff member has any other appointment within the next 30 minutes
            const nextAppointments = await this.constructor.find({
              staff_member_id: this.staff_member_id,
              appointment_date: {
                $gt: new Date(), // Get appointments after the current time
                $lt: new Date(new Date().getTime() + 30 * 60000), // 30 minutes in milliseconds
              },
            });

            return nextAppointments.length === 0; // Return true if no appointments within the next 30 minutes
          }
        },
        message: (props) =>
          `Appointment conflict or within next 30 minutes for ${props.value}.`,
      },
    },
    duration: {
      type: Number,
      default: 30,
    },
    reason: {
      type: String,
      default: null,
    },
    status: {
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

CustomerAppointmentSchema.set("toObject", {
  virtuals: true,
});
CustomerAppointmentSchema.set("toJSON", {
  virtuals: true,
});

CustomerAppointmentSchema.pre("validate", autonIncrement);

const CustomerAppointment = mongoose.model(
  "customer_appointment",
  CustomerAppointmentSchema
);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    CustomerAppointment.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.appointment_id =
          newObj && newObj.appointment_id ? newObj.appointment_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default CustomerAppointment;
