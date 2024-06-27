import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, MenuItem, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ACTION_TYPE_OPTIONS, ASSERTION_ASSERT_TYPE, ASSERTION_OPERATOR_TYPE } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { makeStyles } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ALL_OBJECTS } from '../constants/allObjects';

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

const AssertionPopup = ({ stepType, open, handleClose, onSubmit, initialData, isEdit }) => {

  const classes = useStyles();

  const [assertion, setAssertion] = useState({
    type: stepType,
    key: [''],
    operator: '',
    value: '',
    soft: false,
    export: false
  })

  useEffect(() => {
    if (isEdit && initialData) {
      setAssertion(initialData);
    } else {
      setAssertion({
        type: stepType,
        key: [''],
        operator: '',
        value: '',
        soft: false,
        export: false
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

  const handleAutocompleteChange = (index, event, newValue) => {
    const newKeys = [...assertion.key];
    newKeys[index] = newValue;
    setAssertion({
      ...assertion,
      key: newKeys
    })
  }

  const handleCheckboxChange = (e) => {
    const {name, checked} = e.target
    setAssertion({
      ...assertion,
      [name]: checked,
    });
  }

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
          <IconButton className='closeButton' onClick={handleClose}>
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
            <Grid item xs={6} md={4}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Selector Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <Autocomplete
                options={ALL_OBJECTS}
                required='true'
                value={assertion.key[0]}
                onChange={(e, newValue) => handleAutocompleteChange(0, e, newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Objects" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Assert Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <Autocomplete
                options={ASSERTION_ASSERT_TYPE}
                required='true'
                value={assertion.key[2]}
                onChange={(e, newValue) => handleAutocompleteChange(2, e, newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Assert Type" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <div style={{ paddingTop: '10px' }}>
                Selector
              </div>
              <TextField
                margin='dense'
                placeholder={`Enter Selector`}
                type='text'
                onChange={(e) => handleKeyChange(1, e)}
                value={assertion.key[1]}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <div style={{ paddingTop: '10px' }}>
                Occurance
              </div>
              <TextField
                margin='dense'
                placeholder={`Enter Occurance`}
                type='number'
                required='true'
                onChange={(e) => handleKeyChange(3, e)}
                value={assertion.key[3]}
                variant='outlined'
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={4} ls={4} xl={4}>
              <div style={{ paddingBottom: '8px', paddingTop: '10px' }}>
                Operator
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="operator"
                label='Select Operator'
                fullWidth
                value={assertion.operator}
                onChange={handleChange}
              >
                {ASSERTION_OPERATOR_TYPE.map((operator) => (
                  <MenuItem key={operator} value={operator}> {operator} </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4} ls={4} xl={4}>
              <div style={{ paddingTop: '10px' }}>
                Value
                {assertion?.key[2]==='TEXT' && <span style={{ color: 'red' }}>*</span>}
              </div>
              <TextField
                margin='dense'
                name="value"
                placeholder="Enter Value"
                fullWidth
                id='outputKey1'
                type='text'
                required={assertion?.key[2]==='TEXT'}
                onChange={handleChange}
                value={assertion.value}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={4} md={4} ls={4} xl={4}>
              <label>
                <input onChange={handleCheckboxChange} type="checkbox"  name="soft" id="soft" />
                Soft
              </label>
            </Grid>
            <Grid item xs={4} md={4} ls={4} xl={4}>
              <label>
                <input onChange={handleCheckboxChange} type="checkbox" name="export" id="export" />
                Export
              </label>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
              {isEdit ? "Update Assertion" : "Save Assertion"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default AssertionPopup;
