import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {ErrorMessage, useFormik, yupToFormErrors} from 'formik';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button, Dialog, Divider, FormControlLabel, IconButton, Stack, Switch,
    TextField,
    Typography
} from '@mui/material';
import { createTicketType, deleteTicketType, updateTicketType } from '../../../slices/event';
import { useDispatch } from '../../../store';
import {useMemo, useState} from 'react';
import {Trash01} from "@untitled-ui/icons-react";
import CurrencyFieldText, {handleValueChange} from "../../currency-field";
import {Expand} from "@mui/icons-material";
import {DateTimePicker} from "@mui/x-date-pickers";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

export const NewTicketTypeDialog = (props) => {
    const { ticketType, event, onAddComplete, onClose, onDeleteComplete, onEditComplete, open, range } = props;
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleStartDateChange = (date) => {
        formik.setFieldValue('start', date);

        // Prevent end date to be before start date
        if (formik.values.end && date && date > formik.values.end) {
            formik.setFieldValue('end', date);
        }
    };

    const handleEndDateChange = (date) => {
        formik.setFieldValue('salesEnd', date);

        // Prevent start date to be after end date
        if (formik.values.start && date && date < formik.values.start) {
            formik.setFieldValue('salesStart', date);
        }
    };

    const initialValues = useMemo(() => {
        if (ticketType) {
            return {
                active: ticketType.typeActive || false,
                description: ticketType.typeDescription || '',
                name: ticketType.typeName || '',
                price : ticketType.typePrice || '',
                amount : ticketType.typeAmount || '',
                id: ticketType.typeId || '',
                salesStart: ticketType.salesStart || new Date(),
                salesEnd: ticketType.salesEnd || event.eventStartDate,
                maximumPerOrder: ticketType.maximumPerOrder || 4,
                submit: null
            };
        }
        return {
            active: false,
            description: '',
            name: '',
            price :  0.00,
            amount : 0,
            salesStart: new Date(),
            salesEnd: event.eventEndDate || new Date(),
            maximumPerOrder: 4,
            submit: null
        };
    }, [ticketType, range]);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            active: Yup.bool(),
            description: Yup.string('Must be a string of UNICODE characters').max(255, 'Description too long'),
            name: Yup.string().min(3).max(255, 'Name too long').required(),
            price : Yup.number('Price must be a number')
                .typeError('Price must be a number')
                .min(1, 'Price must be at least €1.00')
                .max(1000, 'Price can not exceed €1000.00')
                .positive('Price can not be negative'),
            amount : Yup.number('Price must be a number')
                .min(1,'You need to have at least 1 ticket for sale per type')
                .integer('Amount must be a whole number')
                .positive(),
            salesStart: Yup.date().required('Sales start date is required'),
            salesEnd: Yup.date().required('Sales end date is required'),
            maximumPerOrder: Yup.number('Maximum per order must be a number')
                .min(1, 'Maximum per order must be at least 1')
                .max(10, 'Maximum per order can not exceed 10')
                .integer('Maximum per order must be a whole number')
                .positive('Maximum per order can not be negative'),
            submit: null
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = {
                    typeActive: values.active,
                    typeDescription: values.description,
                    typeName: values.name,
                    typePrice :  values.price.toString(),
                    typeAmount : parseInt(values.amount),
                    salesStart: values.salesStart,
                    salesEnd: values.salesEnd,
                    maximumPerOrder: parseInt(values.maximumPerOrder),
                    typeId: values.id
                };

                if (ticketType) {
                    let eventId = event.eventId;
                    await dispatch(updateTicketType({data, eventId}));
                    toast.success('Ticket type updated!');
                } else {
                    let eventId = event.eventId;
                    await dispatch(createTicketType({data, eventId}));
                    toast.success('Ticket type added!');
                }

                if (!ticketType && onAddComplete) {
                    onAddComplete();
                }

                if (ticketType && onEditComplete) {
                    onEditComplete();
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    const handleSubmitClick = (errors) => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            document.getElementsByName(errorKeys[0])[0].focus();
        }
    }

    return (
        <Dialog
            id="new-ticket-type-dialog"
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={!!open}
        >

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ p: 3 }}>
                    <Typography
                        align="center"
                        gutterBottom
                        variant="h5"
                    >
                        {ticketType
                            ? 'Edit Ticket type'
                            : 'Add Ticket type'}
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    {/*<ErrorMessage name='name'/>*/}
                </Box>
                <Box sx={{ p: 3 }}>
                    <TextField
                        error={Boolean(formik.touched.name && formik.errors.name)}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        label="Name"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            error={Boolean(formik.touched.description && formik.errors.description)}
                            fullWidth
                            helperText={formik.touched.description && formik.errors.description}
                            label="Description"
                            name="description"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={formik.values.active}
                                    name="active"
                                    onChange={formik.handleChange}
                                />
                            )}
                            label="Active"
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <CurrencyFieldText
                            error={Boolean(formik.touched.price && formik.errors.price)}
                            fullWidth
                            helperText={formik.touched.price && formik.errors.price}
                            label="Price"
                            name="price"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.price}
                            onValueChange={handleValueChange("price", formik.setFieldValue)}>
                        </CurrencyFieldText>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            error={Boolean(formik.touched.amount && formik.errors.amount)}
                            fullWidth
                            helperText={formik.touched.amount && formik.errors.amount}
                            label="Amount"
                            name="amount"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.amount}
                        />
                    </Box>
                </Box>
                <Accordion expanded={expanded === 'panel1'}
                           onChange={handleChange('panel1')}
                           disableGutters
                >
                    <AccordionSummary
                        expandIcon={<Expand />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{width: '33%', flexShrink: 0, paddingLeft: 2}}>
                            Advanced options
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ p: 1 }}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                direction:  'column',
                            }}>
                                <DatePicker
                                    label="Sales start"
                                    ampm={false}
                                    onChange={handleStartDateChange}
                                    renderInput={(inputProps) => (
                                        <TextField
                                            fullWidth
                                            {...inputProps} />
                                    )}
                                    value={formik.values.salesStart}
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                />
                                <DatePicker
                                    label="Sales end"
                                    ampm={false}
                                    onChange={handleEndDateChange}
                                    renderInput={(inputProps) => (
                                        <TextField
                                            fullWidth
                                            {...inputProps} />
                                    )}
                                    value={formik.values.salesEnd}
                                    sx={{
                                        flexGrow: 1,
                                        mr: 3,
                                    }}
                                />
                            </Stack>
                            <Box sx={{
                                mt: 2,
                            }}>
                                <TextField
                                    error={Boolean(formik.touched.maximumPerOrder && formik.errors.maximumPerOrder)}
                                    helperText={formik.touched.maximumPerOrder && formik.errors.maximumPerOrder}
                                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                                    type="number"
                                    fullWidth
                                    label="Max tickets per order"
                                    name="maximumPerOrder"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.maximumPerOrder}

                                />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Divider />
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        p: 2
                    }}
                >
                    <Box sx={{ flexGrow: 1 }} />
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={formik.isSubmitting}
                        onClick={() => handleSubmitClick(formik.errors)}
                        sx={{ ml: 1 }}
                        type="submit"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </Box>
            </form>
        </Dialog>
    );
};

NewTicketTypeDialog.propTypes = {
    ticketType: PropTypes.object,
    event: PropTypes.object,
    onAddComplete: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    open: PropTypes.bool,
    range: PropTypes.object,
};
