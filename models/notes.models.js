import mongoose, { Schema } from "mongoose";
import { User } from "./users.models.js";
const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      default: "general",
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
