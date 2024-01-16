import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as HttpStatus from "http-status-codes";
import * as dotenv from "dotenv";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as EnvHandler from "../helpers/environment.handler";
import mongoose from "mongoose";

dotenv.config();

/**
 * Validate JWT token
 * @param req
 * @param res
 * @param next
 */
export const validateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the jwt token from the headers
    const token = <string>req.headers["x-access-token"];
    const jwtSecret = EnvHandler.envJWT_SECRET();
    let payload;

    // Validate the token
    payload = <any>jwt.verify(token, jwtSecret);

    // get logged in user details from db

    (req.loggedInUser = mongoose.Types.ObjectId.createFromHexString(
      payload.id
    )),
      next();
  } catch (e) {
    res.locals.errorCode = HttpStatus.UNAUTHORIZED;
    res.locals.errors = e.message;
    ResponseHandler.JSONERROR(req, res);
  }
};
