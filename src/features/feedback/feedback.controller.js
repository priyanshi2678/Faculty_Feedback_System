
import jwt from "jsonwebtoken";
import feedbackRepository from "./feedback.repository.js";
import bcrypt from "bcrypt";
export default class feedbackController {
  constructor() {
    this.feedbackRepo = new feedbackRepository();

  }
  async signUp(req, res) {
    console.log(req.body);
  }
}
