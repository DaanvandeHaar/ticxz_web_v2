import NextLink from 'next/link';
import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import { Box, Button, Container, Rating, Stack, SvgIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { paths } from '../../paths';
import { HomeCodeSamples } from './home-code-samples';
import {TypeAnimation} from "react-type-animation";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import UserPlus02Icon from "@untitled-ui/icons-react/build/esm/UserPlus02";
import {UserPlus01, UserRight01} from "@untitled-ui/icons-react";

export const HomeHero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: '120px'
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="sm">
          <Typography
            variant="h1"
            sx={{ mb: 2 }}
          >
            Let us worry about&nbsp;
            <Typography
              component="span"
              color="primary.main"
              variant="inherit"
            >
              Selling Tickets
            </Typography>
            , you focus on your&nbsp;
              <Typography
                  component="span"
                  variant="inherit"
              >
                  <TypeAnimation
                      sequence={[
                          'Event',
                          4000,
                          'Conference',
                          2000,
                          'Concert',
                          1000,
                          'Expo',
                          1000,
                          'Seminar',
                          1000,
                          'Dance night',
                          2000,
                          'Festival',
                          1000,
                          'Improv',
                          2000,
                      ]}
                      cursor={true}
                      repeat={Infinity}
                  />
              </Typography>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 20,
              fontWeight: 500
            }}
          >
            Sell tickets to your event with our easy to use ticketing platform. No setup fees, no hidden costs.
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={1}
            sx={{ my: 3 }}
          >
            <Rating
              readOnly
              value={4.7}
              precision={0.1}
              max={5}
            />
            <Typography
              color="text.primary"
              variant="caption"
              sx={{ fontWeight: 700 }}
            >
              4.7/5
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              based on (70+ reviews)
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Button
              component={NextLink}
              href={paths.auth.firebase.register}
              startIcon={(
                <SvgIcon fontSize="small">
                  <UserPlus01 />
                </SvgIcon>
              )}
              sx={(theme) => theme.palette.mode === 'dark'
                ? {
                  backgroundColor: 'neutral.50',
                  color: 'neutral.900',
                  '&:hover': {
                    backgroundColor: 'neutral.200'
                  }
                }
                : {
                  backgroundColor: 'neutral.900',
                  color: 'neutral.50',
                  '&:hover': {
                    backgroundColor: 'neutral.700'
                  }
                }}
              variant="contained"
            >
              Sign Up
            </Button>
            <Button
              color="inherit"
              component={NextLink}
              href={paths.dashboard.index}
              startIcon={(
                <SvgIcon fontSize="small">
                  <UserRight01 />
                </SvgIcon>
              )}
            >
              Sign In
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            pt: '120px',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              width: '90%',
              fontSize: 0,
              mt: -2,
              mx: -2,
              pt: 2,
              px: 2,
              '& img': {
                borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2.5,
                borderTopRightRadius: (theme) => theme.shape.borderRadius * 2.5,
                boxShadow: 16,
                width: '100%'
              }
            }}
          >
            <img
              src={theme.palette.mode === 'dark'
                ? '/assets/home-thumbnail-dark.png'
                : '/assets/home-thumbnail-light.png'}
            />
          </Box>
          <Box
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'absolute',
              right: 0,
              top: 40,
              '& > div': {
                height: 460,
                width: 560
              }
            }}
          >
            <HomeCodeSamples />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
