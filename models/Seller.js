import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true }, // e.g., "Individual", "Company", "Partnership"
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    taxId: { type: String }, // Tax ID or Business Registration Number
    bankAccountDetails: {
        accountHolderName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        routingNumber: { type: String, required: true }
    },
    productsCategory: [{ type: String }], // Categories they want to sell
    yearsInBusiness: { type: Number },
    website: { type: String },
    description: { type: String }, // Business description
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    submittedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date }
}, { timestamps: true });

// Check if the model exists before creating a new one
const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);

export default Seller;

