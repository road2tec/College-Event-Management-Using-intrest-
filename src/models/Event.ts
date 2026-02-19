import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  date: Date;
  venue: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  bannerUrl?: string;
  registeredStudents: mongoose.Types.ObjectId[];
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bannerUrl: { type: String },
    registeredStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
