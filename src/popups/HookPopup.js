import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

const HookPopup = ({ open, onClose, onSave, initialData }) => {
  const classes = useStyles();
  const [keyValues, setKeyValues] = useState([{ key: '', value: '' }]);
    useEffect(() => {
        // Set the initial keyValues if initialData is provided
        if (initialData) {
          const initialKeyValues = Object.keys(initialData).map(key => ({
            key,
            value: initialData[key]
          }));
          setKeyValues(initialKeyValues);
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
    const updatedKeyValues = keyValues.map((kv, i) => (
      i === index ? { ...kv, [field]: value } : kv
    ));
    setKeyValues(updatedKeyValues);
  };

  const handleSave = () => {
    const updatedHook = keyValues.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    onSave(updatedHook);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        classes: {
          root: classes.backdrop,
        },
      }}
    >
      <DialogTitle>{initialData ? 'Edit Hook' : 'Add Hook'}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HookPopup;
