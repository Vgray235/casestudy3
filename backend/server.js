const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let employees = [
  { id: 1, name: "Alice Johnson", email: "alice.johnson@company.com", department: "Engineering" },
  { id: 2, name: "Bob Smith", email: "bob.smith@company.com", department: "Human Resources" },
  { id: 3, name: "Carol White", email: "carol.white@company.com", department: "Marketing" }
];

let nextId = 4; // start ID after initial data

// GET all employees
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

// GET employee by ID
app.get("/api/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find(emp => emp.id === id);
  if (employee) res.json(employee);
  else res.status(404).json({ error: "Employee not found" });
});

// POST new employee
app.post("/api/employees", (req, res) => {
  const { name, email, department } = req.body;
  const newEmployee = {
    id: nextId++,
    name,
    email,
    department
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// PUT update employee
app.put("/api/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    employees[index] = { id, ...req.body };
    res.json(employees[index]);
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
});

// DELETE employee
app.delete("/api/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
    const deleted = employees.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: "Employee not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
