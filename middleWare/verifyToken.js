import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.username = decoded.username;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
