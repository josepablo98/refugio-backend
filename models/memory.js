import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    letter: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Memory", memorySchema);
