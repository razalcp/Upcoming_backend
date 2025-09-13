import { Request, Response } from "express";
import HTTP_statusCode from "../../enums/httpStatusCode";
import { RESPONSE_MESSAGES } from "../../constants/messages";
import { z } from "zod";

const eventSchema = z.object({
    organizerId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    venue: z.string().min(1),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    capacity: z.number().int().positive()
});
const validateSchema = z.object({ qrCode: z.string().min(1) });
const issueSchema = z.object({ eventId: z.string().min(1), attendeeId: z.string().min(1) });
const attendeeSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});
class OrganizerController {
    private _organizerService;

    constructor(organizerService: any) {
        this._organizerService = organizerService
    }

    register = async (req: Request, res: Response) => {

        try {
            const { email, password, authorityName } = req.body;
            await this._organizerService.register(authorityName, email, password);
            res.status(HTTP_statusCode.OK).send(RESPONSE_MESSAGES.ORGANIZER.REGISTER_SUCCESS);

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === RESPONSE_MESSAGES.ORGANIZER.EMAIL_ALREADY_EXISTS) {
                    res
                        .status(HTTP_statusCode.Conflict)
                        .json({ message: RESPONSE_MESSAGES.ORGANIZER.EMAIL_ALREADY_EXISTS });
                } else {
                    res
                        .status(HTTP_statusCode.InternalServerError)
                        .json({ message: RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG });
                }
            } else {
                res
                    .status(HTTP_statusCode.InternalServerError)
                    .json({ message: RESPONSE_MESSAGES.COMMON.UNKNOWN_ERROR });
            }
        };
    };

    login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            const serviceResponse = await this._organizerService.login(email, password);

            res.cookie("organizerRefreshToken", serviceResponse.organizerRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie("organizerAccessToken", serviceResponse.organizerToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 48 * 60 * 60 * 1000,
            });

            res.json({ email: serviceResponse.email, authorityName: serviceResponse.authorityName });

        } catch (error: unknown) {
            throw error
        };



    };

    logoutUser = async (req: Request, res: Response) => {
        try {
            res.clearCookie("organizerAccessToken", { httpOnly: true, secure: true, sameSite: 'none' });
            res.clearCookie("organizerRefreshToken", { httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).json({ message: RESPONSE_MESSAGES.ORGANIZER.LOGOUT_SUCCESS });
        } catch (error) {
            res.status(HTTP_statusCode.InternalServerError).json({ message: RESPONSE_MESSAGES.COMMON.SOMETHING_WENT_WRONG, error });
        }
    };

    list = async (req: Request, res: Response) => {
        const items = await this._organizerService.list();
        res.json(items);
    };
    create = async (req: Request, res: Response) => {
        const parsed = eventSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error.flatten());
        const created = await this._organizerService.create(parsed.data);
        res.status(201).json(created);
    };

    listAttendees = async (_req: Request, res: Response) => {
        const items = await this._organizerService.listAttendees();
        res.json(items);
    };

    listForEvent = async (req: Request, res: Response) => {
        const items = await this._organizerService.listForEvent(req.params.eventId);
        res.json(items);
    };

    validate = async (req: Request, res: Response) => {
        const parsed = validateSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error.flatten());
        try {
            const updated = await this._organizerService.validate(parsed.data);
            res.json(updated);
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    };

    issue = async (req: Request, res: Response) => {
        const parsed = issueSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error.flatten());
        try {
            const created = await this._organizerService.issue(parsed.data);
            res.status(201).json(created);
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    };


    createAttendee = async (req: Request, res: Response) => {
        const parsed = attendeeSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json(parsed.error.flatten());
        const created = await this._organizerService.createAttendee(parsed.data);
        res.status(201).json(created);
    };

}

export default OrganizerController;