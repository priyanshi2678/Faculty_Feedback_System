import jwt from "jsonwebtoken";
const jwtAuthProf = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).send("Unauthorized access");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_TEACHER);
    // const data = JSON(payload);
    // console.log(data);

    // console.log(payload.userID);
    req.userId = payload.userID;
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
  next();
};
export default jwtAuthProf;
