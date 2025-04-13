import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, Container, CssBaseline, ThemeProvider, createTheme, Typography, Toolbar } from '@mui/material';
import Dashboard from './components/Dashboard';
import LLMAssistant from './components/LLMAssistant';
import Simulation from './components/Simulation';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#006064', // Darker Teal
      light: '#428e92',
      dark: '#00363a',
    },
    secondary: {
      main: '#78909c', // Blue Gray
      light: '#90a4ae',
      dark: '#546e7a',
    },
    background: {
      default: '#1a1a1a', // Slightly lighter dark background
      paper: '#242424', // Lighter paper background
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.9)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00363a', // Darkest teal
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#242424',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#242424',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.9)',
          '&.Mui-selected': {
            color: '#ffffff',
            fontWeight: 600,
          },
          minHeight: '64px',
          padding: '0 24px',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#ffffff',
          height: '3px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
        body1: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
        body2: {
          color: 'rgba(255, 255, 255, 0.9)',
        },
        h4: {
          color: '#ffffff',
          fontWeight: 600,
        },
        h5: {
          color: '#ffffff',
          fontWeight: 600,
        },
        h6: {
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderRadius: 8,
          '&.MuiButton-contained': {
            backgroundColor: '#006064',
            '&:hover': {
              backgroundColor: '#428e92',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#006064',
            color: '#ffffff',
            '&:hover': {
              borderColor: '#428e92',
              backgroundColor: 'rgba(0, 96, 100, 0.1)',
            },
          },
        },
      },
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
            <Toolbar sx={{ px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <AccountBalanceIcon sx={{ fontSize: 32, mr: 1, color: 'primary.light' }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  CFO Helper
                </Typography>
              </Box>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                sx={{ flexGrow: 1 }}
              >
                <Tab label="Financial Dashboard" component={Link} to="/" />
                <Tab label="AI Assistant" component={Link} to="/assistant" />
                <Tab label="Business Simulation" component={Link} to="/simulation" />
              </Tabs>
            </Toolbar>
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