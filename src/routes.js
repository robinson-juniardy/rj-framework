import express from "express";
const routes = express();

import AnalyticsController from "./main/analytics/analytics.controller.js";

routes.use("/analytics", AnalyticsController);

export default routes;
