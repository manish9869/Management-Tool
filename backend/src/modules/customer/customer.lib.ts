import Customer from "../../models/customer";

export const addCustomer = async (obj) => {
  const CustomerObj = new Customer(obj);
  const result = await CustomerObj.save();
  return result;
};

export const updateCustomerData = async (condition, obj) =>
  Customer.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getCustomerDataById = async (condition = {}) =>
  Customer.findOne(condition)
    .populate("created_user_id")
    .populate("updated_user_id")
    .sort({ id: -1 });

export const getAllCustomerData = async (condition = {}) =>
  Customer.find(condition)
    .populate("created_user_id")
    .populate("updated_user_id")
    .sort({ id: -1 });

export const deleteCustomerData = async (condition = {}) =>
  Customer.deleteOne(condition);
