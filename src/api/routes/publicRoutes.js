import express from "express";
import { publicCtrl } from "../controllers/publicController";

const publicRoutes = express.Router();

publicRoutes.post("/", publicCtrl.login);

export default publicRoutes;
