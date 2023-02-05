import {Fragment, useCallback, useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {Scrollbar} from "../scrollbar";
import {
    Box, Button, CardContent, Divider, Grid,
    IconButton, InputAdornment,
    LinearProgress, MenuItem, Stack,
    SvgIcon, Switch,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow, TextField,
    Typography, useMediaQuery
} from "@mui/material";
import numeral from "numeral";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import Image01Icon from "@untitled-ui/icons-react/build/esm/Image01";
import {SeverityPill} from "../severity-pill";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import PropTypes from "prop-types";
import {Minus, MinusCircle, Plus, PlusCircle} from "@untitled-ui/icons-react";
import {AddCircle, RemoveCircle} from "@mui/icons-material";
import {neutral} from "../../theme/colors";
import axios from "axios";

const categoryOptions = [
    {
        label: 'Healthcare',
        value: 'healthcare'
    },
    {
        label: 'Makeup',
        value: 'makeup'
    },
    {
        label: 'Dress',
        value: 'dress'
    },
    {
        label: 'Skincare',
        value: 'skincare'
    },
    {
        label: 'Jewelry',
        value: 'jewelry'
    },
    {
        label: 'Blouse',
        value: 'blouse'
    }
];

export const TicketListTable = (props) => {
    const {
        onPageChange,
        onRowsPerPageChange,
        page,
        basket,
        ticketTypes,
        ticketTypesCount,
        rowsPerPage,
        onAddTicketToBasket,
        onRemoveTicketFromBasket,
        ...other
    } = props;
    const [currentProduct, setCurrentProduct] = useState(null);
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const buttonSize = lgUp ? 'medium' : 'medium';

    useEffect(() => {
        console.log(ticketTypes)
    }, [ticketTypes]);

    const textSizes = lgUp ? 'h6' : 'h6';
    const headerSizes = smDown ? 'body1' : 'h6';

    const handleProductClose = useCallback(() => {
        setCurrentProduct(null);
    }, []);

    const handleProductUpdate = useCallback(() => {
        setCurrentProduct(null);
        toast.success('Product updated');
    }, []);

    const handleProductDelete = useCallback(() => {
        toast.error('Product cannot be deleted');
    }, []);

    return (
        <div {...other}>
            <Scrollbar>
                <Table sx={{minWidth: 300}}>
                    <TableBody>
                        {ticketTypes.map((ticketType) => {

                            return (
                                <Fragment key={ticketType.typeId}>
                                    <TableRow
                                        key={ticketType.typeId}
                                    >
                                        <TableCell>
                                            <Stack>
                                                <Typography variant={headerSizes} noWrap>
                                                    {ticketType.typeName}
                                                </Typography>
                                                <Typography variant="caption"
                                                            color="success.main"
                                                >

                                                    {`€ ${ticketType.typePrice} + € 0,50 fee`}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" alignItems="center" spacing={0}>
                                                <IconButton size={buttonSize} color="primary" onClick={() => {
                                                    onAddTicketToBasket(ticketType.typeId)
                                                }}>
                                                    <AddCircle fontSize={buttonSize}/>
                                                </IconButton>
                                                <Typography variant={textSizes}>

                                                    {basket ? (basket.tickets.filter(function (ticket) {
                                                        return ticket.ticketTypeId === ticketType.typeId;
                                                    }).length) : 0}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => {
                                                        onRemoveTicketFromBasket(ticketType.typeId)
                                                    }}
                                                    size={buttonSize} color="disabled"
                                                    disabled={
                                                        basket ? (
                                                            !basket.tickets.filter(function (ticket) {
                                                                return ticket.ticketTypeId === ticketType.typeId;
                                                            }).length > 0
                                                        ) : true}
                                                    sx={{height: {xs: "medium", lg: "large"}}}>
                                                    <RemoveCircle fontSize={buttonSize} color={neutral[500]}/>
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant={headerSizes} noWrap>
                                                {`€ ${ticketType.typePrice}`}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
        </div>
    );
};

TicketListTable.propTypes = {
    ticketTypes: PropTypes.array.isRequired,
    ticketTypesCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    onAddTicketToBasket: PropTypes.func.isRequired,
    onRemoveTicketFromBasket: PropTypes.func.isRequired
};
