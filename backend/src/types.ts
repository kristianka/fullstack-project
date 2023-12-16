import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
    token?: string;
    // TODO: add user type
    user?: DecodedIdToken;
}

export interface NoteInterface {
    id: string;
    title: string;
    content: string;
    user: string;
    location: {
        coordinates: [number, number];
    };
}

export interface BackendUserInterface {
    id: string;
    fireBaseUid: string;
    name: string;
    notes: NoteInterface[];
    favouriteLocations: string[];
}

// user id is automatically added to the note on backend
export interface CreateNoteInterface {
    title: string;
    content: string;
    location: {
        lat: number;
        lng: number;
    };
}
