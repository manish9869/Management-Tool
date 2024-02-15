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

export const getCaseHistoryByCustomerId = async (condition = {}) =>
  CaseHistory.find(condition).sort({ id: -1 });

export const getCaseHistoryById = async (condition = {}) =>
  CaseHistory.findOne(condition)
    .populate("customer_id")
    .populate("staff_member_id")
    .populate("condition_ids")
    .populate("treatment_ids")
    .populate("medicine_ids")
    .populate("created_user_id")
    .populate("updated_user_id")
    .sort({ id: -1 });

export const getAllCaseHistoryData = async (condition = {}) =>
  CaseHistory.find(condition)
    .populate("customer_id")
    .populate("staff_member_id")
    .populate("condition_ids")
    .populate("treatment_ids")
    .populate("medicine_ids")
    .populate("created_user_id")
    .populate("updated_user_id")
    .sort({ id: -1 });

export const deleteCaseHistoryData = async (condition = {}) =>
  CaseHistory.deleteOne(condition);
