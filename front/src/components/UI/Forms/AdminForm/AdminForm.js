import React, { Fragment, useState } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AdminForm = ({ id, options, value, onValueChange, defaultValue }) => {
    const [inputValue, setInputValue] = useState("");
    return (
        <Fragment>
            < Autocomplete
                id={id}
                value={value}
                inputValue={inputValue}
                onChange={(event, newValue) => {
                    console.log('newValue', newValue);
                    onValueChange(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    console.log('newInputValue', newInputValue);
                    setInputValue(newInputValue);
                }}
                options={options}
                getOptionLabel={(option) => option[id]}
                getOptionSelected={(option, value) => option[id] === value} //
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
        </Fragment>
    )
}

export default AdminForm;