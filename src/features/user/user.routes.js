import express from "express";
import UserController from "./user.controller.js";
const userController = new UserController();
const userRoute = express.Router();

// userRoute.post("/signUp", (req, res) => {
//   userController.signUp(req, res);
// });
userRoute.post("/login", (req, res) => {
  // console.log(req.body);
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

// console.log(obj); // { title: 'product' }
req.body=obj;
  userController.login(req, res);
});
userRoute.get("/login", (req, res) => {
  res.render("login", {message: "Welcome to login page"});
});

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.render('login',{message: 'Welcome to login page'})
}


// userRoute.post("/feedback", (req,res) => {
//   userController.feedback(req,res);
// } )
// userRoute.get("/feedback",(req,res)=>{
//   userController.feedback(req,res);
// });

export default userRoute;
