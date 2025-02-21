import express from "express";
import branchController from "./branch.controller.js";
const branchController = new branchController();
const branchRoute = express.Router();



export default branchRoute;
