import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import * as EnvHandler from '../helpers/environment.handler';

dotenv.config();

export const generateJWT = (payload: any) => {
    const token = jwt.sign(
        { id: payload.userId, emailid: payload.email, role: payload.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
    return token;
}