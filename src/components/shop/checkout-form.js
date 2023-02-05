import { useCallback, useMemo, useState } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from '@mui/material';
import {BillingInfoStep} from "./billing-info-step";
import {PaymentMethodStep} from "./payment-method-step";
import {JobDescriptionStep} from "../../sections/dashboard/jobs/job-description-step";
import {PersonalInfoStep} from "./personal-info-step";
import {useFormik} from "formik";
import * as Yup from "yup";
import {createTicketType, updateTicketType} from "../../slices/event";
import toast from "react-hot-toast";

const StepIcon = (props) => {
    const { active, completed, icon } = props;

    const highlight = active || completed;

    return (
        <Avatar
            sx={{
                height: 40,
                width: 40,
                ...(highlight && {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                })
            }}
            variant="rounded"
        >
            {completed
                ? (
                    <SvgIcon>
                        <CheckIcon />
                    </SvgIcon>
                )
                : icon}
        </Avatar>
    );
};

export const CheckoutForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [complete, setComplete] = useState(false);

    const handleNext = useCallback(() => {
        setActiveStep((prevState) => prevState + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevState) => prevState - 1);
    }, []);

    const handleComplete = useCallback(() => {
        setComplete(true);
    }, []);

    const initialValues = useMemo(() => {
        return {
        };
    }, []);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            submit: null
        }),
        onSubmit: async (values, helpers) => {
            try {
                const data = {
                    email: values.email,
                    phone: values.phone,
                    fistName: values.fistName,
                    lastName: values.lastName,
                    gender: values.gender,
                    dateOfBirth: values.dateOfBirth,
                    street: values.street,
                    houseNumber: values.houseNumber,
                    postalCode: values.postalCode,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                };

            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        }
    });

    const steps = useMemo(() => {
        return [
            {
                label: 'Personal Information',
                content: (
                    <PersonalInfoStep
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                )
            },
            {
                label: 'Billing Details',
                content: (
                    <BillingInfoStep
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                )
            },
            {
                label: 'Payment',
                content: (
                    <PaymentMethodStep
                        onBack={handleBack}
                        onNext={handleComplete}
                    />
                )
            },
        ];
    }, [handleBack, handleNext, handleComplete]);


    return (
        <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
                '& .MuiStepConnector-line': {
                    borderLeftColor: 'divider',
                    borderLeftWidth: 2,
                    ml: 1
                }
            }}
        >
            {steps.map((step, index) => {
                const isCurrentStep = activeStep === index;

                return (
                    <Step key={step.label}>
                        <StepLabel StepIconComponent={StepIcon}>
                            <Typography
                                sx={{ ml: 2 }}
                                variant="overline"
                            >
                                {step.label}
                            </Typography>
                        </StepLabel>
                        <StepContent
                            sx={{
                                borderLeftColor: 'divider',
                                borderLeftWidth: 2,
                                ml: '20px',
                                ...(isCurrentStep && {
                                    py: 4
                                })
                            }}
                        >
                            {step.content}
                        </StepContent>
                    </Step>
                );
            })}
        </Stepper>
    );
};