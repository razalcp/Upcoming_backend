import express from "express";
import OrganizerRepository from "../repositories/organizer/organizerRepository";
import OrganizerService from "../services/organizer/organizerService";
import OrganizerController from "../controllers/organizer/organizerController";
import Organizer, { IOrganizer } from "../models/organizer/organizerModel";
import { EventModel } from "../models/organizer/Event";
import { AttendeeModel } from "../models/organizer/Attendee";
import { TicketModel } from "../models/organizer/Ticket";
import organizerAuthMiddle from "../middlewares/jwtAuthOrganizer";

const router = express.Router();
const organizerReprository = new OrganizerRepository(Organizer as any, EventModel as any, AttendeeModel as any, TicketModel as any)
const organizerService = new OrganizerService(organizerReprository)
const organizerController = new OrganizerController(organizerService)

router.post('/register', organizerController.register)
router.post('/login', organizerController.login)
router.get("/events", organizerAuthMiddle, organizerController.list);
router.post("/events", organizerAuthMiddle, organizerController.create);
router.post('/userLogout', organizerController.logoutUser)
router.get("/attendees", organizerAuthMiddle, organizerController.listAttendees);
router.post("/attendees", organizerAuthMiddle, organizerController.createAttendee);
router.get("/tickets/event/:eventId", organizerAuthMiddle, organizerController.listForEvent);
router.post("/tickets/validate", organizerAuthMiddle, organizerController.validate);
router.post("/tickets/issue", organizerAuthMiddle, organizerController.issue);

export default router;
