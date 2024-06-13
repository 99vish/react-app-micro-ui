import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import '../styles.css';

const StepDialog = ({ stepData, onSave, onRemove }) => {
    const [step, setStep] = useState(stepData);

    useEffect(() => {
        setStep(stepData);
    }, [stepData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStep({ ...step, [name]: value });
    };

    const handleSave = () => {
        onSave(step);
    };

    return (
        <div className="inlineForm">
            <TextField
                margin="dense"
                name="stepName"
                label="Step Name"
                type="text"
                fullWidth
                value={step.stepName}
                onChange={handleChange}
            />
            <TextField
                select
                margin="dense"
                name="stepType"
                label="Step Type"
                fullWidth
                value={step.stepType}
                onChange={handleChange}
            >
                <MenuItem value="API">API</MenuItem>
                <MenuItem value="UI">UI</MenuItem>
                <MenuItem value="Kafka">Kafka</MenuItem>
                <MenuItem value="Mongo">Mongo</MenuItem>
                <MenuItem value="Sql">Sql</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save Step
            </Button>
            <Button variant="contained" color="secondary" onClick={onRemove}>
                Remove Step
            </Button>
        </div>
    );
};

export default StepDialog;
