const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token available!" });

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    req.body.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access Denied. Invalid token!" });
  }
};

module.exports = authMiddleware;
