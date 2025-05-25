import mongoose, { Schema, Document } from "mongoose";

interface IRecord extends Document {
  restaurantId: number;
  name: string;
  secondName: string;
  phoneNumber: string;
  comment: string;
  created: Date;
  rentDate: Date;
}

const RecordSchema = new Schema<IRecord>({
  restaurantId: { type: Number, required: true },
  name: { type: String, required: true },
  secondName: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  comment: { type: String, required: true },
  created: { type: Date, required: false, default: Date.now },
  rentDate: { type: Date, required: false },
});

const RecordModel =
  mongoose.models.RecordLog || mongoose.model<IRecord>("Record", RecordSchema);

export default RecordModel;
