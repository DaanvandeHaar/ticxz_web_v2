import {useEffect, useMemo, useRef, useState} from 'react';
import Head from 'next/head';
import {
    Box,
    TextField,
    Card,
    CardContent,
    Container,
    Divider,
    FormHelperText,
    Grid,
    Typography, MenuItem, LinearProgress, Select,
} from '@mui/material';
import Button from "@mui/material/Button";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";
import {useFormik} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import InputAdornment from "@mui/material/InputAdornment";
import {useRouter} from 'next/router';
import useGoogleMapsApi from "../../../hooks/use-google-maps";
import {LocationPopover} from "../../../components/event/new/location-popover";
import {Layout as DashboardLayout} from "../../../layouts/dashboard";
import {QuillEditor} from "../../../components/quill-editor";
import {useDispatch} from "react-redux";
import {countries} from "../../../components/countries";
import {DateTimePicker} from "@mui/x-date-pickers";
import {eventApi} from "../../../api/event";
import {createEvent} from "../../../slices/event";

/* global google */


const Page = (props) => {
    const {event} = props;
    const router = useRouter();
    const initialValues = useMemo(() => {
        return {
            name: '',
            description: '',
            url: '',
            end: new Date(),
            start: new Date(),
            street: '',
            houseNumber: '',
            postalCode: '',
            city: '',
            state: '',
            country: '',
            lat: '',
            lng: '',
            submit: null,
        };
    }, []);

    const googleMapsApi = useGoogleMapsApi()
    const anchorRef = useRef(null);


    const handleLocationChange = (input) => {
        formik.setFieldValue('street', input);
        let autocompleteService = new googleMapsApi.places.AutocompleteService();
        autocompleteService.getPlacePredictions({input: input}, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(predictions)
                setLocations(predictions)
                handleOpenPopover()
            }
        })
    }

    const [formLoading, setFormLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [openPopover, setOpenPopover] = useState(false);

    const onEditorStateChange = (editorState) => {
        formik.setFieldValue('description', editorState);
    };

    const handleSetFormLoading = () => {
        setFormLoading(true)
        console.log(formLoading, new Date())
    }

    const handleSetFormLoaded = () => {
        setFormLoading(false)
        console.log(formLoading, new Date())
    }

    const handleOpenPopover = () => {
        setOpenPopover(true);
    };

    const handleClosePopover = () => {
        setOpenPopover(false);
    };


    Yup.addMethod(Yup.string, 'isUrlValid', function (message) {
        return this.test("urlValidTest", message, async function (value) {
            const {path, createError} = this;

            if (!value) {
                return createError({path, message: message ?? "url is required"})
            }
            console.log(value)
            if (value.length < 6) {
                return createError({path, message: message ?? "url must be at least 6 characters"});
            }

            if (value.length > 25) {
                return createError({path, message: message ?? "url can not be longer than 25 characters"});
            }

            if (!value.match(/^[a-z0-9_-]+$/)) {
                return createError({
                    path,
                    message: message ?? "url can only contain lower case letters, numbers and special characters: _-"
                });
            }
            if (!await eventApi.eventUrlAvailable(value).catch(() => {
                return createError({path, message: message ?? "something went wrong"});
            })) {
                return createError({path, message: message ?? "url already in use"});
            }
            value = null
            return true;
        });
    });

    const dispatch = useDispatch();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().min(6).max(256).required('Name is required'),
            description: Yup.string(6).min(6).max(5000).required('Description is required'),
            url: Yup.string().isUrlValid()
                .required('Url is required'),
            end: Yup.date().required('End date is required'),
            start: Yup.date().required('Start date is required'),
            street: Yup.string().max(255).required('Street is required'),
            houseNumber: Yup.string().max(255).required('House number is required'),
            postalCode: Yup.string().max(255).required('Postal code is required'),
            city: Yup.string().max(255).required('City is required'),
            state: Yup.string().max(255).required('State is required'),
            country: Yup.string().max(255).required('Country is required'),
            lat: Yup.number(),
            lng: Yup.number(),
        }),
        onSubmit: async (values, helpers) => {
                const data = {
                    eventName: values.name,
                    eventDescription: values.description,
                    eventCustomUrl: values.url,
                    eventStartDate: values.start,
                    eventEndDate: values.end,
                    eventAddress: {
                        street: values.street,
                        houseNumber: values.houseNumber,
                        postalCode: values.postalCode,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                        location: {
                            lat: values.latitude,
                            lng: values.longitude,
                        },
                        submit: null,
                    },

                };
                console.log(data)
                dispatch(createEvent(data)).then(() => {
                    toast.success('Event added!');
                    router.push('/dashboard/event/settings')
                }).catch((err) => {
                    console.error(err);
                    toast.error('Something went wrong!');
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    helpers.setSubmitting(false);
                })
        }
    });


    const handleStartDateChange = (date) => {
        formik.setFieldValue('start', date);

        // Prevent end date to be before start date
        if (formik.values.end && date && date > formik.values.end) {
            formik.setFieldValue('end', date);
        }
    };

    const handleEndDateChange = (date) => {
        formik.setFieldValue('end', date)

        // Prevent start date to be after end date
        if (formik.values.start && date && date < formik.values.start) {
            formik.setFieldValue('start', date);
        }
    };


    return (
        <Box>
            <Head>
                <title>
                    New event | Ticxz
                </title>
            </Head>
            <form onSubmit={formik.handleSubmit}>
                <>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 8
                        }}
                    >
                        <Container maxWidth="md">
                            <Typography variant="h4">
                                New Event
                            </Typography>
                            <Divider sx={{mb: 3}}/>
                            <Box
                                sx={{mt: 4}}
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
                                                        error={Boolean(formik.touched.url && formik.errors.url)}
                                                        fullWidth
                                                        helperText={formik.touched.url && formik.errors.url}
                                                        name="url"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.url}
                                                        label="Url"

                                                        size="small"
                                                        aria-describedby="outlined-weight-helper-text"
                                                        sx={{
                                                            flexGrow: 1,
                                                            mr: 3,
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment
                                                                position="end">@ticxz.com</InputAdornment>,
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Card sx={{mt: 4}}>
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
                                                    <Box sx={{mt: 2}}>
                                                        <FormHelperText error>
                                                            {formik.errors.end}
                                                        </FormHelperText>
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <Card sx={{mt: 4}}>
                                    {formLoading ? <Box sx={{width: '100%'}}>
                                        <LinearProgress/>
                                    </Box> : null}
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
                                                    ref={anchorRef}
                                                    error={Boolean(formik.touched.street && formik.errors.street)}
                                                    fullWidth
                                                    helperText={formik.touched.street && formik.errors.street}
                                                    label="Street"
                                                    name="street"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.street}
                                                    onChange={change => handleLocationChange(change.target.value)}
                                                    size="small"
                                                />
                                                <LocationPopover
                                                    anchorEl={anchorRef.current}
                                                    onClose={handleClosePopover}
                                                    open={openPopover}
                                                    locationArray={locations}
                                                    googleMapsApi={googleMapsApi}
                                                    formik={formik}
                                                    handleSetFormLoading={handleSetFormLoading}
                                                    handleSetFormLoaded={handleSetFormLoaded}
                                                    disableAutoFocus={true}
                                                    disableEnforceFocus={true}
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
                                                    select
                                                    error={Boolean(formik.touched.country && formik.errors.country)}
                                                    fullWidth
                                                    helperText={formik.touched.country && formik.errors.country}
                                                    label="Country"
                                                    name="country"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.country}
                                                    size="small"
                                                >
                                                    {countries.map((country) => (
                                                        <MenuItem
                                                            key={country.value}
                                                            value={country.text}

                                                        >
                                                            {country.text}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item/>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Container>
                    </Box>
                    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1, elevation: 20}}
                           elevation={3}>
                        <BottomNavigation>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <Box sx={{flexGrow: 1}}/>
                                <Button>
                                    Cancel
                                </Button>
                                <Button
                                    disabled={formik.isSubmitting}
                                    sx={{ml: 1}}
                                    type="submit"
                                    variant="contained"
                                >
                                    Confirm
                                </Button>
                            </Box>
                        </BottomNavigation>
                    </Paper>
                </>
            </form>
        </Box>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
