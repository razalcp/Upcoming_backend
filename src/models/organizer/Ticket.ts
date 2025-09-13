import { Schema, model, Types } from "mongoose";

export type TicketStatus = "issued" | "checked_in" | "cancelled";

export interface TicketDocument {
	_id: Types.ObjectId;
	eventId: Types.ObjectId;
	attendeeId: Types.ObjectId;
	qrCode: string;
	status: TicketStatus;
	issuedAt: Date;
	checkedInAt?: Date;
}

const TicketSchema = new Schema<TicketDocument>(
	{
		eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
		attendeeId: { type: Schema.Types.ObjectId, ref: "Attendee", required: true, index: true },
		qrCode: { type: String, required: true, unique: true },
		status: { type: String, enum: ["issued", "checked_in", "cancelled"], default: "issued" },
		issuedAt: { type: Date, default: Date.now },
		checkedInAt: { type: Date }
	},
	{ timestamps: false }
);

export const TicketModel = model<TicketDocument>("Ticket", TicketSchema);


