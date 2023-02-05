import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Typography
} from '@mui/material';

const calculateAmounts = (products) => {
    const shippingTax = 12;
    const subtotal = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);
    const total = shippingTax + subtotal;

    return {
        shippingTax,
        subtotal,
        total
    };
};

export const OrderSummary = (props) => {
    const { basket, event, handleGoToCheckout, onQuantityChange, products = [], ...other } = props;
    const { shippingTax, subtotal, total } = calculateAmounts(products);

    const formattedShippingTax = numeral(shippingTax).format('$00.00');
    const formattedSubtotal = numeral(subtotal).format('$00.00');
    const formattedTotal = numeral(total).format('$00.00');

    const calculateTotal = (subTotal, fees) => {
        return numeral(parseFloat(subTotal) + parseFloat(fees)).format('00.00')
    }

    return (
        <Card
            variant="outlined"
            sx={{ p: 3, mb: 2 }}
            {...other}>
            <Typography variant="h6">
                Order Summary
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="subtitle2">
                    Subtotal
                </Typography>
                <Typography variant="subtitle2">
                    {basket ? `€ ${basket.subTotal}`: '€ 0.00' }
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="subtitle2">
                    Fees
                </Typography>
                <Typography variant="subtitle2">
                    {basket ? `€ ${basket.fees}`: '€ 0.00' }
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="subtitle2">
                    Total
                </Typography>
                <Typography variant="subtitle2">
                    { basket ? calculateTotal(basket?.subTotal, basket?.fees) : '€ 0.00' }
                </Typography>
            </Box>
            <Box sx={{mt: 2, alignContent: 'right'}}>
                <Button onClick={handleGoToCheckout} color="primary" variant="contained">
                    Checkout
                </Button>
            </Box>
        </Card>
    );
};

OrderSummary.propTypes = {
    basket: PropTypes.object,
    handleGoToCheckout: PropTypes.func,
    onQuantityChange: PropTypes.func,
    // @ts-ignore
    products: PropTypes.array
};