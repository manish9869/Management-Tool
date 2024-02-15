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
import caseHistory from "./routes/case-history";
import invoice from "./routes/invoice";
import path from "path";

const app = express();
dotenv.config();
const port = EnvHandler.envPORT() || 3001;

app.set("view engine", "ejs");

app.use(bodyParser.json({ limit: "50mb" }));

// Define the directory where your images are stored
const templateDirectory = path.join(__dirname, `./templates`);

// Define the directory where your images are stored
const imagesDirectory = path.join(__dirname, `./../../case-files`);

// Serve static files from the 'case-files' directory
app.use("/images", express.static(imagesDirectory));

// Serve static files from the 'case-files' directory
app.use("/template", express.static(templateDirectory));

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
app.use("/case-history", caseHistory);
app.use("/invoices", invoice);

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
