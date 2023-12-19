import Treatment from "../../models/Treatment";

export const addTreatment = async (treatmentData) => {
  const newTreatment = new Treatment(treatmentData);
  const result = await newTreatment.save();
  return result;
};

export const updateTreatment = async (treatmentId, updatedData) => {
  const updatedTreatment = await Treatment.findOneAndUpdate(
    { treatment_id: treatmentId },
    updatedData,
    { new: true, useFindAndModify: false }
  );
  return updatedTreatment;
};

export const getTreatmentById = async (treatmentId) => {
  const treatment = await Treatment.findOne({ treatment_id: treatmentId });
  return treatment;
};

export const getAllTreatments = async () => {
  const treatments = await Treatment.find().sort({ treatment_id: -1 });
  return treatments;
};

export const deleteTreatment = async (treatmentId) => {
  const deletionResult = await Treatment.deleteOne({
    treatment_id: treatmentId,
  });
  return deletionResult;
};
