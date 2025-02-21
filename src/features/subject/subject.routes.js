import express from "express";
import subjectController from "./subject.controller.js";
const subjectController = new subjectController();
const userRoute = express.Router();

// userRoute.post("/signUp", (req, res) => {
//   userController.signUp(req, res);
// });
// userRoute.post("/login", (req, res) => {
//   userController.login(req, res);
// });
export default subjectRoute;
