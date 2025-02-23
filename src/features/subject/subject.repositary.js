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



  async fetch_firstyear_data(section) {

    const db = getDB();



    // Fetch subject_id and faculty_id for the given section

    const [rows] = await db.execute(

        "SELECT subject_id, faculty_id FROM subject_faculty WHERE section = ?",

        [section]

    );



    if (rows.length === 0) {

        return { subjects: [], faculties: [] };

    }



    const subjectIds = rows.map(row => row.subject_id);

    const facultyIds = rows.map(row => row.faculty_id);



    // Fetch subject names

    const subjectQuery = subjectIds.length > 0

        ? `SELECT subject_id, name FROM subjectnew WHERE subject_id IN (${subjectIds.join(",")})`

        : null;



    const facultyQuery = facultyIds.length > 0

        ? `SELECT id, name FROM faculty WHERE id IN (${facultyIds.join(",")})`

        : null;



    const [subjectRows] = subjectQuery ? await db.execute(subjectQuery) : [[]];

    const [facultyRows] = facultyQuery ? await db.execute(facultyQuery) : [[]];



    // Map faculty to subjects

    const faculties = rows.map(row => {

        const subject = subjectRows.find(sub => sub.subject_id === row.subject_id);

        const faculty = facultyRows.find(fac => fac.id === row.faculty_id);



        return {

            subject: subject ? subject.name : "Unknown Subject",

            Assigned_faculty: {

                id: faculty ? faculty.id : null,

                faculty_name: faculty ? faculty.name : "Unknown Faculty",

                is_elective: 0

            }

        };

    });



    return {

        subjects: subjectRows,

        faculties: faculties

    };

}







}

