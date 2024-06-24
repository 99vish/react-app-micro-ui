import React, { useState, useEffect, act } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ALL_OBJECTS } from '../constants/allObjects';
import { ACTION_TYPE_OPTIONS } from '../constants/constants';

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

const ActionPopup = ({ open, params, handleClose, onSubmit, initialData, isEdit }) => {

  const [action, setAction] = useState({})
  const [currentKey, setCurrentKey] = useState()
  //const [initialKey, setInitialKey] = useState(Object.keys(initialData)[0])
  let initialValues = []

  useEffect(() => {
    if (isEdit && initialData) {
      if (initialData) {
        setAction(initialData);
        let initialValues = Object.values(initialData)
        console.log(initialValues)
        setCurrentKey(Object.keys(initialData)[0])
        console.log(Object.keys(initialData)[0])
      }
    } else {
      setAction({});
    }
  }, [isEdit, initialData, open]);

  const handleKeyChange = (e) => {
    const { value } = e.target;
    setAction((prevAction) => {
      let key = Object.keys(action)[0]
      let prevVal = prevAction[key]
      let newObject = { [value]: prevVal ? prevVal : key === "url" || key == "keyPress" ? "" : [] }
      setCurrentKey(value)
      return newObject
    })
  }

  const handleValueChange = (index, e) => {
    const { value } = e.target
    let key = Object.keys(action)[0]
    setAction((prevAction) => {
      let values = prevAction[key]
      values[index] = value
      let newObject = { [key]: values }
      return newObject
    })
  }

  const handleChange = (e) => {
    const { value } = e.target
    let key = Object.keys(action)[0]
    setAction({ [key]: value })
  }

  const handleAutocompleteChange = (event, newValue) => {
    let key = Object.keys(action)[0]
    setAction((prevAction) => {
      let values = prevAction[key]
      values[0] = newValue
      let newObject = {[key]: values}
      return newObject
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(action);
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
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography id="modal-title" variant="h6" component="h2">
            {isEdit ? "Edit Action" : "Add Action"}
          </Typography>
          <IconButton style={{ backgroundColor: 'red', color: 'white' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={10} md={10}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Action Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                placeholder='Action Type'
                name="actionType"
                value={Object.keys(action)[0]}
                onChange={(e) => handleKeyChange(e)}
                fullWidth
              >
                {ACTION_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
             <Grid item xs={10}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Paramaters
                <span style={{ color: 'red' }}>*</span>
              </div>
              {currentKey !== 'keyPress' && currentKey !== 'url' ? (
                <>
                  <Autocomplete
                    options={ALL_OBJECTS}
                    value={Object?.values(action)?.[0]?.[0] ?? ""}
                    onChange={(event, newValue) => handleAutocompleteChange(event, newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Objects" fullWidth />
                    )}
                  />
                  <TextField
                    margin='dense'
                    placeholder={`Enter Selector`}
                    type='text'
                    onChange={(e) => handleValueChange(1, e)}
                    value={Object.values(action)?.[0]?.[1] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                  <TextField
                    margin='dense'
                    placeholder={`Enter Value `}
                    type='text'
                    onChange={(e) => handleValueChange(2, e)}
                    value={Object.values(action)?.[0]?.[2] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                  <TextField
                    margin='dense'
                    placeholder={`Enter Occurance `}
                    type='text'
                    onChange={(e) => handleValueChange(3, e)}
                    value={Object.values(action)?.[0]?.[3] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                </>
              ) : (
                <TextField
                  margin='dense'
                  placeholder={`Enter Param `}
                  type='text'
                  onChange={handleChange}
                  value={Object.values(action)?.[0]}
                  variant='outlined'
                  fullWidth
                />
              )}
            </Grid>
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

export default ActionPopup;
