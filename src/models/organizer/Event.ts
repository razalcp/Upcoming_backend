import { Schema, model, Types } from "mongoose";

export interface EventDocument {
	_id: Types.ObjectId;
	organizerId: Types.ObjectId;
	title: string;
	description?: string;
	venue: string;
	startAt: Date;
	endAt: Date;
	capacity: number;
	createdAt: Date;
	updatedAt: Date;
}

const EventSchema = new Schema<EventDocument>(
	{
		organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		description: { type: String },
		venue: { type: String, required: true },
		startAt: { type: Date, required: true },
		endAt: { type: Date, required: true },
		capacity: { type: Number, required: true, min: 1 }
	},
	{ timestamps: true }
);

export const EventModel = model<EventDocument>("Event", EventSchema);


