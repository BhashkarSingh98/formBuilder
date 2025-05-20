import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, GlobalStyles } from '@mui/material';
import Navbar from './components/Navbar';
import FormList from './components/FormList';
import FormBuilder from './components/FormBuilder';
import FormView from './components/FormView';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
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
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          width: '100%',
          left: 0,
          right: 0,
          zIndex: 1200,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '17px',
            height: '100%',
            backgroundColor: 'background.paper',
            
          }
        },
      },
    },
  },
});

const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  '#root': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative'
      }}>
        <Navbar />
        <Box component="main" sx={{ 
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}>
          <Routes>
            <Route path="/" element={<FormList />} />
            <Route path="/create" element={<FormBuilder />} />
            <Route path="/edit/:id" element={<FormBuilder />} />
            <Route path="/form/:id" element={<FormView />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
