import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close'
import { ALL_OBJECTS } from '../constants/allObjects';

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

const InputVariablePopup = ({ open, handleClose, onSubmit, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    objects: [{}],
  });

  const [inputVariables, setInputVariables] = useState([{}]);

  const handleSubmit = (e) => {
    console.log('Submitted Input Variables:', inputVariables);
    e.preventDefault()
    onSubmit(inputVariables)
    handleClose()
  };
  const handleAddParam = () => {
    setInputVariables((prevInputVar) => {
      return [...prevInputVar, {}]
    })
  }
  const handleKeyChange = (index, e) => {
    const { value } = e.target;
    setInputVariables((prevInputVar) => {
      let objAtIndex = prevInputVar[index];
      let prevKeyAtIndex = [Object.keys(objAtIndex)[0]]
      objAtIndex = { [value]: objAtIndex[prevKeyAtIndex] ? objAtIndex[prevKeyAtIndex] : "" }
      prevInputVar[index] = objAtIndex
      return prevInputVar
    })
  }
  const handleValueChange = (index, e) => {
    const { name, value } = e.target;
    setInputVariables((prevInputVar) => {
      let objAtIndex = prevInputVar[index];
      let key = Object.keys(objAtIndex)[0];
      objAtIndex = { [key]: value }
      prevInputVar[index] = objAtIndex
      return prevInputVar;
    })
  }

  const handleRemoveParam = (index) => {
    const updatedInputVariables = inputVariables.filter((_, i) => i !== index);
    setInputVariables(updatedInputVariables);
  }

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
            {isEdit ? "Edit InputVariable" : "Add InputVariable"}
          </Typography>
          <IconButton style={{backgroundColor: 'red', color: 'white'}} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2}>
            {inputVariables.map((param, index) => (
              <>
                <Grid item xs={10} md={4} ls={4} xl={4}>
                  <TextField
                    margin='dense'
                    placeholder={`Enter Key`}
                    id={`param-${index}-key`}
                    type='text'
                    onChange={(e) => handleKeyChange(index, e)}
                    value={Object.keys(inputVariables[index])[0]}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={10} md={6} ls={6} xl={6}>
                  <TextField
                    margin='dense'
                    placeholder={`Enter Value`}
                    id={`param-${index}-value`}
                    type='text'
                    onChange={(e) => handleValueChange(index, e)}
                    value={Object.values(inputVariables[index])[0]}
                    variant='outlined'
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  {
                    (Array.isArray(inputVariables) && index === inputVariables.length - 1)
                    && <IconButton onClick={() => handleAddParam()}>
                      <AddIcon />
                    </IconButton>
                  }

                  {inputVariables.length > 1 && (
                    <IconButton onClick={() => handleRemoveParam(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </>
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
}

export default InputVariablePopup;
