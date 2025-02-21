import branchModel from "./branch.model.js";
import jwt from "jsonwebtoken";
import branchRepository from "./branch.repository.js";
import bcrypt from "bcrypt";
export default class branchController {
  constructor() {
    this.branchRepo = new branchRepository();

  }
  async signUp(req, res) {
//     console.log(req.body);

//     // const result = await this.userRepo.findByEmployeeCode(
//     //   req.body.employeeCode
//     // );
//     const result=null;
//     if (result != null) {
//       return res.status(404).send("Employee Already Exist ");
//     } else {
//       const { name, password, about, employeeCode, role } = req.body;
//       const hashedPassword = await bcrypt.hash(password, 12);
//       const user = new UserModel(
//         name,
//         hashedPassword,
//         about,
//         employeeCode,
//         role
//       );
//       await this.userRepo.signUp(user);
//       const token = jwt.sign(
//         {
//           userID: user._id,
//           employeeCode: user.employeeCode,
//           role:user.role,
//         },
//         process.env.JWT_SECRET_TEACHER,
//         {
//           expiresIn: "10h",
//         }
//       );

//       res.status(201).send({
//         name: user.name,
//         employeeCode: user.employeeCode,
//         role:user.role,
//         authorization: token,
//       });
//     }
//   }

//   async login(req, res) {

    
//   const uniqueid=req.body.uniqueid
//   const password=req.body.password;
//   const body=req.body

//   const result=await this.userRepo.signIn(uniqueid,password);
//   res.send(result);

  //   const result = await this.userRepo.findByEmployeeCode(
  //     req.body.employeeCode
  //   );
  //   if (!result) {
  //     return res.status(404).send("Employee Already Exist ");
  //   }
  //   // create token
  //   else {
  //     // comparing password with the hashed password
  //     const output = await bcrypt.compare(req.body.password, result.password);
  //     if (output) {
  //       const token = jwt.sign(
  //         {
  //           userID: result.id,
  //           userEmail: result.email,
  //           role:user.role,
  //         },
  //         process.env.JWT_SECRET_TEACHER,
  //         {
  //           expiresIn: "10h",
  //         }
  //       );
  //       //send token

  //       return res.status(200).send({
  //         name: result.name,
  //         employeeCode: result.employeeCode,
  //         role:user.role,
  //         authorization: token,
  //       });
  //     } else {
  //       return res.status(400).send("Incorrect Credentials.");
  //     }
  //   }


  }
}
