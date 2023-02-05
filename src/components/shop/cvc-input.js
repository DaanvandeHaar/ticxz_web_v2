import {IMaskInput} from "react-imask";
import PropTypes from "prop-types";
import {Box, FormControl, Input, InputLabel, TextField} from "@mui/material";
import {forwardRef, useState} from "react";
import MaskedInput from "react-text-mask/dist/reactTextMask";

const TextMaskCVC = forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="23/00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

TextMaskCVC.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
export default function FormattedInputs() {
    const [values, setValues] = useState({
        textmask: '23/00',
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    }

return (
    <MaskedInput
        mask={[/[0-1]/, /[0-9]/, '/', /[2-3]/, /[0-9]/]}
        guide={false}
        render={(innerRef, props) => (
            <TextField
                fullWidth
                label="Expiry date"
                {...props}
                inputRef={innerRef}
            />
        )}
    />
    );
}