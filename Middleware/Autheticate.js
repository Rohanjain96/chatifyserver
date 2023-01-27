const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token
  try {
      if (
        req.headers.authorization
      ) {
      token = req.headers.authorization
      }
      //decodes token id
      const decoded = jwt.verify(token, process.env.Secret_key);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
};

module.exports = { protect };