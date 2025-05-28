import mongoose, { Schema, Document } from "mongoose";

interface IRecord extends Document {
  name: string;
  secondName: string;
  phoneNumber: string;
  comment: string;
  created: Date;
  date: Date;
  restaurantId: number;
}

const RecordSchema = new Schema<IRecord>({
  name: { type: String, required: true },
  secondName: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  comment: { type: String, required: true },
  created: { type: Date, default: Date.now },
  date: { type: Date, required: true },
  restaurantId: { type: Number, required: true }, // Добавлено
});

const RecordModel =
  mongoose.models.RecordLog || mongoose.model<IRecord>("Record", RecordSchema);

export default RecordModel;
