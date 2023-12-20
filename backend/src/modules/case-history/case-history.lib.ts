import CaseHistory from "../../models/case-history"; // Import the CaseHistory model

export const addCaseHistory = async (obj) => {
  const CaseHistoryObj = new CaseHistory(obj);
  const result = await CaseHistoryObj.save();
  return result;
};

export const updateCaseHistoryData = async (condition, obj) =>
  CaseHistory.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getCaseHistoryById = async (condition = {}) =>
  CaseHistory.findOne(condition);

export const getAllCaseHistoryData = async (condition = {}) =>
  CaseHistory.find(condition).sort({ id: -1 });

export const deleteCaseHistoryData = async (condition = {}) =>
  CaseHistory.deleteOne(condition);
