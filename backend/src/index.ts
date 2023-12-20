import express from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/connection";
import * as EnvHandler from "./helpers/environment.handler";
import auth from "./routes/auth";
import customer from "./routes/customer";
import user from "./routes/user";
import staff from "./routes/staff-members";
import appointment from "./routes/appointment";
import treatment from "./routes/treatment";
import medicalCondition from "./routes/medical-condition";
import medicine from "./routes/medicine";

const app = express();
dotenv.config();
const port = EnvHandler.envPORT() || 3001;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

//Call connection
connection;

// allow cross origin
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  next();
});

app.use("/auth", auth);
app.use("/user", user);
app.use("/customer", customer);
app.use("/staff-members", staff);
app.use("/appointment", appointment);
app.use("/treatment", treatment);
app.use("/medical-condition", medicalCondition);
app.use("/medicine", medicine);

app.get("/", (req, res) => {
  res.send("Hey there!!!");
});

/**
 * Comment for server
 */
app.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${port}`);
});
