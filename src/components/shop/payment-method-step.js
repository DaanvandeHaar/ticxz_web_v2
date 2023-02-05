import PropTypes from "prop-types";
import {
    Box,
    Button, FormControl,
    FormControlLabel, InputLabel, ListItemIcon, MenuItem, Radio,
    RadioGroup, Select,
    Stack,
    SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";
import Lock01Icon from "@untitled-ui/icons-react/build/esm/Lock01";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {IMaskInput} from "react-imask";
import FormattedInputs from "./cvc-input";
import CreditCard01Icon from "@untitled-ui/icons-react/build/esm/CreditCard01";
import {ReactComponent as IdealLogo} from '../companies-logos/logo-ideal';
import InputAdornment from "@mui/material/InputAdornment";
import {useTheme} from "@mui/material/styles";
import MaskedInput from "react-text-mask";
import {useState} from "react";


const brandIcon = {
    Mastercard: '/assets/logos/logo-mastercard.svg',
    VISA: '/assets/logos/logo-visa.svg',
    iDeal: '/assets/logos/logo-ideal.svg'
};
const idealMethods = [
    {
        label: 'ABN Amro',
        value: 'abn_amro',
        logo: '/assets/logos/logo-abn_amro.png',
    },
    {
        label: 'ASN',
        value: 'asn_bank',
        logo: '/assets/logos/logo-asn.png',
    },
    {
        label: 'Bunq',
        value: 'bunq',
        logo: '/assets/logos/logo-bunq.png',
    },
    {
        label: 'Handelsbanken',
        value: 'handelsbanken',
        logo: '/assets/logos/logo-handelsbanken.png',
    },
    {
        label: 'ING',
        value: 'ing',
        logo: '/assets/logos/logo-ing.png',
    },
    {
        label: 'KNAB',
        value: 'knab',
        logo: '/assets/logos/logo-knab.png',
    },
    {
        label: 'Rabo Bank',
        value: 'rabobank',
        logo: '/assets/logos/logo-rabo_bank.png',
    },
    {
        label: 'Revolut',
        value: 'revolut',
        logo: '/assets/logos/logo-revolut.png',
    },
    {
        label: 'Regio Bank',
        value: 'regiobank',
        logo: '/assets/logos/logo-regio_bank.png',
        fees: '0,25 + 1,4%',
    },
    {
        label: 'SNS Bank',
        value: 'sns_bank',
        logo: '/assets/logos/logo-sns.png',
        fees: '0,25 + 1,4%',
    },
    {
        label: 'Triodos Bank',
        value: 'triodos_bank',
        logo: '/assets/logos/logo-triodos.png',
    },
    {
        label: 'Van Lanschot',
        value: 'van_lanschot',
        logo: '/assets/logos/logo-van_lanschot.png',
        fees: '0,25 + 1,4%',
    },
]

const paymentMethods = [
    {
        label: 'Card',
        value: 'card',
        disabled: true,
        logoDark:  '/assets/logos/logo-visa-mastercard-dark.svg',
        logoLight: '/assets/logos/logo-visa-mastercard-light.svg',
        fees: '0,25 + 1,4%',
    },
    {
        label: 'iDEAL',
        value: 'ideal',
        disabled: true,
        logoDark:  '/assets/logos/logo-ideal.svg',
        logoLight: '/assets/logos/logo-ideal.svg',
        fees: '0,29',
    },
    {
        label: 'Bancontact',
        value: 'bancontact',
        disabled: true,
        logoDark:  '/assets/logos/logo-bancontact.svg',
        logoLight: '/assets/logos/logo-bancontact.svg',
        fees: '0,35',
    },
    {
        label: 'Giropay',
        value: 'giropay',
        disabled: true,
        logoDark:  '/assets/logos/logo-giropay.svg',
        logoLight: '/assets/logos/logo-giropay.svg',
        fees: '0,25 + 1,4%',
    }
];
const PaymentMethodView = (method) => {
    console.log(method)
    switch (method.method) {
        case 'card':
            return (
                <div>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="Name on Card"
                                name="cardOwner"
                            />
                        </Grid>
                        <Grid sm={6} />
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <MaskedInput
                                mask={[/[2,4-5]/, /[0-9]/,/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/,/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/,/[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/,/[0-9]/, /[0-9]/]}
                                guide={false}
                                render={(innerRef, props) => (
                                    <TextField
                                        fullWidth
                                        label="Card Number"
                                        name="cardNumber"
                                        {...props}
                                        inputRef={innerRef}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid sm={6} />
                        <Grid
                            xs={12}
                            sm={3}
                        >
                            <MaskedInput
                                mask={[/[0-1]/, /[0-9]/, '/', /[2-3]/, /[0-9]/]}
                                guide={false}
                                render={(innerRef, props) => (
                                    <TextField
                                        sx={{
                                            paddingBottom: 3,
                                        }}
                                        fullWidth
                                        placeholder="MM/YY"
                                        label="Expiry date"
                                        {...props}
                                        inputRef={innerRef}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={3}
                        >
                            <TextField
                                fullWidth
                                label="CVC"
                                name="cardSecurityCode"
                                inputProps={{ maxLength: 3 }}
                            />
                        </Grid>
                    </Grid>
                </div>
            );
            case 'ideal':
                return (
                    <Grid
                        container
                        xs={12}
                        sm={6}
                        sx={{
                            alignItems: 'center',
                            paddingRight: 5,
                            paddingLeft: 6,
                            padingTop: 3,
                        }}
                    >
                        <TextField
                            label="Bank"
                            select
                            fullWidth
                        >
                            {idealMethods.map((paymentMethod) => (
                                <MenuItem
                                    key={paymentMethod.value}
                                    value={paymentMethod.value}
                                >
                                    <Stack direction="row"
                                           spacing={1}>
                                        <ListItemIcon>
                                            <img width={32} height={32} src={paymentMethod.logo} alt=''/>
                                        </ListItemIcon>
                                        <Typography>
                                            {paymentMethod.label}
                                        </Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                );
    }
}
export const PaymentMethodStep = (props) => {
    const { onBack, onNext, ...other } = props;
    const theme = useTheme()
    const [paymentMethod, setPaymentMethod] = useState({
        label: 'Select payment method',
        value: 'none',
        disabled: true,
    },);

    const handlePaymentMethodChange = (event) => {
        console.log(event.target.value)
        setPaymentMethod(event.target.value);
    }
    return (
        <>
            <div>
                <Grid
                    container
                    xs={12}
                    sm={6}
                    sx={{
                        alignItems: 'center',
                        paddingRight: 5,
                        paddingLeft: 6
                    }}
                >
                    <TextField
                        sx={{ '& legend': { display: 'none' }, '& fieldset': { top: 0 },}}
                        label="Payment method"
                        onChange={handlePaymentMethodChange}
                        placeholder="Select payment method"
                        select
                        fullWidth
                    >
                        {paymentMethods.map((paymentMethod) => (
                            <MenuItem
                                key={paymentMethod.value}
                                value={paymentMethod.value}
                            >
                                <Stack direction="row"
                                       spacing={1}>
                                <ListItemIcon>
                                        <img width={35} height={30} src={theme.palette.mode === 'dark' ? paymentMethod.logoDark : paymentMethod.logoLight}/>
                                </ListItemIcon>
                                    <Typography>
                                        {paymentMethod.label}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="#10B981"
                                    >
                                        + €{paymentMethod.fees}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <PaymentMethodView method={paymentMethod}/>
            </div>
        <Box sx={{ mt: 6 }}>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            >
                <SvgIcon sx={{ color: 'success.main' }}>
                    <Lock01Icon />
                </SvgIcon>
                <Typography variant="subtitle2">
                    Secure Checkout
                </Typography>
            </Stack>
            <Stack>
            <Typography
                color="text.secondary"
                sx={{ mt: 2, paddingBottom: 3 }}
                variant="body2"
            >
                Secure checkout with Stripe
            </Typography>
            </Stack>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            >
                <Button
                    endIcon={(
                        <SvgIcon>
                            <ArrowRightIcon />
                        </SvgIcon>
                    )}
                    onClick={onNext}
                    variant="contained"
                >
                    Complete Order
                </Button>
                <Button
                    color="inherit"
                    onClick={onBack}
                >
                    Back
                </Button>
            </Stack>
        </Box>
        </>
    );
};

PaymentMethodStep.propTypes = {

};