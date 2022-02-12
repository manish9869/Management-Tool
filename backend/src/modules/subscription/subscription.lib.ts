import Subscription from "../../models/subscription";

export const addSubscription = async (obj) => {
  const SubscriptionObj = new Subscription(obj);
  const result = await SubscriptionObj.save();
  return result;
};

export const updateSubscriptionData = async (condition, obj) =>
  Subscription.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getSubscriptionDataById = async (condition = {}) =>
  Subscription.findOne(condition);

export const getAllSubscriptionData = async (condition = {}) =>
  Subscription.find(condition).sort({ id: -1 });

export const deleteSubscriptionData = async (condition = {}) =>
  Subscription.deleteOne(condition);
