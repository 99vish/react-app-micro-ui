import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ALL_OBJECTS } from './allObjects';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PopupForm = ({ open, handleClose, onSubmit, initialData, isEdit }) => {
    const [formData, setFormData] = useState({
        actionType: '',
        selectorType: '',
        selectedObject: '',
        selector: '',
        occurance: '',
        url: '',
        x: '',
        y: ''
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                actionType: '',
                selectorType: '',
                selectedObject: '',
                selector: '',
                occurance: '',
                url: '',
                x: '',
                y: ''
            });
        }
    }, [isEdit, initialData, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        handleClose();
    };

    const handleAutocompleteChange = (event, newValue) => {
        setFormData({ ...formData, selectedObject: newValue });
      };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {isEdit ? "Edit Action" : "Add Action"}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                label="Action Type"
                                name="actionType"
                                value={formData.actionType}
                                onChange={handleChange}
                                fullWidth
                            >
                                {/* Replace with your ACTION_TYPE_OPTIONS */}
                                {['url', 'click', 'dblclick', 'clear', 'clickAtPosition', 'hoverAtPosition', 'input'].map((option) => (
                                    <MenuItem key={option} value={option}> {option} </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {formData.actionType === 'url' && (
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Enter Url"
                                    name="url"
                                    type="text"
                                    value={formData.url}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                        )}
                        {['click', 'dblclick', 'clear', 'clickAtPosition', 'hoverAtPosition', 'input'].includes(formData.actionType) && (

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={ALL_OBJECTS}
                                    value={formData.selectedObject}
                                    onChange={handleAutocompleteChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Objects" name="selectedObject" fullWidth />
                                    )}
                                />
                            </Grid>
                        )}
                        {['click', 'dblclick', 'clear', 'clickAtPosition', 'hoverAtPosition', 'input'].includes(formData.actionType) && (
                            <>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Selector"
                                        name="selector"
                                        type="text"
                                        value={formData.selector}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                {['click', 'dblclick', 'clear', 'input'].includes(formData.actionType) && (
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            label="Occurance"
                                            name="occurance"
                                            type="text"
                                            value={formData.occurance}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                )}
                                {['clickAtPosition', 'hoverAtPosition'].includes(formData.actionType) && (
                                    <>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label="X"
                                                name="x"
                                                type="text"
                                                value={formData.x}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                label="Y"
                                                name="y"
                                                type="text"
                                                value={formData.y}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Grid>
                                    </>
                                )}
                            </>
                        )}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                {isEdit ? "Update Action" : "Save Action"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default PopupForm;
