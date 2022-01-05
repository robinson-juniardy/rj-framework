import express from "express";
import Application from "../../application.js";
import analyticsModel from "./analytics.model.js";

const Controller = express.Router();

Controller.get("/", async (request, response) => {
  const result = await Application.db
    .execute(analyticsModel.getAnalytics())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });

  response.json(result);
});

export default Controller;
