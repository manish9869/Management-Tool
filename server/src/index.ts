import express from 'express';
import * as bodyParser from "body-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
dotenv.config();
import * as EnvHandler from './helpers/environment.handler';


const app = express();
dotenv.config();
const port = EnvHandler.envPORT() || 3001;
app.use(bodyParser.json());


mongoose
  .connect(
    "mongodb://localhost:27017/management_DB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to Mongo database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("Server/images")));


// allow cross origin
app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE',
//   );
//   // res.header(
//   //   'Access-Control-Allow-Headers',
//   //   'Origin, X-Requested-With, Content-Type, Accept, x-access-token',
//   // );
//   next();
// });



app.get('/', (req, res) => {
  res.send('Hey there!!!');
});

/**
 * Comment for server
 */
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${port}`);
});


