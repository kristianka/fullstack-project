import Express from "express";
import { Note } from "../models/note";
import { User } from "../models/user";
import { Location } from "../models/location";
import { getUserFromReq } from "../utils/middlewares";
import { AuthRequest } from "../types";

// express-async-error handles try-catch blocks!
const notesRouter = Express.Router();

// get all user's notes
notesRouter.get("/", getUserFromReq, async (req: AuthRequest, res) => {
    // req.user is handled by getUserFromReq middleware
    const firebaseUserId = req.user?.user_id;
    const user = await User.findOne({ fireBaseUid: firebaseUserId }).populate({
        path: "notes",
        populate: {
            path: "location",
            model: Location
        }
    });
    if (!user || firebaseUserId !== user.fireBaseUid) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json(user.notes);
});

// get note by id
notesRouter.get("/:id", getUserFromReq, async (req: AuthRequest, res) => {
    // req.user is handled by getUserFromReq middleware
    const firebaseUserId = req.user?.user_id;

    const user = await User.findOne({ fireBaseUid: firebaseUserId });
    const note = await Note.findById(req.params.id);

    // ObjectIds to strings for comparison
    const stringifiedUserId = user?._id.toString();
    const stringifiedNoteUserId = note?.user?.toString();

    if (
        !user ||
        firebaseUserId !== user.fireBaseUid ||
        stringifiedUserId !== stringifiedNoteUserId
    ) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (note) {
        return res.json(note);
    } else {
        return res.status(404).end();
    }
});

// post note
notesRouter.post("/", getUserFromReq, async (req: AuthRequest, res) => {
    // req.user is handled by getUserFromReq middleware
    const firebaseUserId = req.user?.user_id;
    const { title, content, location } = req.body;

    if (!title || !content || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const user = await User.findOne({ fireBaseUid: firebaseUserId });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // note the order: longitude, latitude
    const loc = new Location({
        coordinates: [location.lng, location.lat]
    });

    const savedLocation = await loc.save();
    await user.save();

    const note = new Note({
        title,
        content,
        location: savedLocation._id,
        createdAt: new Date(),
        user: user._id
    });

    const savedNote = await note.save();
    user.notes.push(savedNote._id);
    await user.save();

    return res.status(201).json(savedNote);
});

// update note
notesRouter.put("/:id", getUserFromReq, async (req: AuthRequest, res) => {
    // req.user is handled by getUserFromReq middleware
    const firebaseUserId = req.user?.user_id;
    const { title, content, location } = req.body;

    if (!title || !content || !location) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ fireBaseUid: firebaseUserId });
    const note = await Note.findById(req.params.id);

    // ObjectIds to strings for comparison
    const stringifiedUserId = user?._id.toString();
    const stringifiedNoteUserId = note?.user?.toString();

    if (
        !user ||
        firebaseUserId !== user.fireBaseUid ||
        stringifiedUserId !== stringifiedNoteUserId
    ) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!note) {
        return res.status(404).end();
    }

    // note the order!!!
    const loc = new Location({
        coordinates: [location.lng, location.lat]
    });

    const savedLocation = await loc.save();

    note.title = title;
    note.content = content;
    note.location = savedLocation._id;
    note.modifiedAt = new Date();
    const savedNote = await note.save();
    return res.status(200).json(savedNote);
});

// delete note
notesRouter.delete("/:id", getUserFromReq, async (req: AuthRequest, res) => {
    // req.user is handled by getUserFromReq middleware
    const firebaseUserId = req.user?.user_id;

    const user = await User.findOne({ fireBaseUid: firebaseUserId });
    const note = await Note.findById(req.params.id);

    // ObjectIds to strings for comparison
    const stringifiedUserId = user?._id.toString();
    const stringifiedNoteUserId = note?.user?.toString();

    if (
        !user ||
        firebaseUserId !== user.fireBaseUid ||
        stringifiedUserId !== stringifiedNoteUserId
    ) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!note) {
        return res.status(404).end();
    }

    await note.deleteOne();
    return res.status(204).end();
});

export default notesRouter;
