import { useCallback } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { GuestGuard } from '../../../guards/guest-guard';
import { IssuerGuard } from '../../../guards/issuer-guard';
import { useAuth } from '../../../hooks/use-auth';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as AuthLayout } from '../../../layouts/auth/classic-layout';
import { paths } from '../../../paths';
import { AuthIssuer } from '../../../sections/auth/auth-issuer';
import { Issuer } from '../../../utils/auth';
import {Logo} from "../../../components/logo";

const useParams = () => {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;

  return {
    returnTo
  };
};

const initialValues = {
  email: 'demo@devias.io',
  password: 'Password123!',
  submit: null
};

const validationSchema = Yup.object({
  email: Yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Email is required'),
  password: Yup
    .string()
    .max(255)
    .required('Password is required')
});

const TOP_NAV_HEIGHT = 64;

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { issuer, signInWithEmailAndPassword, signInWithGoogle } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await signInWithEmailAndPassword(values.email, values.password);

        if (isMounted()) {
          router.push(returnTo || paths.dashboard.index);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  const handleGoogleClick = useCallback(async () => {
    try {
      await signInWithGoogle();

      if (isMounted()) {
        router.push(returnTo || paths.dashboard.index);
      }
    } catch (err) {
      console.error(err);
    }
  }, [router, isMounted, signInWithGoogle, returnTo]);

  usePageView();

  return (
    <>
      <Head>
        <title>
          Login | Devias Kit PRO
        </title>
      </Head>
      <div>
        <Card elevation={16}>
          <Stack

              direction="row"
              spacing={2}
              sx={{
                height: TOP_NAV_HEIGHT,
                paddingTop: 5,
                paddingBottom: 10,
                alignContent: 'center',
                justifyContent: 'center',
          }}
          >
            <Box
                sx={{
                  display: 'inline-flex',
                  height: 66,
                  width: 150
                }}
            >
              <Logo />
            </Box>
          </Stack>
          <CardHeader
            subheader={(
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href={paths.auth.firebase.register}
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            )}
            sx={{ pb: 0 }}
            title="Log in"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >

              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mt: 3 }}
                >
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Log In
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Stack
          spacing={3}
          sx={{ mt: 3 }}
        >
          <Alert severity="info">
            <div>
              <b>Ticket buyers don&#39&t t need to sign in!</b>
            </div>
          </Alert>
        </Stack>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.Firebase}>
    <GuestGuard>
      <AuthLayout>
        {page}
      </AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
