import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import api from "../api"; // ✅ Adjust the path if needed based on your folder structure

export default function EmployeesByHireDate() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMade, setSearchMade] = useState(false);

  const formatDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-");
    return `${month}/${day}/${year}`; // MM/dd/yyyy
  };

  const fetchEmployees = async () => {
    if (!start || !end) {
      setError("Please select both start and end dates.");
      setEmployees([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchMade(true);

    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);

    try {
      const res = await api.get(
        `/employees/hired?start=${encodeURIComponent(startFormatted)}&end=${encodeURIComponent(endFormatted)}`
      );
      console.log("API response:", res.data);
      const data = res.data;
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error("Unexpected response format:", data);
        setEmployees([]);
        setError("Unexpected response from server.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch employees"
      );
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Typography variant="h5" gutterBottom>
        Search Employees by Hire Date Range
      </Typography>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <TextField
          label="Start Date"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </div>

      <Button variant="contained" onClick={fetchEmployees} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </Button>

      {error && (
        <Typography color="error" style={{ marginTop: 16 }}>
          {error}
        </Typography>
      )}

      {searchMade && !loading && employees.length === 0 && !error && (
        <Typography style={{ marginTop: 16 }}>
          No employees found in this date range.
        </Typography>
      )}

      {Array.isArray(employees) && employees.length > 0 && (
        <List style={{ marginTop: 24 }}>
          {employees.map((emp) => (
            <ListItem
              key={emp.id}
              style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}
            >
              <Typography>
                <strong>{emp.name}</strong> – Hired on {emp.hireDate}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}