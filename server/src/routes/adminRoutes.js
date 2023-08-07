// userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const multer = require("multer");
const upload = multer();

// Define routes for admin operations

// view all users----------------------------------------------------------------------
router.post("/users", (req, res) => {
  const admin_token = req.headers.authorization.replace("Bearer ", "");
  if (admin_token !== process.env.ADMIN_TOKEN) {
    res.json({
      status: false,
      data: [],
      message: "Please Authenticate!",
    });
  }
  if (admin_token === process.env.ADMIN_TOKEN) {
    db.query("SELECT * FROM user", (err, results) => {
      if (err) {
        res
          .status(500)
          .send({ status: false, data: err, message: "Internal Server Error" });
      } else {
        res.json({
          status: true,
          data: results,
          message: "data retrive success",
        });
      }
    });
  }
});

// login admin--------------------------------------------------------------------------
router.post("/admin/login", upload.none(), (req, res) => {
  //   const q = `SELECT * FROM user WHERE email = ?`;
  //   db.query(q, [req.body.email], (err, results) => {
  //     if (err) {
  //       res
  //         .status(500)
  //         .send({ status: false, data: err, message: "Internal Server Error" });
  //     }

  //     if (results.length !== 0) {
  //       if (results[0].password === req.body.password) {
  //         const token = jwt.sign({ id: results[0].id }, "THIS_IS_MY_SECRET_KEY");

  //         const q2 = `INSERT INTO tokens (user_id, token) VALUES (?, ?);`;
  //         db.query(q2, [results[0].id, token], (err2, results2) => {
  //           if (err2) {
  //             res.status(500).send("Internal Server Error");
  //           }
  //           res.json({
  //             status: true,
  //             data: [{ token }],
  //             message: "Login successfull",
  //           });
  //         });
  //       }
  //       if (results[0].password !== req.body.password) {
  //         res.json({
  //           status: false,
  //           data: [],
  //           message: "Enter correct Password",
  //         });
  //       }
  //     }
  //     if (results.length === 0) {
  //       res.json({ status: false, data: results, message: "No User found" });
  //     }
  //   });
  if (
    req.body.email === process.env.EMAIL &&
    req.body.password === process.env.PASSWORD
  ) {
    res.json({
      status: true,
      data: [{ token: process.env.ADMIN_TOKEN }],
      message: "Login Success!",
    });
  } else {
    res.json({
      status: false,
      data: [],
      message: "Invalid credentails!",
    });
  }
});

// verify user--------------------------------------------------------------------------
router.post("/admin/user-verification", upload.none(), (req, res) => {
  const q = "UPDATE user SET is_verified = ? WHERE id = ?";

  const admin_token = req.headers.authorization.replace("Bearer ", "");
  if (admin_token !== process.env.ADMIN_TOKEN) {
    res.json({
      status: false,
      data: [],
      message: "Please Authenticate!",
    });
  }
  if (admin_token === process.env.ADMIN_TOKEN) {
    db.query(q, [req.body.is_verified, req.body.user_id], (err, results) => {
      if (err) {
        res.json({
          status: false,
          data: err,
          message: "Internal Server Error!",
        });
      }
      if (!err) {
        res.json({
          status: true,
          data: results,
          message: "Data updated Successfully!",
        });
      }
    });
  }
});

module.exports = router;
