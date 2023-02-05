import {
    Box,
    Button,
    Card,
    CardContent, Container, FormHelperText,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import {DateTimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import PropTypes from 'prop-types';
import {QuillEditor} from "../../quill-editor";


export const EventGeneralSettings = (props) => {
    const {formik, ...other} = props;
    const [value, setValue] = useState(
        new Date()
    );
    const handleStartDateChange = (date) => {
        formik.setFieldValue('start', date);

        // Prevent end date to be before start date
        if (formik.values.end && date && date > formik.values.end) {
            formik.setFieldValue('end', date);
        }
    };

    const handleEndDateChange = (date) => {
        formik.setFieldValue('end', date);

        // Prevent start date to be after end date
        if (formik.values.start && date && date < formik.values.start) {
            formik.setFieldValue('start', date);
        }
    };

    const onEditorStateChange = (editorState) => {
        formik.setFieldValue('description', editorState);
    };


    return (
        <Box
            sx={{ mt: 4 }}
            {...props}>
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
                                Basic details
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
                                    error={Boolean(formik.touched.name && formik.errors.name)}
                                    fullWidth
                                    helperText={formik.touched.name && formik.errors.name}
                                    label="Event Name"
                                    name="name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    size="small"
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mt: 3,
                                    alignItems: 'center'
                                }}
                            >
                                <QuillEditor
                                    error={Boolean(formik.touched.description && formik.errors.description)}
                                    fullWidth
                                    helperText={formik.touched.description && formik.errors.description}
                                    label="Description"
                                    name="description"
                                    onChange={(e) => onEditorStateChange(e)}
                                    value={formik.values.description}
                                    multiline
                                    rows={4}
                                    sx={{
                                        height: 330,
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mt: 3,
                                    alignItems: 'center'
                                }}
                            >
                                <TextField
                                    disabled
                                    fullWidth
                                    helperText={"URL can't be changed after event creation"}
                                    name="url"
                                    value={formik.values.url}
                                    label="Url"

                                    size="small"
                                    aria-describedby="outlined-weight-helper-text"
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">@ticxz.com</InputAdornment>,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{ mt: 4 }}>
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
                                Date and time
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
                                    mt: 3,
                                    alignItems: 'center'
                                }}
                            >
                                <DateTimePicker
                                    label="Event start"
                                    ampm={false}
                                    onChange={handleStartDateChange}
                                    renderInput={(inputProps) => (
                                        <TextField
                                            fullWidth
                                            {...inputProps} />
                                    )}
                                    value={formik.values.start}
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    mt: 3,
                                    alignItems: 'center'
                                }}
                            >
                                <DateTimePicker
                                    label="Event end"
                                    ampm={false}
                                    onChange={handleEndDateChange}
                                    renderInput={(inputProps) => (
                                        <TextField
                                            fullWidth
                                            {...inputProps} />
                                    )}
                                    value={formik.values.end}
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                />
                            </Box>
                            {Boolean(formik.touched.end && formik.errors.end) && (
                                <Box sx={{ mt: 2 }}>
                                    <FormHelperText error>
                                        {formik.errors.end}
                                    </FormHelperText>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Grid
                        item
                        md={4}
                        xs={12}
                        sx={{
                            paddingBottom: 5,
                        }}
                    >
                        <Typography variant="h6">
                            Location
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.street && formik.errors.street)}
                                fullWidth
                                helperText={formik.touched.street && formik.errors.street}
                                label="Street"
                                name="street"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.street}
                                size="small"

                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.houseNumber && formik.errors.houseNumber)}
                                fullWidth
                                helperText={formik.touched.houseNumber && formik.errors.houseNumber}
                                label="House Number"
                                name="houseNumber"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.houseNumber}
                                size="small"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.postalCode && formik.errors.postalCode)}
                                fullWidth
                                helperText={formik.touched.postalCode && formik.errors.postalCode}
                                label="Postal Code"
                                name="postalCode"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.postalCode}
                                size="small"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.city && formik.errors.city)}
                                fullWidth
                                helperText={formik.touched.city && formik.errors.city}
                                label="City"
                                name="city"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.city}
                                size="small"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.state && formik.errors.state)}
                                fullWidth
                                helperText={formik.touched.state && formik.errors.state}
                                label="State/Province"
                                name="state"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.state}
                                size="small"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.country && formik.errors.country)}
                                fullWidth
                                helperText={formik.touched.country && formik.errors.country}
                                label="Country"
                                name="country"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.country}
                                size="small"
                            />
                        </Grid>
                        <Grid item />
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
EventGeneralSettings.propTypes = {
    formik: PropTypes.object
};
