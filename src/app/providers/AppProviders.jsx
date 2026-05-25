import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@app/theme';
import { AuthProvider } from './AuthProvider';
import { SessionProvider } from './SessionProvider';

const AppProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
