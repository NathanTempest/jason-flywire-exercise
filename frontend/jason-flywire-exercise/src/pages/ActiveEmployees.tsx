import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography
} from '@mui/material';

interface Employee {
  id: number;
  name: string;
  lastName: string;
  position: string;
  hireDate: string;
  active: boolean;
  directReports: number[];
}

const ActiveEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    api.get<Employee[]>('employees/active')
      .then((response) => {
        const sorted = response.data.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        setEmployees(sorted);
      })
      .catch((error) => {
        console.error('Failed to fetch active employees:', error);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <Typography variant="h4" gutterBottom>Active Employees</Typography>

      {employees.length === 0 ? (
        <Typography>No active employees found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(3px)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Position</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hire Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell sx={{ color: 'white' }}>{emp.id}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{emp.name}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{emp.position}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{emp.hireDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ActiveEmployees;