// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const validator = require("validator");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/employees", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => console.log("✅ Connected to MongoDB"));

// // Schema + Model
// const employeeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       validate: [validator.isEmail, "Invalid email format"],
//     },
//     department: {
//       type: String,
//       required: [true, "Department is required"],
//     },
//   },
//   { timestamps: true }
// );

// const Employee = mongoose.model("Employee", employeeSchema);

// // Routes

// // GET all employees
// app.get("/api/employees", async (req, res) => {
//   try {
//     const employees = await Employee.find();
//     res.json(employees);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch employees" });
//   }
// });

// // GET one employee
// app.get("/api/employees/:id", async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id);
//     if (!employee) return res.status(404).json({ error: "Employee not found" });
//     res.json(employee);
//   } catch (error) {
//     res.status(400).json({ error: "Invalid employee ID" });
//   }
// });

// // POST new employee
// app.post("/api/employees", async (req, res) => {
//   try {
//     const newEmployee = new Employee(req.body);
//     await newEmployee.save();
//     res.status(201).json(newEmployee);
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ error: "Email already exists" });
//     } else if (error.name === "ValidationError") {
//       res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
//     } else {
//       res.status(500).json({ error: "Failed to create employee" });
//     }
//   }
// });

// // PUT update employee
// app.put("/api/employees/:id", async (req, res) => {
//   try {
//     const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });
//     res.json(updatedEmployee);
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
//     } else {
//       res.status(400).json({ error: "Invalid update or ID" });
//     }
//   }
// });

// // DELETE employee
// app.delete("/api/employees/:id", async (req, res) => {
//   try {
//     const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
//     if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });
//     res.json(deletedEmployee);
//   } catch (error) {
//     res.status(400).json({ error: "Invalid employee ID" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/employees", employeeRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Employee API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
