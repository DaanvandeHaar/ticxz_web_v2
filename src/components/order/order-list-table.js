import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import {SeverityPill} from "../severity-pill";

const severityMap = {
    1: 'success',
    0: 'info',
    3: 'warning',
    2: 'error'
};

const statusMap = {
    0: 'Pending',
    1: 'Complete',
    2: 'Failed',
    3: 'Refund',
}

export const OrderListTable = (props) => {
    const {
        onOpenDrawer,
        onPageChange,
        onRowsPerPageChange,
        orders,
        ordersCount,
        page,
        rowsPerPage,
        ...other
    } = props;

    return (
        <div {...other}>
            <Table>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            hover
                            key={order.orderId}
                            onClick={() => onOpenDrawer?.(order.orderId)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                                            ? 'neutral.800'
                                            : 'neutral.200',
                                        borderRadius: 2,
                                        maxWidth: 'fit-content',
                                        ml: 3,
                                        p: 1
                                    }}
                                >
                                    <Typography
                                        align="center"
                                        variant="subtitle2"
                                    >
                                        {format(new Date(order.orderDate), 'LLL').toUpperCase()}
                                    </Typography>
                                    <Typography
                                        align="center"
                                        variant="h6"
                                    >
                                        {format(new Date(order.orderDate), 'd')}
                                    </Typography>
                                </Box>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2">
                                        {'ID: '}{order.orderId}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        variant="body2"
                                    >
                                        Total of
                                        {' '}
                                        {numeral(order.total).format(`€ 0,0.00`)}
                                    </Typography>
                                    <Typography
                                        color="primary"
                                        variant="body2"
                                    >
                                        {order.orderEmail}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell align="right">
                                <SeverityPill color={severityMap[order.status] || 'warning'}>
                                    {statusMap[order.status]}
                                </SeverityPill>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={ordersCount}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
};

OrderListTable.propTypes = {
    onOpenDrawer: PropTypes.func,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    orders: PropTypes.array.isRequired,
    ordersCount: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};