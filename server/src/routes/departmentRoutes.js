// departmentRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const auth = require("../middleware/auth");
const upload = multer();

// Define routes for user operations

// view all department------------------------------------------------------------------
router.get("/department", auth, (req, res) => {
  // db.query(
  //   "SELECT * FROM department WHERE user_id = ?",
  //   [req.user_id],
  //   (err, results) => {
  //     if (err) {
  //       res
  //         .status(500)
  //         .send({ status: false, data: err, message: "Internal Server Error" });
  //     }
  //     if (!err) {
  //       if (results.length === 0) {
  //         res.json({
  //           status: false,
  //           data: results,
  //           message: "No department",
  //         });
  //       }
  //       if (results.length !== 0) {
  //         res.json({
  //           status: true,
  //           data: results,
  //           message: "data retrive success",
  //         });
  //       }
  //     }
  //   }
  // );

  const q = `SELECT department.id, department.name, employee.id AS employee_id, employee.first_name, employee.last_name, employee.email, employee.whatsApp_number, employee.calling_number, employee.aadhaar_number, employee.current_address, employee.permanent_address, employee.education, employee.photo
  FROM department
  LEFT JOIN employee ON department.incharge = employee.id
  WHERE department.user_id = ?
  ORDER BY department.id`;
  db.query(q, [req.user_id], (err, results) => {
    if (err) {
      res.status(500).json({
        status: false,
        data: err,
        message: "Internal Server Error",
      });
    }
    if (!err) {
      const convertedResultData = results.map((item) => {
        return {
          id: item.id,
          name: item.name,
          incharge: {
            id: item.employee_id,
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email,
            whatsApp_number: item.whatsApp_number,
            calling_number: item.calling_number,
            aadhaar_number: item.aadhaar_number,
            current_address: item.current_address,
            permanent_address: item.permanent_address,
            education: item.education,
            photo: item.photo,
          },
        };
      });
      res.json({
        status: true,
        data: convertedResultData,
        message: "Data retrieve success",
      });
    }
  });
});

// add department-----------------------------------------------------------------------
router.post("/department/add", auth, upload.none(), (req, res) => {
  db.query(
    "SELECT * from employee WHERE id = ? AND user_id = ?",
    [req.body.incharge, req.user_id],
    (err_find, results_find) => {
      if (err_find) {
        res.status(500).send({
          status: false,
          data: err_find,
          message: "Internal Server Error (while finding employee)",
        });
      }
      if (!err_find) {
        if (results_find.length === 0) {
          res.json({
            status: false,
            data: results_find,
            message: "Employee not found!",
          });
        }
        if (results_find.length !== 0) {
          db.query(
            "INSERT INTO department (name, incharge, user_id) VALUES (?, ?, ?)",
            [req.body.name, req.body.incharge, req.user_id],
            (err_insert, results_insert) => {
              if (err_insert) {
                res.status(500).send({
                  status: false,
                  data: err_insert,
                  message:
                    "Internal Server Error (while inserting department data )",
                });
              }
              if (!err_insert) {
                res.json({
                  status: true,
                  data: results_insert,
                  message: "Department added success",
                });
              }
            }
          );
        }
      }
    }
  );
});

// delete department---------------------------------------------------------------------
router.delete(
  "/department/delete/:department_id",
  auth,
  upload.none(),
  (req, res) => {
    db.query(
      "DELETE FROM department WHERE id = ? AND user_id = ?",
      [req.params.department_id, req.user_id],
      (err, results) => {
        if (err) {
          res.status(500).json({
            status: false,
            data: err,
            message: "Internal server error!",
          });
        }
        if (!err) {
          if (results.affectedRows === 0 && results.changedRows === 0) {
            res.json({
              status: false,
              data: results,
              message: "No Department Found!",
            });
          }
          if (results.affectedRows === 1 && results.changedRows === 0) {
            res.json({
              status: true,
              data: results,
              message: "Department deleted!",
            });
          }
        }
      }
    );
  }
);

// update department
router.post("/department/update/:id", auth, upload.none(), (req, res) => {
  q = "UPDATE department SET ? WHERE id = ?";
  db.query(q, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.json({
        status: false,
        data: err,
        message: "Internal Server Error (while finding employee)",
      });
    }
    if (!err) {
      if (!results.affectedRows) {
        res.json({
          status: false,
          data: results,
          message: "No department Found",
        });
      }
      if (results.affectedRows) {
        res.json({
          status: true,
          data: results,
          message: "Department updated Successfully",
        });
      }
    }
  });
});

module.exports = router;
