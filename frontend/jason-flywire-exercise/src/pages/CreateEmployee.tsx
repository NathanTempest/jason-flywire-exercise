import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

interface EmployeeForm {
  id: string;
  name: string;
  lastName: string;
  position: string;
  hireDate: string;
  active: boolean;
  directReports: string;
}

export default function CreateEmployee() {
  const [form, setForm] = useState<EmployeeForm>({
    id: "",
    name: "",
    lastName: "",
    position: "",
    hireDate: "",
    active: true,
    directReports: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof EmployeeForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      field === "active" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const directReportsArray = form.directReports
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .map(Number);

      const payload = {
        id: Number(form.id),
        name: `${form.name} ${form.lastName}`.trim(),
        position: form.position,
        hireDate: form.hireDate,
        active: form.active,
        directReports: directReportsArray,
      };

      await axios.post("http://localhost:8080/api/employees", payload);
      setSubmitted(true);
      setError(null);
      setForm({
        id: "",
        name: "",
        lastName: "",
        position: "",
        hireDate: "",
        active: true,
        directReports: "",
      });
    } catch (err: any) {
      setError(err.response?.data || "Failed to create employee.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Employee ID"
          value={form.id}
          onChange={handleChange("id")}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="First Name"
          value={form.name}
          onChange={handleChange("name")}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          value={form.lastName}
          onChange={handleChange("lastName")}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Position"
          value={form.position}
          onChange={handleChange("position")}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Hire Date (MM/dd/yyyy)"
          value={form.hireDate}
          onChange={handleChange("hireDate")}
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.active}
              onChange={handleChange("active")}
              color="primary"
            />
          }
          label="Active"
        />
        <TextField
          fullWidth
          label="Direct Reports (comma-separated IDs)"
          value={form.directReports}
          onChange={handleChange("directReports")}
          margin="normal"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
        {submitted && (
          <Typography color="success.main" mt={2}>
            Employee created successfully!
          </Typography>
        )}
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}