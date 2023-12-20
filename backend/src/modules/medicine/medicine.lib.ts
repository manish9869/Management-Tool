import Medicine from "../../models/medicine"; // Update import to the Medicine model

export const addMedicine = async (obj) => {
  const medicineObj = new Medicine(obj); // Update variable name to reflect the Medicine model
  const result = await medicineObj.save(); // Use the Medicine model
  return result;
};

export const updateMedicineData = async (condition, obj) =>
  Medicine.findOneAndUpdate(condition, obj, {
    new: true,
    useFindAndModify: false,
  });

export const getMedicineDataById = async (condition = {}) =>
  Medicine.findOne(condition);

export const getAllMedicineData = async (condition = {}) =>
  Medicine.find(condition).sort({ medicine_id: -1 }); // Update sorting field

export const deleteMedicineData = async (condition = {}) =>
  Medicine.deleteOne(condition);
