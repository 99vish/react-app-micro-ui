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

const ReferencePopup = ({ open, handleClose, onSubmit, initialData, isEdit }) => {

  const classes = useStyles();

  const [references, setReferences] = useState({
    type: '',
    key: [''],
    operator: '',
    value: ''
  })

  useEffect(() => {
    if (isEdit && initialData) {
      setReferences(initialData);
    } else {
      setReferences({
        type: '',
        key: [''],
        operator: '',
        value: ''
      });
    }
  }, [isEdit, initialData, open]);

  const handleChange = (e) => {
    setReferences({ ...references, [e.target.name]: e.target.value });
  };

  const handleKeyChange = (index, event) => {
    const newKeys = [...references.key];
    newKeys[index] = event.target.value;
    setReferences({
      ...references,
      key: newKeys,
    });
  };
  const addKeyField = () => {
    setReferences({
      ...references,
      key: [...references.key, ''],
    });
  };

  const deleteKeyField = (index) => {
    const newKeys = references.key.filter((_, i) => i !== index);
    setReferences({
      ...references,
      key: newKeys,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(references);
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
            {isEdit ? <h3>Edit References</h3> : <h3>Add References</h3>}
          </Typography>
          <IconButton style={{ backgroundColor: 'red', color: 'white' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>References Information</h3>
            </div>
          }
        />
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2} style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <Grid item xs={12} md={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                ReferenceType
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="referenceType"
                placeholder='Select Action Type'
                style={{ width: '300px' }}
                value={reference.referenceType}
                onChange={handleReferenceChange}
              >
                <MenuItem key='funcRef' value='funcRef'> Functional Reference </MenuItem>
                <MenuItem key='jsonRef' value='jsonRef'> JSON Reference </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                FilePath
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name='referenceUrl'
                type='text'
                variant='outlined'
                id="referenceUrl"
                onChange={handleReferenceChange}
                value={reference.referenceUrl}
                placeholder="Enter FilePath"
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update References" : "Save References"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default ReferencePopup;
