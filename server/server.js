import path from "path";
import express from "express";
import { MongoClient } from "mongodb";
import template from "./../template";
//comment out before building for production
import devBundle from "./devBundle";

const app = express();
//comment out before building for production
devBundle.compile(app);

const CURRENT_WORKING_DIR = process.cwd();
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

app.get("/", (req, res) => {
  res.status(200).send(template());
});

let port = process.env.PORT || 3000;
app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", port);
});

const uri =
  "mongodb+srv://ye:wy6524615@cluster0.mbuii.mongodb.net/mern-infra?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
