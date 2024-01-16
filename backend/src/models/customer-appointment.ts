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
          const self = this;
          // Check if an appointment exists for the same staff_member_id and appointment_date
          const existingAppointment = await self.constructor.findOne({
            staff_member_id: self.staff_member_id,
            appointment_date: value,
          });
          if (existingAppointment) {
            throw new Error(
              `An appointment already exists for this staff member at the specified date and time at ${existingAppointment.appointment_date} for ${existingAppointment.duration} minutes`
            );
          }

          // Fetch older appointments before the provided appointment_date
          const olderAppointments = await self.constructor.find({
            staff_member_id: self.staff_member_id,
            appointment_date: { $lt: value },
          });
          // Check for overlap by adding duration from input params in appointment date and time
          for (const appointment of olderAppointments) {
            const appointmentEndTime = new Date(
              appointment.appointment_date.getTime() +
                appointment.duration * 60000
            );
            if (appointmentEndTime > value) {
              throw new Error(
                `The appointment date-time overlaps with an older appointment for the staff at ${appointment.appointment_date} for ${appointment.duration} minutes`
              );
            }
          }
        },
        message: (props) => `${props.value}.`,
      },
    },

    duration: {
      type: Number,
      default: null,
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
