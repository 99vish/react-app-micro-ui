import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ActionsDialog = ({ open, handleClose, handleSave }) => {
    const [action, setAction] = useState({
        type: '',
        selector: '',
        value: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAction({ ...action, [name]: value });
    };

    const saveAction = () => {
        handleSave(action);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Action</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Action Type</InputLabel>
                    <Select
                        name="type"
                        value={action.type}
                        onChange={handleChange}
                    >
                        <MenuItem value="click">Click</MenuItem>
                        <MenuItem value="input">Input</MenuItem>
                        <MenuItem value="navigate">Navigate</MenuItem>
                        <MenuItem value="select">Select</MenuItem>
                        <MenuItem value="assert">Assert</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    name="selector"
                    label="Selector"
                    type="text"
                    fullWidth
                    value={action.selector}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="value"
                    label="Value"
                    type="text"
                    fullWidth
                    value={action.value}
                    onChange={handleChange}
                />
                {/* Add more fields as needed */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={saveAction} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionsDialog;
