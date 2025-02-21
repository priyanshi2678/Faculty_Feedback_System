import { getDB } from "../../config/MySQL.js";

export default class subjectRepository {
  constructor() {
    this.collection = "subject";
  }

  // Fetch faculties based on subjects and section
  async fetchfaculties(subjects, section) {
    const db = await getDB();  // Await to get MySQL connection
    let faculties = [];

    // Flatten the array if subjects is a 2D array
    const flatSubjects = subjects.flat();  // Flatten the array to remove nesting

    // Log to verify the structure of subjects
    console.log('Subjects received:', flatSubjects);

    for (const subject of flatSubjects) {
      if (typeof subject !== 'string') {
        throw new Error(`Expected a string subject but got: ${typeof subject}`);
      }

      console.log('Processing subject:', subject);

      const subjectQuery = 'SELECT subject_id FROM subjectnew WHERE name = ?';
      try {
        const [subjectRes] = await db.execute(subjectQuery, [subject]);
        if (subjectRes.length === 0) {
          throw new Error(`Subject ${subject} not found`);
        }
        const subject_id = subjectRes[0].subject_id;

        const facultyQuery = 'SELECT faculty_id, is_elective FROM subject_faculty WHERE subject_id = ?';
        const [facultyRes] = await db.execute(facultyQuery, [subject_id]);

        if (facultyRes.length === 0) {
          throw new Error(`No faculty found for subject ${subject}`);
        }

        const faculty_id = facultyRes[0].faculty_id;
        const is_elective = facultyRes[0].is_elective;

        const facultyNameQuery = 'SELECT name FROM faculty WHERE id = ?';
        const [facultyNameRes] = await db.execute(facultyNameQuery, [faculty_id]);

        if (facultyNameRes.length === 0) {
          throw new Error(`Faculty name not found for faculty_id ${faculty_id}`);
        }

        const faculty_name = facultyNameRes[0].name;

        faculties.push({
          subject,
          Assigned_faculty: {
            id: faculty_id,
            faculty_name,
            is_elective
          }
        });
      } catch (err) {
        console.error('Error fetching subjects and faculties:', err);
      }
    }

    return faculties;
  }
}
