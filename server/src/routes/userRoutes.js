// userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const multer = require("multer");
// const upload = multer();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

// register user---------------------------------------------------------------------
router.post(
  "/user/register",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  (req, res) => {
    const q =
      "INSERT INTO user (name, email, password, photo, address, contact) VALUES (?, ?, ?, ?, ?, ?)";

    const {
      name,
      email,
      password,
      //  photo,
      address,
      contact,
    } = req.body;
    const photoFilePath = req.files["photo"][0].path;
    db.query(
      q,
      [name, email, password, photoFilePath, address, contact],
      (err, results) => {
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
            message: "Data Added successfully!",
          });
        }
      }
    );
  }
);

// login user--------------------------------------------------------------------------
router.post("/user/login", upload.none(), (req, res) => {
  const q = `SELECT * FROM user WHERE email = ?`;
  db.query(q, [req.body.email], (err, results) => {
    if (err) {
      res
        .status(500)
        .send({ status: false, data: err, message: "Internal Server Error" });
    }

    if (results.length !== 0) {
      if (results[0].password === req.body.password) {
        const token = jwt.sign({ id: results[0].id }, "THIS_IS_MY_SECRET_KEY");

        const q2 = `INSERT INTO tokens (user_id, token) VALUES (?, ?);`;
        db.query(q2, [results[0].id, token], (err2, results2) => {
          if (err2) {
            res.status(500).send("Internal Server Error");
          }
          res.json({
            status: true,
            data: [{ token }],
            message: "Login successfull",
          });
        });
      }
      if (results[0].password !== req.body.password) {
        res.json({
          status: false,
          data: [],
          message: "Enter correct Password",
        });
      }
    }
    if (results.length === 0) {
      res.json({ status: false, data: results, message: "No User found" });
    }
  });
});

// user authentication-----------------------------------------------------------------
router.get("/user/authentication", auth, (req, res) => {
  if (req.user_id && req.token) {
    res.json({
      statusCode: 200,
      status: true,
      data: { user_id: req.user_id, token: req.token },
      message: "Autheticated User",
    });
  }
});

// user details by user_id------------------------------------------------------------
router.post("/user/details", auth, (req, res) => {
  db.query("SELECT * FROM user WHERE id = ?", [req.user_id], (err, results) => {
    if (err) {
      res.json({
        statusCode: 500,
        status: false,
        data: err,
        message: "Internal server error",
      });
    }
    if (!err) {
      res.json({
        statusCode: 200,
        status: true,
        data: {
          id: results[0].id,
          name: results[0].name,
          email: results[0].email,
          photo: results[0].photo,
          address: results[0].address,
          contact: results[0].contact,
          is_verified: results[0].is_verified,
        },
        message: "Data retrieve success",
      });
    }
  });
});

// update user details-----------------------------------------------------------------
router.post("/user/update", auth, upload.none(), (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = [
    "name",
    "email",
    "password",
    "photo",
    "address",
    "contact",
  ];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
  }

  const q = "UPDATE user SET ? WHERE id = ?";
  db.query(q, [req.body, req.user_id], (err, results) => {
    if (err) {
      res.json({
        status: false,
        data: err,
        message: "Internal Server Error",
      });
    }
    if (!err) {
      if (!results.affectedRows) {
        res.json({
          status: false,
          data: results,
          message: "No User Found",
        });
      }
      if (results.affectedRows) {
        res.json({
          status: true,
          data: results,
          message: "User updated Successfully",
        });
      }
    }
  });
});

module.exports = router;
