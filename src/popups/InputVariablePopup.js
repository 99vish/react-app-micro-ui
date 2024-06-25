import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, makeStyles, Tooltip, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const useStyles = makeStyles((theme) => ({
  keyValueRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  keyField: {
    marginRight: '10px',
    flex: 1
  },
  valueField: {
    flex: 1
  },
  addKeyValueButton: {
    marginTop: '10px'
  },
  dialogContent: {
    backgroundColor: '#fff', // Set your desired background color for the dialog content
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Set your desired background color and opacity
  }
}));

const InputVariablePopup = ({ open, handleClose, onSave, initialData, isEdit }) => {
  const classes = useStyles();
  const [keyValues, setKeyValues] = useState([{ key: '', value: '' }]);
  

  useEffect(() => {
    // Set the initial keyValues if initialData is provided and not empty
    if (initialData && Object.keys(initialData).length > 0) {
      const initialKeyValues = Object.keys(initialData).map(key => ({
        key,
        value: initialData[key]
      }));
      setKeyValues(initialKeyValues);
    } else {
      // If initialData is null or empty, reset to default empty key-value pair
      setKeyValues([{ key: '', value: '' }]);
    }
  }, [initialData]);

  const handleAddKeyValue = () => {
    setKeyValues([...keyValues, { key: '', value: '' }]);
  };

  const handleRemoveKeyValue = (index) => {
    const updatedKeyValues = keyValues.filter((_, i) => i !== index);
    setKeyValues(updatedKeyValues);
  };

  const handleKeyValueChange = (index, field, value) => {
    const updatedValue = value.includes(',') ? value.split(',').map(item => item.trim()) : value;
    const updatedKeyValues = keyValues.map((kv, i) => (
      i === index ? { ...kv, [field]: updatedValue } : kv
    ));
    setKeyValues(updatedKeyValues);
  };
  

  const handleSave = () => {
    const updatedKeyValuePairs = keyValues.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    onSave(updatedKeyValuePairs);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? 'Edit Input Variables' : 'Add Input Variables'}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
          *If you want to add values in the form of arrays, please use comma-separated values.
      </Typography>
      {keyValues.map((kv, index) => (
          <div key={index} className={classes.keyValueRow}>
            <TextField
              margin='dense'
              label="Key"
              variant='outlined'
              className={classes.keyField}
              value={kv.key}
              onChange={(e) => handleKeyValueChange(index, 'key', e.target.value)}
            />
            <TextField
              margin='dense'
              label="Value"
              variant='outlined'
              className={classes.valueField}
              value={kv.value}
              onChange={(e) => handleKeyValueChange(index, 'value', e.target.value)}
            />
            <Tooltip title="Remove">
              <IconButton onClick={() => handleRemoveKeyValue(index)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          className={classes.addKeyValueButton}
          onClick={handleAddKeyValue}
        >
          Add Key-Value Pair
          <AddIcon />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputVariablePopup;
