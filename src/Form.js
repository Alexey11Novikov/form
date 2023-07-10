import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Button, TextField, Box, Typography } from "@mui/material";
import { IMaskInput } from "react-imask";
import "./index.css";
import axios from "axios";

const NumberMask = React.forwardRef(function NumberMask(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="00-00-00"
            inputRef={ref}
            onAccept={(value) => onChange({ target: { value } })}
            overwrite
        />
    );
});

NumberMask.propTypes = {
    onChange: PropTypes.func.isRequired,
};

const Form = () => {
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [isError, setIsError] = useState(false);
    const [response, setResponse] = useState([]);

    const onChangeNumber = (event) => {
        event.target.value = event.target.value.split('-').join('');
        setNumber(event.target.value);
    }

    const onChangeEmail = (newEmail) => {
        setEmail(newEmail);
        if (checkEmail(newEmail)) {
            setIsError(false);
        } else {
            setIsError(true);
        }
    }

    const checkEmail = (email) => {
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return true;
        }
        else
            return false;
    }

    const onSubmit = () => {
        if (email === '' || isError) { setIsError(true); }
        else {
            setIsError(false);
            axios({
                method: "POST",
                url: "http://localhost:5000/sendForm",
                data: {
                    email: email,
                    number: number
                }
            }).then((res) => {
                setEmail('');
                setNumber('');
                setResponse(res.data);
            })
                .catch((error) => console.log(error))
        }
    }

    return (
        <Box
            component="form"
            sx={{
                width: 600,
                borderRadius: 4,
                margin: 2,
                backgroundColor: '#a0f1f5',
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}

            autoComplete="off"
        >
            <TextField
                error={isError}
                helperText="Введети email*"
                id="demo-helper-text-misaligned"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                label="Email"
            />
            <TextField
                helperText="Введите номер"
                id="demo-helper-text-misaligned"
                value={number}
                onChange={onChangeNumber}
                label="Number"
                InputProps={{
                    inputComponent: NumberMask,
                }}
            />
            <Button variant="outlined" className="btnSubmit" onClick={onSubmit}>Submit</Button>

            {response.map((item, index) => (
                <React.Fragment key={index}>
                <Typography variant="body1" component="h6">
                    {`email: ${item.email}  number: ${item.number}`}
                </Typography>
             </React.Fragment>
            ))}
        </Box>
    );
};

export default Form;