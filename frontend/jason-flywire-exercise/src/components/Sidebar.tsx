import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Info, Group, PersonAdd, PersonRemove } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: <Home />, text: 'Active Employees', path: '/' },
  { icon: <Info />, text: 'Employee Details', path: '/employee-details' },
  { icon: <Group />, text: 'Hired Employees', path: '/hired-range' },
  { icon: <PersonAdd />, text: 'Create Employee', path: '/create-employee' },
  { icon: <PersonRemove />, text: 'Deactivate Employee', path: '/deactivate-employee' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: '20vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(9, 22, 29, 0.35)',
        color: '#ffffff',                           
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '2rem',
        backdropFilter: 'blur(10px)',               
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.5)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)', 
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 3 }} >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                color: '#ffffff',                      
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                },
              }}
            >
              <ListItemIcon sx={{ color: '#64b5f6' }}>{item.icon}</ListItemIcon> 
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;