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
  Checkbox,
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

const TOP_NAV_HEIGHT = 64;
const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { returnTo } = useParams();
  const { issuer, createUserWithEmailAndPassword, signInWithGoogle } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      policy: true,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
          .string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
      password: Yup
          .string()
          .min(7)
          .max(255)
          .required('Password is required'),
      confirmPassword: Yup
          .string()
          .min(7)
          .max(255)
          .required('Password is required'),
      policy: Yup
          .boolean()
          .oneOf([true], 'This field must be checked')
    }),
    onSubmit: async (values, helpers) => {
      await createUserWithEmailAndPassword(values.email, values.password, values.confirmPassword).then(response => {
        if (isMounted()) {
          router.push(returnTo || paths.dashboard.index);
        }
      }).catch(err => {
        console.error(err);

        if (isMounted()) {
          console.log(err)
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      })

    }
  });


  usePageView();

  return (
    <>
      <Head>
        <title>
          Register | Devias Kit PRO
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
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href={paths.auth.firebase.login}
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            )}
            sx={{ pb: 0 }}
            title="Register"
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
                <TextField
                    error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    fullWidth
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    label="confirmPassword"
                    margin="normal"
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.confirmPassword}
                />
              </Stack>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  ml: -1,
                  mt: 1
                }}
              >
                <Checkbox
                  checked={formik.values.policy}
                  name="policy"
                  onChange={formik.handleChange}
                />
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  I have read the
                  {' '}
                  <Link
                    component="a"
                    href="#"
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              </Box>
              {!!(formik.touched.policy && formik.errors.policy) && (
                <FormHelperText error>
                  {formik.errors.policy}
                </FormHelperText>
              )}
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
                  Register
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            <div>
              <b>Ticket buyers don&apost need to sign in!</b>
            </div>
          </Alert>
        </Box>
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
