import NumberFormat from "react-number-format";
import {useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import {TextField} from "@mui/material";



export const handleValueChange = (name, setFieldValue) => (val) =>
    setFieldValue(name, val.floatValue);

const CurrencyFieldText = ({currencySymbol, ...props}) => {
    const [displayValue, setDisplayValue] = useState();
    return (
        <NumberFormat
            customInput={TextField}
            isNumericString={true}
            thousandSeparator={false}
            value={displayValue}
            decimalScale={2}
            fixedDecimalScale={true}
            onValueChange={(vals) => setDisplayValue({value: vals.formattedValue})}
            InputProps={{
                startAdornment:
                    <InputAdornment position="start">
                        {currencySymbol}
                    </InputAdornment>
            }}
            {...props}
        />
    );
};

CurrencyFieldText.defaultProps = {
    currencySymbol: "€"
};

export default CurrencyFieldText;