import { getDB } from "../../config/MySQL.js";

export default class branchRepository {
  constructor() {
    this.collection = "branch";
  }

  // Fetch subjects based on semester, discipline, and branch
  async fetchSubjects(semester, discipline_id, unique_id, branchName, yearValue) {
    const db = await getDB();  // Await to get MySQL connection

    try {
      // Step 1: Fetch branch_id using branchName
      const branchQuery = 'SELECT branch_id FROM branchnew WHERE branch_name = ?';
      const [branchResult] = await db.execute(branchQuery, [branchName]);

      if (branchResult.length === 0) {
        throw new Error('Branch not found');
      }

      const branch_id = branchResult[0].branch_id;
      console.log('Branch ID:', branch_id);  // Log branch ID

      // Step 2: Get all subjects for the branch, discipline, and semester from subjectnew
      const subjectsQuery = `
        SELECT sn.subject_id, sn.name, sf.is_elective
        FROM subjectnew sn
        LEFT JOIN subject_faculty sf ON sn.subject_id = sf.subject_id
        WHERE sn.branch_id = ? AND sn.discipline_id = ? AND sn.semester = ?
      `;
      const [subjectsResult] = await db.execute(subjectsQuery, [branch_id, discipline_id, semester]);

      console.log('Subjects Result:', subjectsResult);  // Log subject query results

      if (subjectsResult.length === 0) {
        throw new Error('No subjects found for the given branch, discipline, and semester');
      }

      const subjectsArray = [];

      // Add non-elective subjects to the array
      subjectsResult.forEach((subject) => {
        if (!subject.is_elective) {
          subjectsArray.push(subject.name);
        }
      });
      console.log(unique_id);

      // Step 3: Fetch student-specific elective subjects from student_subject
      const studentSubjectsQuery = `
        SELECT subject_1, subject_2, subject_3, subject_4, subject_5
        FROM student_subject
        WHERE unique_id = ?
      `;
      const [studentSubjectsResult] = await db.execute(studentSubjectsQuery, [unique_id]);

      console.log('Student Subjects Result:', studentSubjectsResult);  // Log student subject query results

      // Add non-null student-specific subjects to the array
      if (studentSubjectsResult.length > 0) {
        studentSubjectsResult.forEach((row) => {
          Object.values(row).forEach((subject) => {
            if (subject) {
              subjectsArray.push(subject);
            }
          });
        });
      }

      // Return the complete subjects array
      return subjectsArray;
    } catch (err) {
      console.error('Error fetching subjects:', err);
      throw new Error('Error fetching subjects');
    }
  }
}
