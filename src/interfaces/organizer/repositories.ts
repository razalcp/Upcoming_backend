import type { Types } from "mongoose";

export interface IdentifiableDocument { _id: Types.ObjectId }

export interface EventEntity extends IdentifiableDocument {
	organizerId: Types.ObjectId;
	title: string;
	description?: string;
	venue: string;
	startAt: Date;
	endAt: Date;
	capacity: number;
};
export interface AttendeeEntity extends IdentifiableDocument {
	name: string;
	email: string;
};

export type TicketStatus = "issued" | "checked_in" | "cancelled";

export interface TicketEntity extends IdentifiableDocument {
	eventId: Types.ObjectId;
	attendeeId: Types.ObjectId;
	qrCode: string;
	status: TicketStatus;
	issuedAt: Date;
	checkedInAt?: Date;
}

export type ValidateTicketDto = { qrCode: string };
export type IssueTicketDto = { eventId: string; attendeeId: string };
export type CreateAttendeeDto = { name: string; email: string };