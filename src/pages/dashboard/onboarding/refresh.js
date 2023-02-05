import Head from "next/head";
import {Box, Button, Container, Typography, useMediaQuery} from "@mui/material";
import {stripeApi} from "../../../api/stripe";
import {gtm} from "../../../libs/gtm";
import {useRouter} from "next/router";
import {useTheme} from "@mui/material/styles";
import {useEffect} from "react";

const Refresh = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter()

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    const handleOnboardClick = () => {
        stripeApi.onboardUserRefresh()
            .then((url) => {
                console.log(url)
                window.location.replace(url);
            }).catch((e) => {
            console.log(e)
        })
    }
    return (
        <>
            <Head>
                <title>
                    Dashboard: Logistics Fleet | Devias Kit PRO
                </title>
            </Head>
            {/* eslint-disable-next-line react/jsx-no-undef */}
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
                        Something went wrong
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                        variant="subtitle2"
                    >
                        Press the button bellow to try again
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
                            src={`/static/animations/onboarding_error.svg`}
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
                        <Button
                            onClick={() => handleOnboardClick()}
                            sx={{ ml: 1 }}
                            type="submit"
                            variant="contained"
                        >
                            Try Again
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Refresh;