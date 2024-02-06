import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWMyMmQ4NzE3MTNkYjllNzgxMGEyMDgiLCJ1c2VybmFtZSI6Im1vaGFtZWQiLCJlbWFpbCI6Im1vaGFtZWRAZ21haWwuY29tIiwiZ2VuZGVyIjoibWFsZSIsImRhdGVfYmlydGgiOiIyNS01LTIwMDMiLCJpbWFnZVByb2ZpbGUiOnsic291cmNlSW1hZ2UiOiJodHRwczovL2Nkbi5waXhhYmF5LmNvbS9waG90by8yMDE1LzEwLzA1LzIyLzM3L2JsYW5rLXByb2ZpbGUtcGljdHVyZS05NzM0NjBfNjQwLnBuZyIsImltYWdlSWQiOm51bGx9LCJpbWFnZUNvdmVyIjp7InNvdXJjZUltYWdlIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAxNS8xMC8wNS8yMi8zNy9ibGFuay1wcm9maWxlLXBpY3R1cmUtOTczNDYwXzY0MC5wbmciLCJpbWFnZUlkIjpudWxsfSwiaXNBZG1pbiI6ZmFsc2UsImlzQWN0aXZlIjpmYWxzZSwiaWF0IjoxNzA3MjI0NDgxfQ.F9tRPRs9VIv4GQzKnuGxcUatSDNUb_3ZzwiC_SfO5nY`;
  try {
    const decodeed = await jwt.verify(token, process.env.SCRECT_KEY);
    req.user = decodeed;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
  }
};
