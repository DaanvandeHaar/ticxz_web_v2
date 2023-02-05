import AlertTriangleIcon from '@untitled-ui/icons-react/build/esm/AlertTriangle';
import {Avatar, Box, Button, Container, Dialog, Paper, Stack, SvgIcon, Typography} from '@mui/material';
import PropTypes from "prop-types";
import {eventApi} from "../../../api/event";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {deleteTicketType} from "../../../slices/event";

export const DeleteTicketTypeDialog = (props) => {
    const {open, onClose, ticketType, eventId, ...other} = props;
    const dispatch = useDispatch();
    const handleDelete = async () => {
        let ticketTypeId = ticketType.typeId;
        await dispatch(deleteTicketType({eventId, ticketTypeId})).then((deleted) => {
            toast.success("Ticket type deleted")
            onClose();
        }).catch((error) => {
            console.log(error)
            toast.error("Something went wrong")
        })
    }
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <Paper elevation={12}>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        display: 'flex',
                        p: 3
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: 'error.lightest',
                            color: 'error.main'
                        }}
                    >
                        <SvgIcon>
                            <AlertTriangleIcon/>
                        </SvgIcon>
                    </Avatar>
                    <div>
                        <Typography variant="h5">
                            Delete ticket type
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{mt: 1}}
                            variant="body2"
                        >
                            Are you sure you want to delete this ticket type?
                            The ticket type will be permanently removed,
                            this can not be undone.
                        </Typography>
                    </div>
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pb: 3,
                        px: 3
                    }}
                >
                    <Button
                        onClick={onClose}
                        color="inherit"
                        sx={{mr: 2}}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        sx={{
                            backgroundColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.dark'
                            }
                        }}
                        variant="contained"
                    >
                        Delete
                    </Button>
                </Box>
            </Paper>
        </Dialog>
    );
}

DeleteTicketTypeDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    eventId: PropTypes.string.isRequired,
    ticketType: PropTypes.object.isRequired
}