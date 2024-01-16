import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import * as EnvHandler from "../helpers/environment.handler";

const connectionString = EnvHandler.envDB_URL();

export const connection = mongoose
  .connect(connectionString)
  .then(() => console.log("Connecte to MONGO..."))
  .catch((e) => {
    mongoose
      .connect(connectionString)
      .then(() => console.log("Connecte to MONGO..."))
      .catch((e) => {
        throw new Error(`Error occured while connecting database ${e}`);
      });
  });

export default connection;
