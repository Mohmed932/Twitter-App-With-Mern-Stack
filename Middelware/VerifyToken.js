import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decodeed = await jwt.verify(token, process.env.SCRECT_KEY);
    req.user = decodeed;
    // console.log();
    next();
  } catch (error) {
    return res
      .status(404)
      .json({ message: `Token verification failed: ${error}` });
  }
};
