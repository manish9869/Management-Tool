import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
const saltRounds = 10;

dotenv.config();

export const generateJWT = (payload: any) => {
  const token = jwt.sign(
    { id: payload.userId, emailid: payload.email, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};
export const generatePassword = async (password) => {
  let res = new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        throw err;
      } else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            throw err;
          } else {
            resolve(hash);
          }
        });
      }
    });
  });

  return res;
};

export const CheckPassword: any = async (
  user_entered_Password,
  DB_Password
) => {
  let res = new Promise((resolve, reject) => {
    bcrypt.compare(
      user_entered_Password,
      DB_Password,
      function (err, isMatch: any) {
        if (err) {
          throw err;
        }
        console.log("isMatch:", isMatch);
        resolve(isMatch);
      }
    );
  });
  return res;
};
