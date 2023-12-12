import Express from "express";
import { User } from "../models/user";
import { getUserFromReq } from "../utils/middlewares";
import { AuthRequest } from "../types";

const userRouter = Express.Router();

userRouter.get("/", async (_req, res) => {
    // const users = await User.find({}).populate("notes");
    // res.json(users);
    res.json("Hello.");
});

userRouter.get("/:id", getUserFromReq, async (req: AuthRequest, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User.findById(req.user.id).populate("favouriteLocations");
        return res.json(user);
    } catch (error) {
        console.log(error);
        // return res.status(400).json({ error: error });
        return next(error);
    }
});

userRouter.post("/", async (req, res, next) => {
    try {
        console.log("POST /api/users");
        const { name, uid } = req.body;

        const user = new User({
            fireBaseUid: uid,
            name
        });

        const savedUser = await user.save();
        return res.status(201).json(savedUser);
    } catch (error: any) {
        console.log(error.message);
        return next(error);
    }
});

export default userRouter;
