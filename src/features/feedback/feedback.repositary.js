import { getDB } from "../../config/MySQL.js";


export default class feedbackRepository {
  constructor() {
    this.collection = "feedback";
    
  }
  
  async fetchfeedback(uniqueid) {
    
    const db=getDB();
    let feedback=[];
        const feedbackQuery = {
          text: 'SELECT * FROM feedback WHERE fac_id = $1',
          values: [uniqueid]
        };
        try{
        const feedbackRes = await db.query(feedbackQuery);
        
        const feedbacks = feedbackRes.rows;
        // feedback.push(feedbacks);
        // console.log(feedbacks);
        feedback=feedbacks;
        // console.log(feedback);
      }
      catch (err) {
        console.error('Error fetching feedback', err);
      }
    
    return feedback;
  }
}

