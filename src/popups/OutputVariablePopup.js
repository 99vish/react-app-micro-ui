import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { STEP_TYPE_OPTIONS } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { Tooltip, makeStyles } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 4
  },
  card: {
    padding: 8,
    width: '99%',
    boxShadow: '3px 3px 10px 3px #CECAC8'
  },
  cardGrid: {
    paddingLeft: 20,
    paddingTop: 5,
    paddingRight: 20,
    color: '#4A4A4A'
  },
  headerStyle: {
    marginTop: '0px',
    fontSize: '18px',
    fontWeight: '600'
  },
  stickToTop: {
    padding: '1% 2% 1% 2%',
    alignItems: 'center',
    marginLeft: '-0.6%'
  },
  inputStyle: {
    backgroundColor: 'white',
    borderRadius: '2px',
    border: '1px solid #DDDBDA'
  }
}));

const OutputVariablePopup = ({ open, handleClose, onSubmit, initialData, isEdit }) => {

  const classes = useStyles();
  console.log(initialData);
  

  const [outputVariable, setOutputVariable] = useState({
    type: '',
    key: [''],
    operator: '',
    value: ''
  })

  useEffect(() => {
    if (isEdit && initialData) {
      setOutputVariable(initialData);
    } else {
      setOutputVariable({
        type: '',
        key: [''],
        operator: '',
        value: ''
      });
    }
  }, [isEdit, initialData, open]);

  console.log(outputVariable);

  const handleChange = (e) => {
    setOutputVariable({ ...outputVariable, [e.target.name]: e.target.value });
  };

  const handleKeyChange = (index, event) => {
    const newKeys = [...outputVariable.key];
    newKeys[index] = event.target.value;
    setOutputVariable({
      ...outputVariable,
      key: newKeys,
    });
  };
  const addKeyField = () => {
    setOutputVariable({
      ...outputVariable,
      key: [...outputVariable.key, ''],
    });
  };

  const deleteKeyField = (index) => {
    const newKeys = outputVariable.key.filter((_, i) => i !== index);
    setOutputVariable({
      ...outputVariable,
      key: newKeys,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(outputVariable);
    handleClose();
  };

  const toggleKeyType = () => {
    setOutputVariable({
      ...outputVariable,
      key: outputVariable.isKeyArray ? '' : [''],
      isKeyArray: !outputVariable.isKeyArray,
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" className='heading'>
          {isEdit ? <h3>Edit Output Variable</h3> : <h3>Add Output Variable</h3>}
        </Typography>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Output Variable Information</h3>
            </div>
          }
        />
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2} style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Output Variable Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="type"
                placeholder='Select Output Variable Type'
                style={{ width: '300px' }}
                value={outputVariable.type}
                onChange={handleChange}
              >
                {STEP_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}> {option} </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Value
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name="value"
                placeholder="Enter Values"
                id="outputVariableValue"
                type='text'
                onChange={handleChange}
                value={outputVariable.value}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Key
                <Tooltip title="Toggle between single and multiple keys">
                  <IconButton onClick={toggleKeyType}>
                    {outputVariable.isKeyArray ? <span>Switch to Single Key</span> : <span>Switch to Multiple Keys</span>}
                  </IconButton>
                </Tooltip>
                {outputVariable.isKeyArray ? (
                  outputVariable.key.map((key, index) => (
                    <Grid container alignItems="center" key={index} spacing={1}>
                      <Grid item xs={8}>
                        <TextField
                          margin='dense'
                          name="key"
                          placeholder="Enter Key"
                          id={`outputKey-${index}`}
                          type='text'
                          onChange={(e) => handleKeyChange(index, e)}
                          value={key}
                          variant='outlined'
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <IconButton onClick={addKeyField}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => deleteKeyField(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                ) : (
                  <TextField
                    margin='dense'
                    name="key"
                    placeholder="Enter Key"
                    id="outputKey"
                    type='text'
                    onChange={handleChange}
                    value={outputVariable.key}
                    variant='outlined'
                    fullWidth
                  />
                )}
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update" : "Save"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default OutputVariablePopup;
