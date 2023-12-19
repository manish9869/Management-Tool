import CustomerAppointment from "../../models/customer-appointment";

export const addAppointment = async (appointmentData) => {
  const newAppointment = new CustomerAppointment(appointmentData);
  const result = await newAppointment.save();
  return result;
};
export const updateAppointment = async (condition, updatedData) => {
  const appointmentToUpdate = await CustomerAppointment.findOne(condition);

  if (!appointmentToUpdate) {
    throw new Error("Appointment not found for update");
  }

  // Validate appointment date if it's being updated
  if (
    updatedData &&
    updatedData.staff_member_id &&
    updatedData.appointment_date
  ) {
    const existingAppointment = await CustomerAppointment.findOne({
      staff_member_id: updatedData.staff_member_id,
      appointment_date: updatedData.appointment_date,
      _id: { $ne: appointmentToUpdate._id }, // Exclude the current appointment being updated
    });

    if (existingAppointment) {
      throw new Error("Appointment conflict for the same date-time");
    }
  }

  const updatedAppointment = await CustomerAppointment.findOneAndUpdate(
    condition,
    updatedData,
    {
      new: true,
      useFindAndModify: false,
    }
  );
  return updatedAppointment;
};
export const getAppointmentById = async (condition = {}) => {
  try {
    const appointment = await CustomerAppointment.findOne(condition);
    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw new Error("Failed to fetch appointment");
  }
};

export const getAllAppointments = async (condition = {}) => {
  try {
    const appointments = await CustomerAppointment.find(condition).sort({
      id: -1,
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const deleteAppointment = async (condition = {}) => {
  try {
    const deletionResult = await CustomerAppointment.deleteOne(condition);
    return deletionResult;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Failed to delete appointment");
  }
};
