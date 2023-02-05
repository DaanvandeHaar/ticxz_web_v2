import {
    Box, Button, MenuItem,
    Stack, SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {countries} from "../countries";

export const BillingInfoStep = (props) => {
    const { onBack, onNext, ...other } = props;

    return (
        <>
            <Stack spacing={3}>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                </Stack>
                <div>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="Street"
                                name="street"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="House number"
                                name="houseNumber"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="Postal code"
                                name="postalCode"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="City"
                                name="optionalAddress"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="State/Province"
                                name="state"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                onChange={(e) => console.log(e.target.value)}
                                select
                                fullWidth
                                label="Country"
                                name="country"
                            >
                            {countries.map((country) => (
                                <MenuItem
                                    key={country.value}
                                >
                                    {country.text}
                                </MenuItem>
                            ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </div>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                    <Button
                        endIcon={(
                            <SvgIcon>
                                <ArrowRightIcon />
                            </SvgIcon>
                        )}
                        onClick={onNext}
                        variant="contained"
                    >
                        Continue
                    </Button>
                    <Button
                        color="inherit"
                        onClick={onBack}
                    >
                        Back
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

BillingInfoStep.propTypes = {

};