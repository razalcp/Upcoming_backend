import { AttendeeEntity, EventEntity, TicketEntity } from "../../interfaces/organizer/repositories";
import { IOrganizer } from "../../models/organizer/organizerModel";

class OrganizerRepository {

  private _organizerModel;
  private _eventModel;
  private _attendeeModel;
  private _ticketModel;

  constructor(organizerModel: any, eventmodel: any, attendeeModel: any, ticketModel: any) {
    this._organizerModel = organizerModel
    this._eventModel = eventmodel
    this._attendeeModel = attendeeModel
    this._ticketModel = ticketModel
  }

  findByEmail = async (email: string): Promise<IOrganizer> => {
    try {
      return await this._organizerModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  };

  register = async (authorityName: string, email: string, password: string): Promise<void> => {
    try {
      return await this._organizerModel.create({ authorityName, email, password });
    } catch (error) {
      throw error;
    }
  };

  login = async (email: string) => {
    try {
      const singleUser = await this._organizerModel.findOne({ email })
      if (!singleUser) {
        throw new Error("User not found")
      }
      return singleUser

    } catch (error) {
      throw error
    }
  };

  findAll = (): Promise<EventEntity[]> => {
    return this._eventModel.find().sort({ startAt: 1 }).lean() as any;
  };

  create = async (input: Omit<EventEntity, "_id">): Promise<EventEntity> => {
    const created = await this._eventModel.create(input as any);
    return created.toObject() as any;
  };

  findAllAttendees = () => {
    return this._attendeeModel.find().sort({ createdAt: -1 }).lean() as any;
  };

  findForEvent = async (eventId: string): Promise<TicketEntity[]> => {
    return this._ticketModel.find({ eventId }).lean() as any;
  };

  findByQr = (qr: string): Promise<TicketEntity | null> => {
    return this._ticketModel.findOne({ qrCode: qr }).lean() as any;
  };

  update = (id: string, update: Partial<TicketEntity>): Promise<TicketEntity | null> => {
    return this._ticketModel.findByIdAndUpdate(id, update, { new: true }).lean() as any;
  };
  findById = (id: string) => {
    return this._eventModel.findById(id).lean() as any;
  };
  attendeesFindById = async (id: string): Promise<AttendeeEntity | null> => {
    return this._attendeeModel.findById(id).lean() as any;
  };
  countForEvent = async (eventId: string): Promise<number> => {
    return this._ticketModel.countDocuments({ eventId });
  };

  createTicket = async (input: Omit<TicketEntity, "_id">): Promise<TicketEntity> => {
    const created = await this._ticketModel.create(input as any);
    return created.toObject() as any;
  };

  createAttendee = async (input: Omit<AttendeeEntity, "_id">): Promise<AttendeeEntity> => {
    const created = await this._attendeeModel.create(input as any);
    return created.toObject() as any;
  };

}

export default OrganizerRepository;