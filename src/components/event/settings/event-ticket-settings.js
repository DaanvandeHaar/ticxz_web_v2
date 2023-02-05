import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
    Box,
    Button,
    Card,
    CardHeader, CircularProgress,
    Divider, IconButton, LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography, useMediaQuery
} from '@mui/material';
import { Scrollbar } from '../../scrollbar';
import { SeverityPill } from '../../severity-pill';
import {useCallback, useEffect, useState} from "react";
import {useDispatch} from "../../../store";
import {NewTicketTypeDialog} from "./new-ticket-type-dialog";
import {useSelector} from "react-redux";
import {getTicketTypes} from "../../../slices/event";
import {ArrowLeft, ArrowRight, FirstPage, LastPage} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {ArrowNarrowLeft, ArrowNarrowRight, Pencil01} from "@untitled-ui/icons-react";
import Trash02Icon from "@untitled-ui/icons-react/build/esm/Trash02";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import {DeleteTicketTypeDialog} from "./delete-ticket-type-dialog";
import toast from "react-hot-toast";



const labelColors = {
    true: 'success',
    soldOut: 'warning',
    false: 'error'
};

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <ArrowRight /> : <ArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <ArrowNarrowLeft /> : <ArrowNarrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export const EventTicketTypeSettings = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [deleteTicketTypeDialog, setDeleteTicketTypeDialog] = useState({
        isOpen: false,
        ticketType: null
    });
    const [dialog, setDialog] = useState({
        isOpen: false,
        ticketType: null
    });

    const activeEvent = useSelector(state => state.event.activeEvent);

    useEffect(() => {
        setLoading(true)
        dispatch(getTicketTypes(activeEvent.eventId))
            .then(() => {
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
            })
    }, [activeEvent]);

    const handleDeleteTicketType = useCallback((ticketType) => {
        if (ticketType.typeAmountUsed > 0) {
            toast.error('You cannot delete a ticket type that has already been sold');
        }
        setDeleteTicketTypeDialog({
            isOpen: true,
            ticketType: ticketType
        });
        setDialog({isOpen: false
            ,ticketType: null
        })
    }, []);

    const handleDeleteTicketTypeDialogClose = useCallback(() => {
        setDeleteTicketTypeDialog({
            isOpen: false,
            ticketType: null
        })
    }, []);

    const ticketTypes = useSelector(state => state.event.ticketTypes);


    const handleAddClick = () => {
        setDialog({
            isOpen: true
        });
    };

    const handleEditClick = (ticketType) => {
        console.log(ticketType);
        setDialog({
            isOpen: true,
            ticketType: ticketType
        });
    };


    const handleCloseDialog = () => {
        setDialog({
            isOpen: false
        });
    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ticketTypes.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                p: 3
            }}
        >
            <Card>
                <CardHeader
                    action={(
                        <Button variant="contained" onClick={() =>handleAddClick()}>
                            Add Ticket Type
                        </Button>
                    )}
                    title="Latest TicketTypes"
                />
                <Divider/>
                <Scrollbar>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sortDirection="desc">
                                    <Tooltip
                                        enterDelay={300}
                                        title="Sort"
                                    >
                                        <TableSortLabel
                                            active
                                            direction="desc"
                                        >
                                            Price
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Description
                                </TableCell>
                                <TableCell>
                                    No. For sale
                                </TableCell>
                                <TableCell>
                                    No. Sold
                                </TableCell>
                                <TableCell>
                                    Status
                                </TableCell>
                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? ticketTypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : ticketTypes
                            ).map((ticketType) => (
                                <TableRow
                                    hover
                                    key={ticketType.typeId}
                                >
                                    <TableCell>
                                        <Typography>
                                             € {numeral(ticketType.typePrice).format(`${ticketType.currency}0,0.00`)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {ticketType.typeName}
                                    </TableCell>
                                    <TableCell>
                                        {ticketType.typeDescription}
                                    </TableCell>
                                    <TableCell>
                                        {ticketType.typeAmount}
                                    </TableCell>
                                    <TableCell>
                                        {ticketType.typeAmountUsed}
                                    </TableCell>
                                    <TableCell>
                                        <SeverityPill color={labelColors[ticketType.typeActive]}>
                                            {ticketType.typeActive ? 'Active': 'Not for sale'}
                                        </SeverityPill>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleEditClick(ticketType)} >
                                            <Pencil01 fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteTicketType(ticketType)} >
                                            <Trash02Icon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                    {loading ? <LinearProgress sx={{width:'100%'}}/> : null }
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={ticketTypes.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Scrollbar>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2
                    }}
                >
                    <Button
                        endIcon={<ChevronRightIcon fontSize="small"/>}
                        size="small"
                        sx={{cursor: 'pointer'}}
                    >
                        See All
                    </Button>
                </Box>
            </Card>
            <DeleteTicketTypeDialog
                eventId={activeEvent.eventId}
                ticketType={deleteTicketTypeDialog.ticketType}
                open={deleteTicketTypeDialog.isOpen}
                onClose={handleDeleteTicketTypeDialogClose}
            />
            <NewTicketTypeDialog
                event={activeEvent}
                onAddComplete={handleCloseDialog}
                onClose={handleCloseDialog}
                onDeleteComplete={handleCloseDialog}
                onEditComplete={handleCloseDialog}
                open={dialog.isOpen}
                ticketType={dialog.ticketType}
                deleteTicketType={handleDeleteTicketType}
            />
        </Box>
    );
};
export default EventTicketTypeSettings
