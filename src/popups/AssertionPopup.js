import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { STEP_TYPE_OPTIONS } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { makeStyles } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

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

const AssertionPopup = ({ open, handleClose, onSubmit, initialData, isEdit }) => {

  const classes = useStyles();

  const [assertion, setAssertion] = useState({
    type: '',
    key: [''],
    operator: '',
    value: ''
  })

  useEffect(() => {
    if (isEdit && initialData) {
      setAssertion(initialData);
    } else {
      setAssertion({
        type: '',
        key: [''],
        operator: '',
        value: ''
      });
    }
  }, [isEdit, initialData, open]);

  const handleChange = (e) => {
    setAssertion({ ...assertion, [e.target.name]: e.target.value });
  };

  const handleKeyChange = (index, event) => {
    const newKeys = [...assertion.key];
    newKeys[index] = event.target.value;
    setAssertion({
      ...assertion,
      key: newKeys,
    });
  };
  const addKeyField = () => {
    setAssertion({
      ...assertion,
      key: [...assertion.key, ''],
    });
  };

  const deleteKeyField = (index) => {
    const newKeys = assertion.key.filter((_, i) => i !== index);
    setAssertion({
      ...assertion,
      key: newKeys,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(assertion);
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
          <Typography id="modal-title" className='heading'>
            {isEdit ? <h3>Edit Assertion</h3> : <h3>Add Assertion</h3>}
          </Typography>
          <IconButton style={{ backgroundColor: 'red', color: 'white' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Assertion Information</h3>
            </div>
          }
        />
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2} style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Assertion Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="type"
                placeholder='Select Assertion Type'
                style={{ width: '300px' }}
                value={assertion.type}
                onChange={handleChange}
              >
                {STEP_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}> {option} </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Operator
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="operator"
                placeholder='Select Operator'
                style={{ width: '300px' }}
                value={assertion.operator}
                onChange={handleChange}
              >
                <MenuItem key='equals' value='equals'> Equals </MenuItem>
                <MenuItem key='notEquals' value='notEquals'> Not Equals </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div>
                Key
                {assertion.key.map((key, index) => (
                  <Grid container alignItems="center" key={index}>
                    <Grid item>
                      <TextField
                        margin='dense'
                        name="key"
                        placeholder="Enter Key"
                        id={`outputKey-${index}`}
                        type='text'
                        onChange={e => handleKeyChange(index, e)}
                        value={key}
                        variant='outlined'
                      />
                    </Grid>
                    {index === assertion.key.length - 1 && (
                      <>
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
                      </>
                    )}
                  </Grid>
                ))}
              </div>
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
                id="assertionValue"
                type='text'
                onChange={handleChange}
                value={assertion.value}
                variant='outlined'
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update Assertion" : "Save Assertion"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default AssertionPopup;
