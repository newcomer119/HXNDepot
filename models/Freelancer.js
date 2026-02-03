import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema({
  userId: { type: String }, // optional - if registered user applies
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Installer",
      "Constructor",
      "Real Estate Agent",
      "Interior Designer",
      "Flooring Specialist",
      "Tile Installer",
      "General Contractor",
      "Plumber",
      "Electrician",
      "Painter",
      "Other"
    ]
  },
  experienceYears: { type: Number },
  serviceArea: { type: String }, // e.g. "Toronto GTA", "Ontario"
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved"
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Freelancer = mongoose.models.Freelancer || mongoose.model("Freelancer", freelancerSchema);
export default Freelancer;
