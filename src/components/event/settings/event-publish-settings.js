import {
    TextField,
    Box,
    Card,
    CardContent,
    Divider,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
    Snackbar, Alert, IconButton
} from '@mui/material';
import {useSelector} from "../../../store";
import {ContentCopy, Visibility} from "@mui/icons-material";
import {useRef, useState} from "react";
import PropTypes from "prop-types";
import {EventStylingSettings} from "./event-styling-settings";
import InputAdornment from "@mui/material/InputAdornment";
import toast from "react-hot-toast";
import {DeleteTicketTypeDialog} from "./delete-ticket-type-dialog";

export const EventPublishSettings = (props) => {
    const {formik, ...other} = props;
    const activeEvent = useSelector(state => state.event.activeEvent);
    const [url, setUrl] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);



    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(`ticxz.com/tickets/${activeEvent.eventId}`)
            toast.success("Copied to clipboard")

        } catch (e) {
            toast.error("Something went wrong")
        }
    }

    return (
    <Card>
        <CardContent>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <Typography variant="h6">
                        Publish
                    </Typography>
                </Grid>
                <Grid
                    item
                    md={8}
                    sm={12}
                    xs={12}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 3
                        }}
                    >
                        <div>
                            <Typography variant="subtitle1">
                                Publish event
                            </Typography>
                            <Typography
                                color="textSecondary"
                                sx={{ mt: 1 }}
                                variant="body2"
                            >
                                When this switch is checked your event will be published and ticket sales will be open.
                            </Typography>
                        </div>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={formik.values.published}
                                    name="published"
                                    onChange={formik.handleChange}
                                />
                            )}
                            label=""
                        />
                    </Box>
                </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    md={4}
                    xs={12}
                >
                    <Typography variant="h6">
                        Event url
                    </Typography>
                </Grid>
                <Grid
                    item
                    md={8}
                    xs={12}
                >
                    <Box
                        sx={{
                              display: 'flex',
                            mt: 3,
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            onChange={setUrl}
                            disabled
                            fullWidth
                            name="url"
                            size="medium"
                            sx={{
                                flexGrow: 1,
                                mr: 3,
                                borderRadius: 4
                            }}
                            color="secondary"
                            value={`ticxz.com/tickets/${activeEvent.eventId}`}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton onClick={ () => {handleCopy()}}>
                                            <ContentCopy />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
    )
};

EventPublishSettings.propTypes = {
    formik: PropTypes.object
};
