import {useTheme} from "@mui/material/styles";
import {Box, Button, Container, Typography, useMediaQuery} from "@mui/material";
import {gtm} from "../../../libs/gtm";
import {useEffect} from "react";
import Head from "next/head";
import NextLink from "next/link";

const Success = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    return (
        <>
            <Head>
                <title>
                    Dashboard: Logistics Fleet | Devias Kit PRO
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexGrow: 1,
                    py: '80px'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        align="center"
                        variant={mobileDevice ? 'h4' : 'h1'}
                    >
                        You successfully added Stripe to your account
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                        variant="subtitle2"
                    >
                        You can close this page or click the button bellow to go back to the dashboard
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6
                        }}
                    >
                        <Box
                            alt="Under development"
                            component="img"
                            src={`/static/animations/onboarding_success.svg`}
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: 400
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6
                        }}
                    >
                        <NextLink
                            href="/dashboard"
                            passHref
                        >
                            <Button
                                component="a"
                                variant="outlined"
                            >
                                Back to Dashboard
                            </Button>
                        </NextLink>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Success;