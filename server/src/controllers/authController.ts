import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as userLib from "../modules/User/User.lib";
import { generate2faAuthCode, verify2faAuthCode } from "../utility/2fa";
import { CheckPassword, generateJWT } from "../helpers/auth.helpers";
import * as HttpStatus from "http-status-codes";
class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      const input = req.body;
      let secret_key = "";
      let twofa_qr_url = "";

      let user: any = await userLib.getUserDataById({
        user_name: input.username,
      });

      if (user["user_name"]) {
        let isMatch: any = await CheckPassword(
          input.password,
          user["password"]
        );
        console.log(isMatch);

        if (isMatch) {
          if (user["is_twofa_enabled"] === 0) {
            // if 2fa enabled
            const secret: any = await generate2faAuthCode(user["user_email"]);
            twofa_qr_url = secret["qrUrl"];
            secret_key = secret["base32"];

            // add authcode in db for this user
            await userLib.updateUserData(
              { user_id: user["user_id"] },
              { twofa_auth_code: secret["base32"] }
            );
          } else {
            secret_key = user["twofa_auth_code"];
          }

          // Generate JWT, valid for 1 hour
          const token: string = generateJWT({
            userId: user["user_id"],
            email: input.email,
            role: user["role_id"],
          });

          //Send the jwt in the response
          const data: any = {
            token,
            user_name: user["user_name"],
            name: user["name"],
            user_email: user["user_email"],
            user_id: user["user_id"],
            profile_img: user["profile_img"],
            roleId: user["role_id"],
            is_twofa_enabled: user["is_twofa_enabled"] === 0 ? false : true,
            twofa_qr_url,
            secret_key,
          };

          res.locals.data = data;
          ResponseHandler.JSONSUCCESS(req, res);
        } else {
          res.locals.errorCode = HttpStatus.UNAUTHORIZED;
          res.locals.message = Messages.INVALID_CREDENTIALS;
          ResponseHandler.JSONERROR(req, res);
        }
      } else {
        res.locals.errorCode = HttpStatus.UNAUTHORIZED;
        res.locals.message = Messages.USER_DOES_NOT_EXIST;
        ResponseHandler.JSONERROR(req, res);
      }
    } catch (e) {
      res.locals.errorCode = HttpStatus.UNAUTHORIZED;
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static verifyOTP = async (req: Request, res: Response) => {
    try {
      let input = req.body;
      // remove session key from user
      const result = await verify2faAuthCode(input.secret, input.token);

      if (result) {
        // add authcode in db for this user
        await userLib.updateUserData(
          { twofa_auth_code: input.secret },
          { is_twofa_enabled: 1 }
        );
        res.locals.data = { Verified: result };
        res.locals.message = Messages.VERIFIED;

        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        res.locals.data = { VERIFIED: result };
        res.locals.message = Messages.VERIFIED_FAILED;

        ResponseHandler.JSONERROR(req, res);
      }
    } catch (e) {
      res.locals.errorCode = HttpStatus.UNAUTHORIZED;
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };
}

export default AuthController;
