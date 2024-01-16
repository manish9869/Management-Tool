import MedicalCondition from "../../models/medical-condition";

export const addMedicalCondition = async (conditionData) => {
  const newCondition = new MedicalCondition(conditionData);
  const result = await newCondition.save();
  return result;
};

export const updateMedicalCondition = async (conditionId, updatedData) => {
  const updatedCondition = await MedicalCondition.findOneAndUpdate(
    { condition_id: conditionId },
    updatedData,
    { new: true, useFindAndModify: false }
  );
  return updatedCondition;
};

export const getMedicalConditionById = async (conditionId) => {
  const condition = await MedicalCondition.findOne({
    condition_id: conditionId,
  });
  return condition;
};

export const getAllMedicalConditions = async () => {
  const conditions = await MedicalCondition.find().sort({ condition_id: -1 });
  return conditions;
};

export const deleteMedicalCondition = async (conditionId) => {
  const deletionResult = await MedicalCondition.deleteOne({
    condition_id: conditionId,
  });
  return deletionResult;
};
