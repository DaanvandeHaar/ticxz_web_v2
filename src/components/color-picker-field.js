
import {useState} from "react";
import {SketchPicker} from "react-color";




export const handleValueChange = (name, setFieldValue) => (val) =>
    setFieldValue(name, val.floatValue);

const ColorPickerField = ({currencySymbol, ...props}) => {
    const [color, setColor] = useState();
    const handleChange = color => setColor(color);
    return (
            <SketchPicker color={color}
                          background={settings.settings.th}
                          onChangeComplete={handleChange}
            />
    );
};

export default ColorPickerField;

