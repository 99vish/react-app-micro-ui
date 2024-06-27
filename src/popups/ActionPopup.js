import React, { useState, useEffect, act } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { parsedObject } from '../constants/singleSourceString';
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
  const [otherValues, setOtherValues] = useState(false)
  const ALL_OBJECTS = Object.keys(parsedObject)
  useEffect(() => {
    if (isEdit && initialData) {
      if (initialData) {
        setAction(initialData);
        let initialValues = Object.values(initialData)
        console.log(initialValues)
        setCurrentKey(Object.keys(initialData)[0])
        console.log(Object.keys(initialData)[0])
        setOtherValues(true)
      }
    } else {
      setAction({});
      setOtherValues(false)
    }
  }, [isEdit, initialData, open]);

  const handleKeyChange = (e) => {
    const { value } = e.target;
    if (value !== null || value !== "") setOtherValues(true)
    setAction((prevAction) => {
      let key = Object.keys(action)[0]
      let prevVal = prevAction[key]
      let newObject = { [value]: prevVal ? prevVal : key === "url" || key === "keyPress" ? "" : [] }
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

  const handleAutocompleteChange = (event, newValue) => {
    let key = Object.keys(action)[0]
    setAction((prevAction) => {
      let values = prevAction[key]
      values[0] = newValue
      let newObject = { [key]: values }
      return newObject
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let key = Object.keys(action)[0]
    let values = Object.values(action)[0].filter(item => item != null || item != "")
    let finalAction = { [key]: values }
    onSubmit(finalAction);
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
          <IconButton className='closeButton' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2} style={{ paddingBottom: '5px', paddingTop: '10px', paddingLeft: '3%', paddingRight: '3%' }}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6} md={6}>
                <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                  Action Type
                  <span style={{ color: 'red' }}>*</span>
                </div>
                <TextField
                  select
                  placeholder='Action Type'
                  name="actionType"
                  value={Object.keys(action)[0]}
                  onChange={handleKeyChange}
                  fullWidth
                >
                  {ACTION_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {otherValues && currentKey !== 'refresh' && currentKey !== 'url' && currentKey !== 'keyPress' &&
                <>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      Selector Type
                      <span style={{ color: 'red' }}>*</span>
                    </div>
                    <Autocomplete
                      options={ALL_OBJECTS}
                      required='true'
                      value={Object?.values(action)?.[0]?.[0] ?? ""}
                      onChange={(event, newValue) => handleAutocompleteChange(event, newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Objects" fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      Selector
                    </div>
                    <TextField
                      margin='dense'
                      placeholder={`Enter Selector`}
                      type='text'
                      required='true'
                      onChange={(e) => handleValueChange(1, e)}
                      value={Object.values(action)?.[0]?.[1] ?? ""}
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      Occurance
                    </div>
                    <TextField
                      margin='dense'
                      placeholder={`Enter Occurance `}
                      type='number'
                      onChange={(e) => handleValueChange(4, e)}
                      value={Object.values(action)?.[0]?.[4] ?? ""}
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      iFrame
                    </div>
                    <TextField
                      margin='dense'
                      placeholder={`Enter iFrame `}
                      type='text'
                      onChange={(e) => handleValueChange(5, e)}
                      value={Object.values(action)?.[0]?.[5] ?? ""}
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                </>}
              {otherValues && currentKey === 'clickAtPosition' || currentKey === 'hoverAtPosition' ?
                <>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      X
                      <span style={{ color: 'red' }}>*</span>
                    </div>
                    <TextField

                      margin='dense'
                      placeholder={`Enter X `}
                      required='true'
                      type='number'
                      onChange={(e) => handleValueChange(2, e)}
                      value={Object.values(action)?.[0]?.[2] ?? ""}
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      Y
                      <span style={{ color: 'red' }}>*</span>
                    </div>
                    <TextField
                      margin='dense'
                      placeholder={`Enter Y`}
                      required='true'
                      type='text'
                      onChange={(e) => handleValueChange(3, e)}
                      value={Object.values(action)?.[0]?.[3] ?? ""}
                      variant='outlined'
                      fullWidth
                    />
                  </Grid>
                </> : <></>}
              {otherValues && currentKey === 'input' &&
                <Grid item xs={6} md={6}>
                  <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                    Value
                    <span style={{ color: 'red' }}>*</span>
                  </div>
                  <TextField
                    margin='dense'
                    placeholder={`Enter Value`}
                    type='text'
                    required='true'
                    onChange={(e) => handleValueChange(2, e)}
                    value={Object.values(action)?.[0]?.[2] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>}
              {otherValues && currentKey === 'keyPress' &&
                <Grid item xs={7} md={7}>
                  <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                    Enter Key
                    <span style={{ color: 'red' }}>*</span>
                  </div>
                  <TextField
                    margin='dense'
                    placeholder={`Enter Key To Be Pressed`}
                    type='text'
                    required='true'
                    onChange={(e) => handleValueChange(0, e)}
                    value={Object.values(action)?.[0]?.[0] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>}
              {otherValues && currentKey === 'url' &&
                <Grid item xs={7} md={7}>
                  <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                    Enter Url
                    <span style={{ color: 'red' }}>*</span>
                  </div>
                  <TextField
                    margin='dense'
                    placeholder='Enter Url'
                    type='text'
                    required='true'
                    onChange={(e) => handleValueChange(0, e)}
                    value={Object.values(action)?.[0]?.[0] ?? ""}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>}
            </Grid>
            {parsedObject[Object?.values(action)?.[0]?.[0] ?? ""]}
            <Grid container xs={12} style={{paddingTop: '2%'}}>
              <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
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
