import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const baseUrl = "http://localhost:3000/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", department: "" });
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${baseUrl}/employees`);
      setEmployees(res.data);
    } catch {
      toast.error("❌ Failed to fetch employees");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
<div className="form-wrapper d-flex justify-content-center">
  <div className="card shadow-lg p-4 mb-5 border-0 rounded-4 form-card">
    {/* ...form content stays the same... */}
  </div>
</div>

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department) {
      return toast.warning("⚠️ Please fill all fields");
    }

    try {
      if (editId) {
        await axios.put(`${baseUrl}/employees/${editId}`, form);
        toast.success("✅ Employee updated");
      } else {
        await axios.post(`${baseUrl}/employees`, form);
        toast.success("✅ Employee added");
      }
      setForm({ name: "", email: "", department: "" });
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.error || "❌ Submission failed";
      toast.error(msg);
    }
  };

  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, department: emp.department });
    setEditId(emp._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/employees/${id}`);
      toast.info("🗑️ Employee deleted");
      fetchEmployees();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await axios.get(`${baseUrl}/employees/${searchId}`);
      setEmployees([res.data]);
    } catch {
      toast.warning("⚠️ Employee not found");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-center mb-4 text-primary fw-bold">
     Employee Management System
      </h2>

      {/* Form */}
      <div className="card shadow-lg p-4 mb-5 border-0 rounded-4">
        <h5 className="mb-3">{editId ? "✏️ Update Employee" : "➕ Add New Employee"}</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <input
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              name="email"
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              name="department"
              className="form-control"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 text-end">
            <button
              type="submit"
              className={`btn ${editId ? "btn-warning" : "btn-success"} me-2 px-4`}
            >
              {editId ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => {
                setForm({ name: "", email: "", department: "" });
                setEditId(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by MongoDB ID"
          className="form-control"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearchById}>
          🔍 Search
        </button>
        <button className="btn btn-dark" onClick={fetchEmployees}>
          🔄 Show All
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>👤 Name</th>
              <th>📧 Email</th>
              <th>🏢 Department</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td className="text-break">{emp._id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(emp)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp._id)}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
