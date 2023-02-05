import {useState, useEffect, useMemo, useContext} from 'react';
import Head from 'next/head';
import {Alert, Box, Button, Container, Divider, Snackbar, Tab, Tabs, Typography} from '@mui/material';
import {EventGeneralSettings} from "../../../components/event/settings/event-general-settings";
import {EventStylingSettings} from "../../../components/event/settings/event-styling-settings";
import {EventTicketTypeSettings} from "../../../components/event/settings/event-ticket-settings";
import {useDispatch, useSelector} from "../../../store";
import { useRouter } from 'next/router';
import {Formik, useFormik} from "formik";
import * as Yup from "yup";
import {updateEvent} from "../../../slices/event";
import toast from "react-hot-toast";
import Paper from "@mui/material/Paper";
import {EventPublishSettings} from "../../../components/event/settings/event-publish-settings";
import BottomNavigation from "@mui/material/BottomNavigation";
import {Layout as DashboardLayout} from "../../../layouts/dashboard";
import {gtm} from "../../../libs/gtm";

const tabs = [
    { label: 'General', value: 'general' },
    { label: 'Styling', value: 'styling' },
    { label: 'Tickets', value: 'tickets' },
    { label: 'Publish', value: 'publish' },
];

const Page = () => {
    const [currentTab, setCurrentTab] = useState('general');

    const activeEvent = useSelector(state => state.event.activeEvent);


    const router = useRouter();

    useEffect(() => {
        if (Object.keys(activeEvent).length === 0) {
            router.push('/dashboard')
        }
        gtm.push({ event: 'page_view' });
    }, [activeEvent]);

    const handleTabsChange = (event, value) => {
        setCurrentTab(value);
    };
    const handleCancelChange = () => {
        router.push('/dashboard')
    };


    const initialValues = useMemo(() => {
        console.log(activeEvent);
        if (Object.keys(activeEvent).length === 0) {
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
                primary: '#FFFFFF',
                secondary: '#FFFFFF',
                published: false,
                submit: null,
            };
        } else {
            return {
                name: activeEvent.eventName,
                description: activeEvent.eventDescription,
                url: activeEvent.eventCustomUrl,
                end: activeEvent.eventEndDate,
                start: activeEvent.eventStartDate,
                street: activeEvent.eventAddress.street,
                houseNumber: activeEvent.eventAddress.houseNumber,
                postalCode: activeEvent.eventAddress.postalCode,
                city: activeEvent.eventAddress.city,
                state: activeEvent.eventAddress.state,
                country: activeEvent.eventAddress.street,
                primary: activeEvent.eventStyling.eventPrimaryColor || '#FFFFFF',
                secondary: activeEvent.eventStyling.eventSecondaryColor || '#FFFFFF',
                published: activeEvent.published || false,
                submit: null,
            };
        }

    },[activeEvent]);




    const dispatch = useDispatch();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            name: Yup.string().min(6).max(256).required('Name is required'),
            description: Yup.string(6).min(6).max(5000).required('Description is required'),
            url: Yup.string()
                .matches(/^[a-z0-9_-]+$/,'Url can only contain lower case letters, numbers and special characters: _-' )
                .max(30),
            end: Yup.date().required('End date is required'),
            start: Yup.date().required('Start date is required'),
            street: Yup.string().max(255).required('Street is required'),
            houseNumber: Yup.string().max(255).required('House number is required'),
            postalCode: Yup.string().max(255).required('Postal code is required'),
            city: Yup.string().max(255).required('City is required'),
            state: Yup.string().max(255).required('State is required'),
            country: Yup.string().max(255).required('Country is required'),
            primary: Yup.string()
                .matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Primary color must be a hex value')
                .required('Primary color is required'),
            secondary: Yup.string()
                .matches(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/, 'Secondary color must be a hex value')
                .required('Secondary color is required'),
            published: Yup.boolean().required()
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = {
                    eventName: values.name,
                    eventDescription: values.description,
                    eventStartDate: values.start,
                    eventEndDate: values.end,
                    eventAddress: {
                        street: values.street,
                        houseNumber: values.houseNumber,
                        postalCode: values.postalCode,
                        city: values.city,
                        state: values.state,
                        country: values.country,
                    },
                    eventStyling: {
                        eventPrimaryColor: values.primary,
                        eventSecondaryColor: values.secondary,
                    },
                    published: values.published,
                };

                const eventId = activeEvent.eventId;
                console.log(data, eventId)
                await dispatch(updateEvent({data, eventId}));
                toast.success('Event Updated!');

            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    const capitalizeFirstLowercaseRest = str => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleSubmitClick = (errors) => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            errorKeys.map(e => {
                toast.error(`${capitalizeFirstLowercaseRest(e.toString())} is required`)
            })
        }
    }


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Head>
                    <title>
                        Event Settings | Ticxz
                    </title>
                </Head>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography variant="h4">
                            Event Settings
                        </Typography>
                        <Tabs
                            indicatorColor="primary"
                            onChange={handleTabsChange}
                            scrollButtons="auto"
                            textColor="primary"
                            value={currentTab}
                            variant="scrollable"
                            sx={{ mt: 3 }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                />
                            ))}
                        </Tabs>
                        <Divider sx={{ mb: 3 }} />
                            {currentTab === 'general' && <EventGeneralSettings formik={formik} />}
                            {currentTab === 'styling' && <EventStylingSettings formik={formik}  />}
                            {currentTab === 'tickets' && <EventTicketTypeSettings/>}
                            {currentTab === 'publish' && <EventPublishSettings formik={formik}
                            />}
                    </Container>
                </Box>
                <Paper elevation={24}
                       sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} >
                    <BottomNavigation >
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                onClick={() => {handleCancelChange()}}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => handleSubmitClick(formik.errors)}
                                disabled={formik.isSubmitting}
                                sx={{ ml: 1 }}
                                type="submit"
                                variant="contained"
                            >
                                Update
                            </Button>
                        </Box>
                    </BottomNavigation>
                </Paper>
            </form>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
