import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Box, Container } from '@mui/material';

import ActiveEmployees from './pages/ActiveEmployees';
import EmployeeDetails from './pages/EmployeeDetails';
import HiredEmployees from './pages/HiredEmployees';
import CreateEmployee from './pages/CreateEmployee';
import DeactivateEmployee from './pages/DeactivateEmployee';

const App: React.FC = () => {
  return (
    <Router>
      <Sidebar />

      {/* 
        Background Box covers entire viewport, fixed position, behind sidebar & content.
        We'll add an overlay to darken background for better text contrast.
      */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/flywire1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1, // behind everything
          // Add a dark overlay to make text pop on blue background
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 50, 0.6)', // dark blue overlay
            zIndex: -1,
          },
        }}
      />

      {/* Content Box with margin to the left for sidebar */}
      <Box
        sx={{
          marginLeft: '20vw',
          width: '80vw',
          minHeight: '100vh',
          padding: '2rem',
          color: 'white', // make text white by default
          overflowY: 'auto',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: 'rgba(250, 250, 250, 0.2)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0,0,0,0.7)',
            color: 'white',
          }}
        >
          <Routes>
            <Route path="/" element={<ActiveEmployees />} />
            <Route path="/employee-details" element={<EmployeeDetails />} />
            <Route path="/hired-range" element={<HiredEmployees />} />
            <Route path="/create-employee" element={<CreateEmployee />} />
            <Route path="/deactivate-employee" element={<DeactivateEmployee />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;