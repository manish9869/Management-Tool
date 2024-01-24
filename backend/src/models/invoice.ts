import * as mongoose from "mongoose";
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    invoice_id: {
      type: Number,
      unique: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    case_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "case_history",
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash", "Other"],
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Draft", "Paid", "Overdue"],
      default: "Draft",
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

InvoiceSchema.set("toObject", {
  virtuals: true,
});
InvoiceSchema.set("toJSON", {
  virtuals: true,
});

InvoiceSchema.pre("validate", autonIncrement);

const Invoice = mongoose.model("invoice", InvoiceSchema);

/**
 * auto increment
 * @param {*} next
 */
function autonIncrement(next) {
  const self = this;
  if (self.isNew) {
    Invoice.findOne({})
      .sort({ _id: -1 })
      .limit(1)
      .then((newObj: any) => {
        self.invoice_id =
          newObj && newObj.invoice_id ? newObj.invoice_id + 1 : 1;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next();
  }
}

export default Invoice;
