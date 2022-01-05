import express from "express";
import { settings } from "./src/settings.js";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./src/routes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.listen(settings.PORT, () =>
  console.log(`server started on port ${settings.PORT}`)
);
