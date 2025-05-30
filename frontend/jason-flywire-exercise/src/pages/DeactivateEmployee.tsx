import React, { useState } from "react";
import api from "../api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";

const DeactivateEmployee: React.FC = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeactivate = () => {
    if (!id) {
      setErrorMsg("Please enter an employee ID");
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    api
      .patch(`/employees/${id}/deactivate`)
      .then((res) => setSuccessMsg(res.data))
      .catch((err) => {
        setErrorMsg(err.response?.data || "Failed to deactivate employee");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Deactivate Employee
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Employee ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleDeactivate} disabled={loading}>
          {loading ? "Processing..." : "Deactivate"}
        </Button>

        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      </Box>
    </Container>
  );
};

export default DeactivateEmployee;