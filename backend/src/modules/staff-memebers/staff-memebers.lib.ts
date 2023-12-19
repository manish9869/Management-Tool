import StaffMember from "../../models/staff-memebers";

const addStaffMember = async (staffMemberData) => {
  try {
    const newStaffMember = new StaffMember(staffMemberData);
    const result = await newStaffMember.save();
    return result;
  } catch (error) {
    throw new Error("Error while adding staff member");
  }
};
const updateStaffMember = async (staffMemberId, updatedData) => {
  try {
    const updatedStaffMember = await StaffMember.findOneAndUpdate(
      staffMemberId,
      updatedData,
      { new: true, useFindAndModify: false }
    );
    console.log("Updated Staff Member:", updatedStaffMember);
    return updatedStaffMember;
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Error while updating staff member");
  }
};

const getStaffMemberById = async (staffMemberId) => {
  try {
    const staffMember = await StaffMember.findOne(staffMemberId);
    return staffMember;
  } catch (error) {
    throw new Error("Error while fetching staff member by ID");
  }
};

const getAllStaffMembers = async () => {
  try {
    const staffMembers = await StaffMember.find().sort({ id: -1 });
    return staffMembers;
  } catch (error) {
    throw new Error("Error while fetching all staff members");
  }
};

const deleteStaffMemberById = async (staffMemberId) => {
  try {
    const deletedStaffMember = await StaffMember.deleteOne(staffMemberId);
    return deletedStaffMember;
  } catch (error) {
    throw new Error("Error while deleting staff member");
  }
};

export {
  addStaffMember,
  updateStaffMember,
  getStaffMemberById,
  getAllStaffMembers,
  deleteStaffMemberById,
};
