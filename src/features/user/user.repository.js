import { getDB } from "../../config/MySQL.js";
import subjectRepository from "../subject/subject.repositary.js";
import branchRepository from "../branch_sub/branch.repositary.js";

export default class userRepository {
  constructor() {
    this.collection = "User";
    this.subjectRepo = new subjectRepository();
    this.branchRepo = new branchRepository();
  }

  // Sign-in method with password comparison and role-based logic
  async signIn(uniqueID, password) {
    try {
      const db = getDB(); // Get MySQL connection

      // Query to fetch the user by uniqueID
      const [rows] = await db.execute("SELECT * FROM users WHERE uniqueid=?", [uniqueID]);

      if (rows.length === 0) {
        return "USER NOT FOUND"; // No user with that uniqueID
      }

      return result.rows[0];
      // if (result.rowCount > 0) {
      //   return result;
      //   const user = result.rows[0];
      //   const storedpassword = user.password;

      //   // console.log(password);
      //   // console.log(storedpassword);

      //   if (password === storedpassword) {
      //     return user;
      //     const role = user.role;
      //     //  return "login succesful";
      //     if (role === "Student") { 
          


      //       ///////
      //       const branch_name = user.branch;
      //       const year = user.year;
      //       const subjects = await this.branchRepo.fetchSubjects(branch_name, year);
      //       const faculties = await this.subjectRepo.fetchfaculties(subjects);
      //       console.log("Subjects outside:", subjects);
      //       console.log("faculties:", faculties);
      //       return "feedback", { subjects, faculties };
      //     } else {
      //       return "dashboard";
      //     }
      //   } else {
      //     return "INCORRECT LOGIN CREDENTIALS";
      //   }
      // } else {
      //   return "USER NOT FOUND";
      // }
    } catch (e) {
      // throw new ApplicationError("something went wrong", 500);
      console.log(e);
    }
  }

  // Fetch user by uniqueID
  async findByUniqueID(uniqueid) {
    try {
      const db = await getDB(); // Get MySQL connection from the pool
      const [rows] = await db.execute("SELECT * FROM users WHERE uniqueid=?", [uniqueid]);

      if (rows.length > 0) {
        return rows[0];  // Return the first user row (uniqueID should be unique)
      } else {
        console.log("User not found with uniqueid:", uniqueid);
        return null;  // Return null if user not found
      }
    } catch (error) {
      console.error("Error fetching user by uniqueid:", error);
      throw new Error("Error fetching user details");
    }
  }
}
