import {
    Box, Button,
    FormControlLabel, ListItemIcon, MenuItem,
    Radio,
    RadioGroup, Select,
    Stack, SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";
import Lock01Icon from "@untitled-ui/icons-react/build/esm/Lock01";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {MobileDatePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import Flag from 'react-world-flags'
import InputAdornment from "@mui/material/InputAdornment";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import MaskedInput from "react-text-mask";
import {countries} from "../countries";

export const PersonalInfoStep = (props) => {
    const { onBack, onNext, ...other } = props;
    const [value, setValue] = useState(null);

    const handlePhoneChange = () => {

    }

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
                                label="Email"
                                name="email"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <Stack
                                direction="row"
                                spacing={0.5}
                            >
                            <MaskedInput
                                mask={['+',/[0-9]/,  /\d/,  /\d/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                                guide={false}
                                render={(innerRef, props) => (
                                <TextField
                                    fullWidth
                                    name="phoneNumber"
                                    placeholder="+316 12 345 678"
                                    label="Phone"
                                    onChange={(e) => handlePhoneChange(e)}
                                    {...props}
                                    inputRef={innerRef}
                                />
                                )}
                            />
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <TextField
                                select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Gender"
                            >
                                <MenuItem value={"M"}>Male</MenuItem>
                                <MenuItem value={"F"}>Female</MenuItem>
                                <MenuItem value={"X"}>Non-binary</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                        >
                            <MobileDatePicker
                                views={['year', 'month', 'day']}
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                fullWidth
                                openTo="year"
                                label="Date of birth"
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div>
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
                </div>
            </Stack>
        </>
    );
};

PersonalInfoStep.propTypes = {

};