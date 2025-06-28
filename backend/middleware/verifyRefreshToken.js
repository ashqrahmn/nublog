import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET;

export default function verifyRefreshToken(req, res, next) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, msg: "Missing Refresh Token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, msg: "Refresh Token has expired" });
    }
    return res
      .status(403)
      .json({ success: false, msg: "Invalid Refresh Token" });
  }
}