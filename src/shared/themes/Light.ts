import { createTheme } from '@mui/material';
import '../../index.css'; // Certifique-se de que o arquivo CSS esteja importado

export const LightTheme = createTheme({
  palette: {
    primary: {
      main: '#0C68F0',
      dark: '#0C68F0',
      light: '#0C68F0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F00C95',
      dark: '#F00C95',
      light: '#F00C95',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#ffffff',
      default: '#e0e0e0',
    }
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
});
