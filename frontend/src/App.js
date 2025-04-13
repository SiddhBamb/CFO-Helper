import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import LLMAssistant from './components/LLMAssistant';
import Simulation from './components/Simulation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab label="Financial Dashboard" component={Link} to="/" />
              <Tab label="AI Assistant" component={Link} to="/assistant" />
              <Tab label="Business Simulation" component={Link} to="/simulation" />
            </Tabs>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assistant" element={<LLMAssistant />} />
              <Route path="/simulation" element={<Simulation />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 