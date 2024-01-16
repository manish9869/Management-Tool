import StaffMember from "../../models/staff-memebers";

const addStaffMember = async (staffMemberData) => {
  const newStaffMember = new StaffMember(staffMemberData);
  const result = await newStaffMember.save();
  return result;
};
const updateStaffMember = async (staffMemberId, updatedData) => {
  const updatedStaffMember = await StaffMember.findOneAndUpdate(
    staffMemberId,
    updatedData,
    { new: true, useFindAndModify: false }
  );
  console.log("Updated Staff Member:", updatedStaffMember);
  return updatedStaffMember;
};

const getStaffMemberById = async (staffMemberId) => {
  const staffMember = await StaffMember.findOne(staffMemberId);
  return staffMember;
};

const getAllStaffMembers = async () => {
  const staffMembers = await StaffMember.find().sort({ id: -1 });
  return staffMembers;
};

const deleteStaffMemberById = async (staffMemberId) => {
  const deletedStaffMember = await StaffMember.deleteOne(staffMemberId);
  return deletedStaffMember;
};

export {
  addStaffMember,
  updateStaffMember,
  getStaffMemberById,
  getAllStaffMembers,
  deleteStaffMemberById,
};
