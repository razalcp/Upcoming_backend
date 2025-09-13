import { Schema, model, Document } from "mongoose";

// 1. Interface for TypeScript type safety
export interface IOrganizer extends Document {
    authorityName: string;
    email: string;
    password: string;
}

// 2. Mongoose Schema
const organizerSchema = new Schema<IOrganizer>(
    {
        authorityName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// 3. Create and export Model
const Organizer = model<IOrganizer>("Organizer", organizerSchema);

export default Organizer;
