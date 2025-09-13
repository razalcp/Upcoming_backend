import { Schema, model, Types } from "mongoose";

export interface AttendeeDocument {
	_id: Types.ObjectId;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

const AttendeeSchema = new Schema<AttendeeDocument>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, index: true }
	},
	{ timestamps: true }
);

export const AttendeeModel = model<AttendeeDocument>("Attendee", AttendeeSchema);


