import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ALL_OBJECTS } from './allObjects';
import { ACTION_TYPE_OPTIONS } from './constants';

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
    params: ['']
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        actionType: '',
        params: ['']
      });
    }
  }, [isEdit, initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'actionType') {
        return { ...prev, [name]: value, params: [''] };
      }
      const params = [...prev.params];
      const index = parseInt(name.replace('param', ''), 10);
      params[index] = value;
      return { ...prev, params };
    });
  };

  const handleAutocompleteChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      params: [newValue, ...prev.params.slice(1)]
    }));
  };

  const handleAddParam = () => {
    setFormData((prev) => ({
      ...prev,
      params: [...prev.params, '']
    }));
  };

  const handleRemoveParam = (index) => {
    setFormData((prev) => ({
      ...prev,
      params: prev.params.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
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
            <Grid item xs={12} md={12}>
              <TextField
                select
                label="Action Type"
                name="actionType"
                value={formData.actionType}
                onChange={handleChange}
                fullWidth
              >
                {ACTION_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {formData.params.map((param, index) => (
              <Grid item xs={12} key={index} container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  {index === 0 && formData.actionType !== 'keyPress' && formData.actionType !== 'url' ? (
                    <Autocomplete
                      options={ALL_OBJECTS}
                      value={param}
                      onChange={(event, newValue) => handleAutocompleteChange(event, newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Objects" name={`param${index}`} fullWidth />
                      )}
                    />
                  ) : (
                    <TextField
                      margin='dense'
                      name={`param${index}`}
                      placeholder={`Enter Param ${index + 1}`}
                      id={`param-${index}`}
                      type='text'
                      onChange={handleChange}
                      value={param}
                      variant='outlined'
                      fullWidth
                    />
                  )}
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleAddParam()}>
                    <AddIcon />
                  </IconButton>
                  {formData.params.length > 1 && (
                    <IconButton onClick={() => handleRemoveParam(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
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
