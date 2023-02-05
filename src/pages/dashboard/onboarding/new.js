import {useTheme} from "@mui/material/styles";
import {Box, Button, Container, Typography, useMediaQuery} from "@mui/material";
import {useRouter} from "next/router";
import Head from "next/head";
import {stripeApi} from "../../../api/stripe";
import {gtm} from "../../../libs/gtm";
import {useEffect} from "react";

const New = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter()

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    const handleOnboardClick = () => {
        stripeApi.onboardUser()
            .then((url) => {
                console.log(url)
                window.location.replace(url);
            }).catch((e) => {
            console.log(e)
            router.push("/onboarding/refresh")
        })
    }
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
                        Add Stripe to your account
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                        variant="subtitle2"
                    >
                        By adding Stripe to your account you can start accepting payments
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
                            src={`public/assets/onboarding_new.svg`}
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
                            Add Stripe
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default New;