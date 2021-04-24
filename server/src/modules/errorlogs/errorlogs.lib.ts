import ErrorLogs from "../../models/ErrorLogs";

export const addErrorLogs = async (obj) => {
  const ErrorLogsObj = new ErrorLogs(obj);
  const result = await ErrorLogsObj.save();
  return result;
};

export const updateErrorLogsData = async (condition, obj) =>
  ErrorLogs.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getErrorLogsDataById = async (condition = {}) =>
  ErrorLogs.findOne(condition);

export const getAllErrorLogsData = async (condition = {}) =>
  ErrorLogs.find(condition).sort({ id: -1 });

export const deleteErrorLogsData = async (condition = {}) =>
  ErrorLogs.deleteOne(condition);
