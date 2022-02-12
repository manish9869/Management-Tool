import Subscription_mapping from "../../models/subscription_mapping";

export const addSubscription_mapping = async (obj) => {
  const Subscription_mappingObj = new Subscription_mapping(obj);
  const result = await Subscription_mappingObj.save();
  return result;
};

export const updateSubscription_mappingData = async (condition, obj) =>
  Subscription_mapping.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getSubscription_mappingDataById = async (condition = {}) =>
  Subscription_mapping.findOne(condition);

export const getAllSubscription_mappingData = async (condition = {}) =>
  Subscription_mapping.find(condition).sort({ id: -1 });

export const deleteSubscription_mappingData = async (condition = {}) =>
  Subscription_mapping.deleteOne(condition);
