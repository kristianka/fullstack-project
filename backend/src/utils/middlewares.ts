import { NextFunction, Request, Response } from "express";
import { getAdminInstance } from "./firebaseConnection";
import { AuthRequest } from "../types";

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "test") {
        // console.error(error);
    }

    // it seems to be that firebase and mongoose use normal "Error" class,
    // so we can't use instanceof which leads to little stupid code
    // feel free to try, prints true
    // console.log(error instanceof Error);

    // firebase errors
    if (error.message.includes("auth/id-token-expired")) {
        return res.status(401).json({ error: "Token expired" });
    }

    // mongoose errors
    if (error.message.includes("MongoConnectionException")) {
        return res.status(500).json({ error: "Server error. Please try again later" });
    } else if (error.message.includes("E11000")) {
        return res.status(409).json({ error: "Duplicate key error" });
    } else if (error.message.includes("ECONNREFUSED")) {
        return res.status(503).json({ error: "Operation failed" });
    }

    // normal errors
    if (error.message.includes("CastError")) {
        return res.status(400).json({ error: "Incorrect formatting" });
    } else if (error.message.includes("ValidationError")) {
        return res.status(400).json({ error: `Received invalid data: ${error.message}` });
    } else if (error.message.includes("SyntaxError")) {
        return res.status(400).json({ error: "Bad request" });
    } else if (error.message.includes("TypeError")) {
        return res.status(400).json({ error: "Bad request." });
    }

    // continue to 404
    return next(error);
};

const getTokenFromReq = (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authorization = req.get("Authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        req.token = authorization.replace("Bearer ", "");
    } else {
        req.token = undefined;
    }
    next();
};

const getUserFromReq = async (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.token) {
        return next();
    }
    const admin = getAdminInstance();
    try {
        const decodedUser = await admin.auth().verifyIdToken(req.token);
        req.user = decodedUser;
    } catch (error) {
        return next(error);
    }
    // console.log("TOKEN IN GETUSER", req.token);
    // console.log("USER IN GETUSER", req.user);
    next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
    console.log("in unknownEndpoint");
    return res.status(404).send("Not found");
};

export { getTokenFromReq, getUserFromReq, unknownEndpoint, errorHandler };
