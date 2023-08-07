const jwt = require("jsonwebtoken");
const db = require("../db/db");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.query(
      "SELECT * FROM tokens WHERE token = ? AND user_id = ?",
      [token, decoded.id],
      (err, results) => {
        if (err) {
          res.json({
            statusCode: 500,
            status: false,
            data: err,
            message: "Internal Server Error",
          });
        } else {
          if (results.length === 0) {
            res.json({
              statusCode: 401,
              status: false,
              data: results,
              message: "Please Authenticate!",
            });
          }
          if (results.length !== 0) {
            req.token = token;
            req.user_id = decoded.id;
            next();
          }
        }
      }
    );
  } catch (error) {
    res.json({
      statusCode: 401,
      status: false,
      data: error,
      message: "Please Authenticate!!",
    });
  }
};
module.exports = auth;
