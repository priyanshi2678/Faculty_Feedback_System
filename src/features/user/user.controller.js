import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import userRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { getDB } from "../../config/MySQL.js";
import subjectRepository from "../subject/subject.repositary.js";
import branchRepository from "../branch_sub/branch.repositary.js";
import feedbackRepository from "../feedback/feedback.repositary.js";
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
import session from "express-session";

export default class UserController {
  constructor() {
    this.userRepo = new userRepository();
    this.subjectRepo = new subjectRepository();
    this.feedbackRepo = new feedbackRepository();
    this.branchRepo = new branchRepository();
  }

  // Login method using Passport
  async login(req, res) {
    let user;

    passport.use(
      new LocalStrategy(async (username, password, done) => {
        console.log(username);
        
        // Fetch user by unique ID (username)
        const db = getDB(); // Get the MySQL database connection
        const [rows] = await db.execute("SELECT * FROM users WHERE uniqueId=?", [username]);

        if (rows.length === 0) {
          return done(null, false, { message: "Incorrect username." });
        }

        user = rows[0]; // Assuming we have the first matching user
        if (user.password !== password) {  // Compare plain-text password
          return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user);
      })
    );

    let flag=true;
    passport.authenticate("local", (err, user, info) => {
      if (err) {
          return res.render("login", { message: "Something went wrong. Please try again." });
      }
      if (!user) {
          return res.render("login", { message: "Incorrect username or password" });
      }

      req.logIn(user, async (loginErr) => {
          if (loginErr) {
              return res.render("login", { message: "Login failed. Please try again." });
          }

          // Redirect user based on role
          
          if (user.role === "Student") {
            if(user.has_changed==false){
              const id=user.uniqueid;
              req.session.iddetails={id};
              return res.redirect("/change_password");
            }
            if(user.is_allowed==false){
              return res.render("login", { message: "The feedback form is currently unavailable for your semester"});
            }
            else{
              if(user.has_filled==false){
                const branch_name = user.branch_name;
                const uniqueId=user.uniqueid;
                const semester=user.semester;
                const discipline_id=user.discipline_id;
                  const year = user.year;
                  const subjects = await this.branchRepo.fetchSubjects(semester,discipline_id,uniqueId,branch_name, year);
                  console.log(subjects);
                  const faculties = await this.subjectRepo.fetchfaculties(subjects,user.section);
                  const questionsArray = [
                    "How would you rate the clarity of the instructor's explanations?",
                    "Did the instructor effectively engage with the students?",
                    "Were the course materials organized and easy to follow?",
                    "Did the instructor provide helpful feedback on assignments?",
                    "How approachable was the instructor for questions and assistance?",
                    "Did the instructor encourage active participation in class discussions?",
                    "Did the instructor demonstrate a good understanding of the subject matter?",
                    "Was the pace of the course appropriate for learning?",
                    "Did the instructor encourage critical thinking and problem-solving?",
                    "Overall, how satisfied are you with the instructor's teaching?"
                ];
                  console.log("Subjects outside:", subjects);
                  console.log("faculties:", faculties);
                  // res.send("asdmfklsvjbhskalj");
                  // res.render('feedback',{ subjects, faculties,questionsArray ,uniqueId});
                  req.session.feedbackData = { subjects, faculties, questionsArray, uniqueId };
                  res.redirect("/feedback");
              }
              else{
                res.render("login", { message: "You have already filled the feedback"});
              }
            }
            
          } else if(user.role == "faculty") {
            const uniqueid=user.uniqueid;
            const feedbacks=await this.feedbackRepo.fetchfeedback(uniqueid);
            console.log(feedbacks);
            return res.render("dashboard",{feedbacks});
          }
          else if(user.role == "admin"){
            req.session.adminDetails = {
              discipline: user.discipline_id,
              branch_name: user.branch_name,
            };
            console.log(req.session.adminDetails);
            // return res.render("admin", { discipline: user.discipline_id, branch_name: user.branch_name });
            req.session.adminDetails = {
              discipline: user.discipline_id,
              branch_name: user.branch_name
          };
          res.redirect("/admin");
          
          }
      });
  })(req, res);
}


}
