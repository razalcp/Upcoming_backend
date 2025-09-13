import bcrypt from "bcryptjs";
import { createRefreshToken, createToken } from "../../config/jwt_config";
import { CreateAttendeeDto, IssueTicketDto, ValidateTicketDto } from "../../interfaces/organizer/repositories";
import crypto from "node:crypto";

export type CreateEventDto = {
    organizerId: string;
    title: string;
    description?: string;
    venue: string;
    startAt: Date;
    endAt: Date;
    capacity: number;
};

class OrganizerService {
    private _organizerRepository;

    constructor(organizerRepository: any) {
        this._organizerRepository = organizerRepository
    }

    register = async (authorityName: string, email: string, password: string): Promise<void> => {
        try {
            const alreadyExistingUser = await this._organizerRepository.findByEmail(email);

            if (alreadyExistingUser) {
                throw new Error("Email already exists");
            }
            const hashedPassword = await bcrypt.hash(
                password as string,
                10
            );
            password = hashedPassword

            const response = await this._organizerRepository.register(authorityName, email, password);
        } catch (error) {
            throw error
        }


    };

    login = async (email: string, password: string): Promise<{ email: string; authorityName: string; organizerToken: string; organizerRefreshToken: string; }> => {
        try {
            const userData = await this._organizerRepository.login(email);
            if (!userData) throw new Error("Email not found");

            const comparePassword = await bcrypt.compare(password, userData.password as string);

            if (!comparePassword) throw new Error("Wrong password");

            const organizerToken = createToken(userData._id as unknown as string, process.env.organizerRole as string);

            const organizerRefreshToken = createRefreshToken(userData._id as unknown as string, process.env.organizerRole as string);

            return { email: userData.email, authorityName: userData.authorityName, organizerToken, organizerRefreshToken }
        } catch (error) {
            throw error
        }
    };
    list = () => { return this._organizerRepository.findAll(); }
    create = (input: CreateEventDto) => { return this._organizerRepository.create({ ...(input as any) }); }
    listAttendees = () => { return this._organizerRepository.findAllAttendees(); }

    listForEvent = (eventId: string) => { return this._organizerRepository.findForEvent(eventId); }

    validate = async (input: ValidateTicketDto) => {
        const ticket = await this._organizerRepository.findByQr(input.qrCode);
        if (!ticket) throw new Error("Invalid ticket");
        if (ticket.status === "checked_in") throw new Error("Already checked in");
        if (ticket.status === "cancelled") throw new Error("Ticket cancelled");
        return this._organizerRepository.update(String(ticket._id), { status: "checked_in", checkedInAt: new Date() } as any);
    };

    issue = async (input: IssueTicketDto) => {
        const event = await this._organizerRepository.findById(input.eventId);
        if (!event) throw new Error("Event not found");
        const attendee = await this._organizerRepository.attendeesFindById(input.attendeeId);
        if (!attendee) throw new Error("Attendee not found");
        const count = await this._organizerRepository.countForEvent(input.eventId);
        if (count >= event.capacity) throw new Error("Event capacity reached");
        const qrCode = crypto.randomBytes(16).toString("hex");
        return this._organizerRepository.createTicket({
            eventId: event._id,
            attendeeId: attendee._id,
            qrCode,
            status: "issued",
            issuedAt: new Date()
        } as any);
    };
    createAttendee = async (input: CreateAttendeeDto) => { return this._organizerRepository.createAttendee(input as any); }

}

export default OrganizerService;