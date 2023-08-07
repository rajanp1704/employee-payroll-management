const express = require("express");
const router = express.Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const bodyParser = require("body-parser");

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
// list of all employees--------------------------------------------------------------------------------
router.get("/employees", auth, (req, res) => {
  db.query(
    "SELECT * FROM employee WHERE user_id = ?",
    [req.user_id],
    (err, results) => {
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
    }
  );
});

// register employee----------------------------------------------------------------------------------
router.post(
  "/employee/register",
  auth,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar_image", maxCount: 1 },
    { name: "education_image", maxCount: 1 },
    { name: "certificate_image", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      first_name,
      last_name,
      email,
      whatsApp_number,
      calling_number,
      aadhaar_number,
      current_address,
      permanent_address,
      education,
      previous_experience,
      previous_work,
      department,
      designation,
      salary_type,
      base_pay,
      // photo,
      // aadhaar_image,
      // education_image,
      // certificate_image,
    } = req.body;
    const photoFilePath = req.files["photo"][0].path;
    const aadhaarImagePath = req.files["aadhaar_image"][0].path;
    const educationImagePath = req.files["education_image"][0].path;
    const certificateImagePath = req.files["certificate_image"][0].path;
    const q = `INSERT INTO employee (user_id, first_name, last_name, email, whatsApp_number, calling_number, aadhaar_number, current_address, permanent_address, education, previous_experience, previous_work, department, designation, salary_type, base_pay, photo, aadhaar_image, education_image, certificate_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      q,
      [
        req.user_id,
        first_name === "" ? null : first_name,
        last_name === "" ? null : last_name,
        email === "" ? null : email,
        whatsApp_number === "" ? null : whatsApp_number,
        calling_number === "" ? null : calling_number,
        aadhaar_number === "" ? null : aadhaar_number,
        current_address === "" ? null : current_address,
        permanent_address === "" ? null : permanent_address,
        education === "" ? null : education,
        previous_experience === "" ? null : previous_experience,
        previous_work === "" ? null : previous_work,
        department === "" ? null : department,
        designation === "" ? null : designation,
        salary_type === "" ? null : salary_type,
        base_pay === "" ? null : base_pay,
        // photo === "" ? null : photo,
        // aadhaar_image === "" ? null : aadhaar_image,
        // education_image === "" ? null : education_image,
        // certificate_image === "" ? null : certificate_image,
        photoFilePath === "" ? null : photoFilePath,
        aadhaarImagePath === "" ? null : aadhaarImagePath,
        educationImagePath === "" ? null : educationImagePath,
        certificateImagePath === "" ? null : certificateImagePath,
      ],
      (err, results) => {
        if (err) {
          res.status(500).send({
            status: false,
            data: err,
            message: "Internal Server Error",
          });
        }
        if (!err) {
          res.json({
            status: true,
            data: results,
            message: "Employee Register Success",
          });
        }
      }
    );
  }
);

// add attendance of employee--------------------------------------------------------------------------
router.post(
  "/employee/add-attendance/:employee_id",
  auth,
  upload.none(),
  (req, res) => {
    const {
      date,
      full_day,
      overtime,
      working_hours,
      overtime_hours,
      description,
    } = req.body;
    db.query(
      "SELECT * FROM employee WHERE user_id = ? AND id = ?",
      [req.user_id, req.params.employee_id],
      (err_find, results_find) => {
        if (err_find) {
          res.status(500).send({
            status: false,
            data: err_find,
            message: "Internal Server Error (while Finding data)",
          });
        }
        if (!err_find) {
          if (results_find.length === 0) {
            res.json({
              status: false,
              data: results_find,
              message: "Employee not found",
            });
          }
          if (results_find.length !== 0) {
            db.query(
              "INSERT INTO attendance (employee_id, date, full_day, overtime, working_hours, overtime_hours, description) VALUES (?, ?, ?, ?, ?, ?, ?);",
              [
                req.params.employee_id,
                date === "" ? null : date,
                full_day === "" ? null : full_day,
                overtime === "" ? null : overtime,
                working_hours === "" ? null : working_hours,
                overtime_hours === "" ? null : overtime_hours,
                description === "" ? null : description,
              ],
              (err_insert, results_insert) => {
                if (err_insert) {
                  if (err_insert.code === "ER_DUP_ENTRY") {
                    res.status(500).send({
                      status: false,
                      data: err_insert,
                      message:
                        "Combination of employee_id and date already exists.",
                    });
                  } else {
                    res.status(500).send({
                      status: false,
                      data: err_insert,
                      message: "Internal Server Error (while Inserting data)",
                    });
                  }
                }
                if (!err_insert) {
                  res.json({
                    status: true,
                    data: results_insert,
                    message: `Attendance added Success for employee: ${req.params.employee_id}, on date: ${date}.`,
                  });
                }
              }
            );
          }
        }
      }
    );
  }
);

// get payroll details of employees---------------------------------------------------------------------
router.post("/employee/details", auth, upload.none(), (req, res) => {
  // Query to fetch all employees and their attendance based on employee_id
  const query = `
SELECT employee.id, employee.first_name, employee.last_name, employee.email, employee.department, employee.designation, employee.salary_type, employee.base_pay, employee.photo, attendance.id AS attendance_id, attendance.date AS attendance_date, attendance.full_day AS attendance_full_day, attendance.working_hours AS attendance_working_hours, attendance.overtime AS attendance_overtime, attendance.overtime_hours AS attendance_overtime_hours, attendance.description AS attendance_description, credit_jama.id AS credit_jama_id, credit_jama.date AS credit_jama_date, credit_jama.time AS credit_jama_time, credit_jama.amount AS credit_jama_amount, credit_jama.description AS credit_jama_description, debit_upad.id AS debit_upad_id, debit_upad.date AS debit_upad_date, debit_upad.time AS debit_upad_time, debit_upad.amount AS debit_upad_amount, debit_upad.description AS debit_upad_description
FROM employee
LEFT JOIN attendance ON employee.id = attendance.employee_id
LEFT JOIN credit_jama ON employee.id = credit_jama.employee_id
LEFT JOIN debit_upad ON employee.id = debit_upad.employee_id
WHERE employee.user_id = ?
ORDER BY employee.id`;

  // Execute the query
  db.query(query, [req.user_id], (err, results) => {
    if (err) {
      // Handle the error appropriately
      res
        .status(500)
        .json({ status: false, data: err, message: "Internal server error" });
    }
    // Object to store the result
    const employeesWithAttendanceCreditDebit = [];

    // Iterate over the query results
    results.forEach((row) => {
      // Check if the employee already exists in the result object
      const existingEmployee = employeesWithAttendanceCreditDebit.find(
        (emp) => emp.id === row.id
      );

      if (existingEmployee) {
        // If the employee exists, add the attendance data to the existing employee object
        if (
          existingEmployee.attendance.every(
            (atnd) => atnd.id !== row.attendance_id
          )
        ) {
          existingEmployee.attendance.push({
            id: row.attendance_id,
            date: row.attendance_date,
            full_day: row.attendance_full_day,
            working_hours: row.attendance_working_hours,
            overtime: row.attendance_overtime,
            overtime_hours: row.attendance_overtime_hours,
            description: row.attendance_description,
          });
        }

        // Add the credit data to the existing employee object
        if (row.credit_jama_id) {
          if (
            existingEmployee.credit_jama.every(
              (crd) => crd.id !== row.credit_jama_id
            )
          ) {
            existingEmployee.credit_jama.push({
              id: row.credit_jama_id,
              date: row.credit_jama_date,
              time: row.credit_jama_time,
              amount: row.credit_jama_amount,
              description: row.credit_jama_description,
            });
          }
        }

        // Add the debit data to the existing employee object
        if (row.debit_upad_id) {
          if (
            existingEmployee.debit_upad.every(
              (dbt) => dbt.id !== row.debit_upad_id
            )
          ) {
            existingEmployee.debit_upad.push({
              id: row.debit_upad_id,
              date: row.debit_upad_date,
              time: row.debit_upad_time,
              amount: row.debit_upad_amount,
              description: row.debit_upad_description,
            });
          }
        }
      } else {
        // If the employee does not exist, create a new employee object with attendance data
        const newEmployee = {
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          department: row.department,
          designation: row.designation,
          salary_type: row.salary_type,
          base_pay: row.base_pay,
          photo: row.photo,
          attendance: [],
          credit_jama: [],
          debit_upad: [],
        };

        // Add the attendance data to the new employee object
        if (row.attendance_id) {
          newEmployee.attendance.push({
            id: row.attendance_id,
            date: row.attendance_date,
            full_day: row.attendance_full_day,
            working_hours: row.attendance_working_hours,
            overtime: row.attendance_overtime,
            overtime_hours: row.attendance_overtime_hours,
            description: row.attendance_description,
          });
        }

        // Add the credit data to the existing employee object
        if (row.credit_jama_id) {
          newEmployee.credit_jama.push({
            id: row.credit_jama_id,
            date: row.credit_jama_date,
            time: row.credit_jama_time,
            amount: row.credit_jama_amount,
            description: row.credit_jama_description,
          });
        }

        // Add the debit data to the existing employee object
        if (row.debit_upad_id) {
          newEmployee.debit_upad.push({
            id: row.debit_upad_id,
            date: row.debit_upad_date,
            time: row.debit_upad_time,
            amount: row.debit_upad_amount,
            description: row.debit_upad_description,
          });
        }

        employeesWithAttendanceCreditDebit.push(newEmployee);
      }
    });

    const partsFrom = req.body.from.split("/");
    const dateFrom = new Date(partsFrom[2], partsFrom[1] - 1, partsFrom[0]);

    const partsTo = req.body.to.split("/");
    const dateTo = new Date(partsTo[2], partsTo[1] - 1, partsTo[0]);

    employeesWithAttendanceCreditDebit.forEach((eWACD) => {
      const filteredAttendance = eWACD.attendance.filter((a) => {
        const parts = a.date.split("/");
        const date = new Date(parts[2], parts[1] - 1, parts[0]);
        return date >= dateFrom && date <= dateTo;
      });
      if (filteredAttendance.length === 0) {
        eWACD.attendance = [];
      }
      if (filteredAttendance.length !== 0) {
        eWACD.attendance = [];
        filteredAttendance.forEach((fA) => eWACD.attendance.push(fA));
      }
    });

    res.json({
      status: true,
      data: employeesWithAttendanceCreditDebit,
      message: "Success",
    });
  });
});

// update employee details------------------------------------------------------------------------------
router.post(
  "/employee/update/:employee_id",
  auth,
  upload.none(),
  (req, res) => {
    const updates = Object.keys(req.body);

    const allowedUpdates = [
      "first_name",
      "last_name",
      "email",
      "whatsApp_number",
      "calling_number",
      "aadhaar_number",
      "current_address",
      "permanent_address",
      "education",
      "previous_experience",
      "previous_work",
      "department",
      "designation",
      "salary_type",
      "base_pay",
      "photo",
      "aadhaar_image",
      "education_image",
      "certificate_image",
    ];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      res.status(404).send({ error: "Invalid updates!" });
    }

    db.query(
      "UPDATE employee SET ? WHERE id = ? AND user_id = ?",
      [req.body, req.params.employee_id, req.user_id],
      (err, results) => {
        if (err) {
          res.status(500).send({
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
              message: "Employee Not Found!",
            });
          }
          if (results.affectedRows === 1 && results.changedRows === 0) {
            res.json({
              status: false,
              data: results,
              message: "Data entered is same as stored data",
            });
          }
          if (results.affectedRows === 1 && results.changedRows === 1) {
            res.json({
              status: true,
              data: results,
              message: "Employee details updated!",
            });
          }
        }
      }
    );
  }
);

// emplyee salary--------------------------------------------------------------------------------------
router.post("/employee/salary", auth, upload.none(), (req, res) => {
  const q = "SELECT * FROM salary WHERE employee_id = ?";

  db.query(q, [req.body.employee_id], (err, results) => {
    if (err) {
      res.json({ status: false, data: err, message: "Internal server error!" });
    }
    if (!err) {
      if (results.length === 0) {
        res.json({
          status: false,
          data: results,
          message: "No employee found!",
        });
      }
      if (results.length !== 0) {
        res.json({
          status: true,
          data: results,
          message: "Data retreive success",
        });
      }
    }
  });
});

// view employee--------------------------------------------------------------------
router.post("/employee/view", auth, upload.none(), (req, res) => {
  q = `SELECT * FROM employee WHERE id = ? AND user_id = ?`;
  db.query(q, [req.body.employee_id, req.user_id], (err, results) => {
    if (err) {
      res.json({
        status: false,
        data: err,
        message: "Internal Server Error!",
      });
    }
    if (!err) {
      if (results.length === 0) {
        res.json({
          status: false,
          data: results,
          message: "No Employee found!",
        });
      }
      if (results.length !== 0) {
        res.json({
          status: false,
          data: results,
          message: "Data retreive success!",
        });
      }
    }
  });
});

module.exports = router;
