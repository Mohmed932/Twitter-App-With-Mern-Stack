import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decodeed = await jwt.verify(token, process.env.SCRECT_KEY);
    req.user = decodeed;
    next();
  } catch (error) {
    return res.json({ message: `Token verification failed: ${error}` });
  }
};
