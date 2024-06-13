import React, { useState } from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import StepDialog from './StepDialog';

const StepsField = ({ formData, setFormData }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = (newStep) => {
        setFormData({
            ...formData,
            steps: [...formData.steps, newStep]
        });
    };

    return (
        <div>
            <List>
                {formData.steps.map((step, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={step.stepName} secondary={`Step Type: ${step.stepType}`} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Add Step
            </Button>
            <StepDialog open={open} handleClose={handleClose} handleSave={handleSave} />
        </div>
    );
};

export default StepsField;
