import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    reward: {
      type: String,
      required: true,
      select: false, // MUY IMPORTANTE
    },
    status: {
      type: String,
      enum: ["locked", "completed"],
      default: "locked",
    },
    unlockCodeHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Challenge", challengeSchema);