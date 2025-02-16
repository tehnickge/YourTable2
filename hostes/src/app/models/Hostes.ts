import mongoose, { Schema, Document } from "mongoose";

interface IRecordLog extends Document {
  name: string;
  secondName: string;
  phoneNumber: string;
  comment: string;
  created: Date;
  rentDate: Date;
}

const RecordLogSchema = new Schema<IRecordLog>({
  name: { type: String, required: true },
  secondName: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  comment: { type: String, required: false },
  created: { type: Date, required: true, default: Date.now },
  rentDate: { type: Date, required: true },
});

const RecordLogModel =
  mongoose.models.RecordLog ||
  mongoose.model<IRecordLog>("RecordLog", RecordLogSchema);

export default RecordLogModel;
