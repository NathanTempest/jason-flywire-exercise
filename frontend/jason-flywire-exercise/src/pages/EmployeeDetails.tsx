import React, { useState } from 'react';
import api from '../api';

interface Employee {
  id: number;
  name: string;
  lastName: string;
  position: string;
  hireDate: string;
  active: boolean;
  directReports: number[];
}

const EmployeeDetails: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/employees/${employeeId}`);
      const { employee, directReportNames } = response.data;
  
      setEmployee({
        ...employee,
        directReports: directReportNames,
      });
    } catch (err) {
      setError('Failed to fetch employee details.');
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Employee Details</h1>
      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchEmployeeDetails} style={styles.button}>
          Get Details
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {employee && (
        <div style={styles.detailsBox}>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Hire Date:</strong> {employee.hireDate}</p>
          <p><strong>Status:</strong> {employee.active ? 'Active' : 'Inactive'}</p>
          <p>
            <strong>Direct Reports:</strong>{' '}
            {employee.directReports && employee.directReports.length > 0
              ? employee.directReports.join(', ')
              : 'None'}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff',
  },
  inputSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  detailsBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '1rem',
    borderRadius: '10px',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
  },
} as const;

export default EmployeeDetails;