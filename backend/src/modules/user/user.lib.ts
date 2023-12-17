import User from "../../models/user";

export const addUser = async (obj) => {
  const UserObj = new User(obj);
  const result = await UserObj.save();
  return result;
};

export const updateUserData = async (condition, obj) =>
  User.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getUserDataById = async (condition = {}) =>
  User.findOne(condition);

export const getAllUserData = async (condition = {}) =>
  User.find(condition).sort({ id: -1 });

export const deleteUserData = async (condition = {}) =>
  User.deleteOne(condition);
