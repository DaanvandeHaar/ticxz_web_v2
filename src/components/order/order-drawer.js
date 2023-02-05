import {useState} from 'react';
import PropTypes from 'prop-types';
import {format} from 'date-fns';
import numeral from 'numeral';
import {
    Box,
    Button,
    Divider,
    Drawer, Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import {styled} from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {Scrollbar} from "../scrollbar";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
const statusOptions = [
    {
        label: 'Pending',
        value: 0
    },
    {
        label: 'Complete',
        value: 1
    },
    {
        label: 'Failed',
        value: 2
    },
    {
        label: 'Refund',
        value: 3
    }
];

const statusMap = {
    0: 'Pending',
    1: 'Complete',
    2: 'Failed',
    3: 'Refund',
}


const OrderPreview = (props) => {
    const {lgUp, onApprove, onEdit, onReject, order} = props;
    const align = lgUp ? 'horizontal' : 'vertical';

    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.100',
                    borderRadius: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2.5
                }}
            >
                <Typography
                    color="textSecondary"
                    sx={{mr: 2}}
                    variant="overline"
                >
                    Actions
                </Typography>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        m: -1,
                        '& > button': {
                            m: 1
                        }
                    }}
                >
                    <Button
                        onClick={onApprove}
                        size="small"
                        variant="contained"
                    >
                        Resend Email
                    </Button>
                    <Button
                        onClick={onApprove}
                        size="small"
                        variant="contained"
                        color="error"
                    >
                        Refund
                    </Button>
                    <Button
                        onClick={onEdit}
                        size="small"
                        startIcon={(
                            <EditIcon fontSize="small"/>
                        )}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>
            <Typography
                sx={{my: 3}}
                variant="h6"
            >
                Details
            </Typography>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="ID"
                    value={order.orderId}
                />
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="E-mail"
                    value={order.orderEmail}
                />
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="Customer"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        {order.billingInfo.firstName} {' '} {order.billingInfo.lastName}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        {order.billingInfo.street} {' '} {order.billingInfo.houseNumber}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        {order.billingInfo.city}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="body2"
                    >
                        {order.billingInfo.country}
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="Date"
                    value={order.orderDate}
                />
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="Promotion Code"
                    value={''}
                />
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="Total Amount"
                    value={`€ ${order.total}`}
                />
                <PropertyListItem
                    align={align}
                    disableGutters
                    label="Status"
                    value={statusMap[order.status]}
                />
            </PropertyList>
            <Divider sx={{my: 3}}/>
            <Typography
                sx={{my: 3}}
                variant="h6"
            >
                Tickets
            </Typography>
            <Scrollbar>
                <Table sx={{minWidth: 400}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Fees
                            </TableCell>
                            <TableCell>
                                Total
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(order.tickets || []).map((ticket) => (
                            <TableRow key={ticket.ticketId}>
                                <TableCell>
                                    {ticket.ticketTypeName}
                                </TableCell>
                                <TableCell>
                                    {ticket.ticketFees}
                                </TableCell>
                                <TableCell>
                                    {numeral(ticket.ticketTotal).format(`€ 0,0.00`)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>
        </>
    );
};

const OrderForm = (props) => {
    const {onCancel, onSave, order} = props;

    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.100',
                    borderRadius: 1,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2.5
                }}
            >
                <Typography
                    variant="overline"
                    sx={{mr: 2}}
                    color="textSecondary"
                >
                    Order
                </Typography>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        m: -1,
                        '& > button': {
                            m: 1
                        }
                    }}
                >
                    <Button
                        color="primary"
                        onClick={onSave}
                        size="small"
                        variant="contained"
                    >
                        Save changes
                    </Button>
                    <Button
                        onClick={onCancel}
                        size="small"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
            <Typography
                sx={{my: 3}}
                variant="h6"
            >
                Details
            </Typography>
            <TextField
                disabled
                fullWidth
                label="ID"
                margin="normal"
                name="id"
                value={order.orderId}
            />
            <TextField
                disabled
                fullWidth
                label="Date"
                margin="normal"
                name="date"
                value={format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
            />
            <Grid container columnSpacing={0}>
                <Grid xs={5}>
                    <TextField
                        fullWidth
                        label="First name"
                        margin="normal"
                        name="firstName"
                        value={order.billingInfo.firstName}
                    />
                </Grid>
                <Grid xs={7}>
                    <TextField
                        fullWidth
                        label="Last name"
                        margin="normal"
                        name="lastName"
                        value={order.billingInfo.lastName}
                    />
                </Grid>
            </Grid>
            <Grid container columnSpacing={0}>
                <Grid xs={9}>
                    <TextField
                        fullWidth
                        label="Street"
                        margin="normal"
                        name="street"
                        value={order.billingInfo.street}
                    />
                </Grid>
                <Grid xs={3}>
                    <TextField
                        fullWidth
                        label="House Number"
                        margin="normal"
                        name="houseNumber"
                        value={order.billingInfo.houseNumber}
                    />
                </Grid>
            </Grid>
            <TextField
                fullWidth
                label="Country"
                margin="normal"
                name="country"
                value={order.billingInfo.country}
            />
            <TextField
                fullWidth
                label="State/Region"
                margin="normal"
                name="state_region"
                value={order.billingInfo.city}
            />
            <TextField
                fullWidth
                label="Total Amount"
                margin="normal"
                name="amount"
                disabled
                value={order.total}
            />
            <TextField
                fullWidth
                label="Status"
                margin="normal"
                name="status"
                select
                disabled
                SelectProps={{native: true}}
                value={statusOptions[order.status]}
            >
                {statusOptions.map((statusOption) => (
                    <option
                        key={statusOption.value}
                        value={statusOption.value}
                    >
                        {statusOption.label}
                    </option>
                ))}
            </TextField>
        </>
    );
};

