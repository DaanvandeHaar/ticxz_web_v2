import { Box } from '@mui/material';
import { Logo } from './logo';

export const SplashScreen = () => (
  <Box
      sx={{
          alignItems: 'center',
          backgroundColor: 'neutral.900',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'center',
          left: 0,
          p: 3,
          position: 'fixed',
          top: 0,
          width: '100vw',
          zIndex: 2000
      }}
  >
    <Box
      sx={{
        display: 'inline-flex',
          height: {xs: 250, lg: 400},
          width: {xs: 250, lg: 400},
      }}
    >
      <Logo />
    </Box>
  </Box>
);
