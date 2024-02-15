import Invoice from "../../models/invoice";

export const addInvoice = async (invoiceData) => {
  const invoice = new Invoice(invoiceData);
  const result = await invoice.save();
  return result;
};

export const updateInvoiceData = async (condition, updateData) =>
  Invoice.findOneAndUpdate(condition, updateData, {
    new: true,
    useFindAndModify: false,
  });

export const getInvoiceById = async (condition = {}) =>
  Invoice.findOne(condition)
    .populate("customer_id")
    .populate({
      path: "case_id",
      populate: [
        {
          path: "staff_member_id",
          model: "staff_member",
        },
        {
          path: "condition_ids",
          model: "medical_condition",
        },
        {
          path: "treatment_ids",
          model: "treatment",
        },
        {
          path: "medicine_ids",
          model: "medicine",
        },
      ],
    })
    .sort({ invoice_id: -1 });

export const getAllInvoices = async (condition = {}) =>
  Invoice.find(condition)
    .populate("customer_id")
    .populate("case_id")
    .sort({ invoice_id: -1 });

export const deleteInvoice = async (condition = {}) =>
  Invoice.deleteOne(condition);