const OrderDrawerDesktop = styled(Drawer)({
    width: 500,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        position: 'relative',
        width: 500
    }
});

const OrderDrawerMobile = styled(Drawer)({
    flexShrink: 0,
    maxWidth: '100%',
    height: 'calc(100% - 64px)',
    width: 500,
    '& .MuiDrawer-paper': {
        height: 'calc(100% - 64px)',
        maxWidth: '100%',
        top: 64,
        width: 500
    }
});

export const OrderDrawer = (props) => {
    const {containerRef, onClose, open, order, ...other} = props;
    const [isEditing, setIsEditing] = useState(false);
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
    // content if an order is not passed.
    const content = order
        ? (
            <>
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography
                        color="inherit"
                        variant="h6"
                    >
                        {order.number}
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={onClose}
                    >
                        <XIcon fontSize="small"/>
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        px: 3,
                        py: 4
                    }}
                >
                    {!isEditing
                        ? (
                            <OrderPreview
                                onApprove={onClose}
                                onEdit={handleEdit}
                                onReject={onClose}
                                order={order}
                                lgUp={lgUp}
                            />
                        )
                        : (
                            <OrderForm
                                onCancel={handleCancel}
                                onSave={handleCancel}
                                order={order}
                            />
                        )}
                </Box>
            </>
        )
        : null;

    if (lgUp) {
        return (
            <OrderDrawerDesktop
                anchor="right"
                open={open}
                SlideProps={{container: containerRef?.current}}
                variant="persistent"
                {...other}>
                {content}
            </OrderDrawerDesktop>
        );
    }

    return (
        <OrderDrawerMobile
            anchor="right"
            ModalProps={{container: containerRef?.current}}
            onClose={onClose}
            open={open}
            SlideProps={{container: containerRef?.current}}
            variant="temporary"
            {...other}>
            {content}
        </OrderDrawerMobile>
    );
};

OrderDrawer.propTypes = {
    containerRef: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    order: PropTypes.object
};