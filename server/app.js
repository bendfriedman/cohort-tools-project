const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts = require("./cohorts.json");
//const students = require("./students.json");
const StudentModel = require("./models/Student.model");
const CohortModel = require("./models/Cohort.model");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
const cors = require("cors");
mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then((x) => console.log(`connect success :"${x.connections[0].name}"`))
  .catch((err) => console.log("error while trying connect to DB", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHORTS ROUTES
app.get("/api/cohorts", (req, res) => {
  CohortModel.find({})
    .then((cohorts) => {
      console.log("cohorts retrieved", cohorts);
      res.json(cohorts);
    })
    .catch((err) => {
      console.log("error while fetching cohorts", err);
      res.status(500).json({ err: "failed to retrieve cohorts" });
    });
});

//get cohert by Id
app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  CohortModel.findById(cohortId)
    .then((foundCohertById) => {
      res.status(200).json(foundCohertById);
      console.log("Got one cohort By the Id", foundCohertById);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "error while fetching cohort By the Id", error });
      console.log("error while fetching cohort By the Id", error);
    });
});

//cohort post
app.post("/api/cohorts", (req, res) => {
  console.log("here is the req body", req.body);
  CohortModel.create(req.body)
    .then((newCohort) => {
      console.log("new cohort added", newCohort);
      res.json({ newCohort, message: "Your cohort was created!" });
    })
    .catch((err) => console.log(err));
});

//cohert delete

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  CohortModel.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      res.status(200).json(deletedCohort);
      console.log("deleted cohort successfully", deletedCohort);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "error while deleting cohort By the Id", error });
      console.log("error while deleting cohort By the Id", error);
    });
});

//update cohort by id

app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  CohortModel.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
      console.log("updated by Id", updatedCohort);
    })
    .catch((error) => console.log(error));
});

// STUDENTS ROUTES
app.get("/api/students", (req, res) => {
  StudentModel.find({})
    .then((students) => {
      console.log("Retrieved Students", students);
      res.json(students);
    })
    .catch((error) => {
      console.log("Error while get students from DB", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

//Create a new Student
app.post("/api/students", (req, res) => {
  console.log("here is the req body", req.body);
  StudentModel.create(req.body)
    .populate("cohort")
    .then((newStudent) => {
      console.log("new stu added", newStudent);
      res.json({ newStudent, message: "Your student was created!" });
    })
    .catch((err) => console.log(err));
});

// get a specific student by id
app.get("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  StudentModel.findById(studentId)
    .populate("cohort")
    .then((foundStudent) => {
      res.status(200).json(foundStudent);
      console.log("By the Id", foundStudent);
    })
    .catch((err) => {
      res.status(500).json({ message: "error getting student by id", err });
      console.log(err);
    });
});

//get all students by cohort id
app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params;
  StudentModel.findById(cohortId)
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
      console.log(students);
    })
    .catch((err) => {
      res.status(500).json({ message: "error getting students", err });
      console.log("error getting students", err);
    });
});

//update a specific student by id
app.put("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  StudentModel.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
      console.log(updatedStudent);
    })
    .catch((err) => {
      res.status(500).json({ message: "error updating student", err });
      console.log("error updating student", err);
    });
});

// delete a specific student by id
app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params;
  StudentModel.findByIdAndDelete(studentId)
    .then((studentDeleted) => {
      res.status(204).send();
      console.log(studentDeleted);
    })
    .catch((err) => {
      res.status(500).json({ message: "error deleting student", err });
      console.log("error deleting student", err);
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
