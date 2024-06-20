import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ALL_OBJECTS } from './allObjects';
import { STEP_TYPE_OPTIONS } from './constants';
import HeaderDivider from './headerWithDivider';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

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

const StepBoxPopup = ({ open, handleClose, onSubmit, initialData, isEdit }) => {

  const classes = useStyles();

  const [referenceBoxOpen, setReferenceBoxOpen] = useState(false)
  const [currentRefIndex, setCurrentRefIndex] = useState(null);
  const [isRefEdit, setIsRefEdit] = useState(false)
  const [inputVariable, setInputVariable] = useState({
    type: '',
    key: '',
    operator: '',
    value: ''
  })

  const [outputVariable, setOutputVariable] = useState({
    type: '',
    key: '',
    value: ''
  })

  const [reference, setReference] = useState({
    referenceType: '',
    referenceUrl: '',
    inputVariable: inputVariable,
    outputVariable: outputVariable
  })

  const [step, setStep] = useState({
    stepName: '',
    stepType: '',
    useLabel: '',
    references: []
  })

  useEffect(() => {
    if (isEdit && initialData) {
      setStep(initialData);
    } else {
      setStep({
        stepName: '',
        stepType: '',
        useLabel: '',
        references: []
      });
    }
  }, [isEdit, initialData, open]);

  const handleChange = (e) => {
    setStep({ ...step, [e.target.name]: e.target.value });
  };

  const handleReferenceChange = (e) => {
    setReference({ ...reference, [e.target.name]: e.target.value });
  }

  const handleOutputVariableChange = (e) => {
    const { name, value } = e.target;
    setOutputVariable({ ...outputVariable, [name]: value });
  }

  const removeReference = (index) => {
    const updatedReferences = step.references.filter((_, i) => i !== index);
    setStep({ ...step, references: updatedReferences });
  };

  const handleEditReference = (index) => {
    const ref = step.references[index];
    setReference(ref);
    setOutputVariable(ref.outputVariable);
    setReferenceBoxOpen(true);
    setIsRefEdit(true);
    setCurrentRefIndex(index);
  };

  const handleSaveReference = () => {
    const newReference = {
      ...reference,
      outputVariable: { ...outputVariable }
    };

    if (isRefEdit && currentRefIndex !== null) {
      const updatedReferences = [...step.references];
      updatedReferences[currentRefIndex] = newReference;
      setStep({
        ...step,
        references: updatedReferences
      });
    } else {
      setStep({ ...step, references: [...step.references, newReference] });
    }

    setReferenceBoxOpen(false);
    setReference({ referenceType: '', referenceUrl: '', inputVariable: {}, outputVariable: {} });
    setOutputVariable({ type: '', key: '', value: '' });
    setIsRefEdit(false);
    setCurrentRefIndex(null);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(step);
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
        <Typography id="modal-title" className='heading'>
          {isEdit ? <h3>Edit Step</h3> : <h3>Add Step</h3>}
        </Typography>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Steps Information</h3>
            </div>
          }
        />
        <form onSubmit={handleSubmit}>
          <Grid container direction="row" spacing={2} style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <Grid item xs={12} md={10}>
              <TextField
                label="Step Name"
                name="stepName"
                type="text"
                value={step.stepName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4} ls={4} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Step Type
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                select
                name="stepType"
                placeholder='Select Step Type'
                style={{ width: '300px' }}
                value={step.stepType}
                onChange={handleChange}
              >
                {STEP_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}> {option} </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4} ls={4} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Label
              </div>
              <TextField
                select
                name="useLabel"
                placeholder='Select Label'
                style={{ width: '300px' }}
                value={step.useLabel}
                onChange={handleChange}
              >
                <MenuItem key='logistics' value='logistics'> Logistics </MenuItem>
                <MenuItem key='carrierGo' value='carrierGo'> CarrierGo </MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* References Grid */}

          <Grid className='actions-grid' container direction="row" style={{ paddingBottom: '20px', paddingTop: '20px' }}>
            <HeaderDivider
              title={
                <div style={{ display: 'flex' }}>
                  <h3 className={classes.headerStyle}>References</h3>
                </div>
              }
            />
            <Grid container style={{paddingLeft: '2%', paddingBottom: '20px'}} >
              <ul className='listItem'>
                {step.references.map((reference, index) => (
                  <li key={index} className="stepItem">
                    <a href="http://localhost:3000/add-ref" target="_blank">
                      <span className="stepName">
                        {reference.referenceType || `Reference ${index + 1}`}
                      </span>
                    </a>
                    <div className="stepReference">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditReference(index)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => removeReference(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ul>
              {referenceBoxOpen ?
                <Grid container direction="row" spacing={2}>
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
                      <MenuItem key='JSONRef' value='JSONRef'> JSON Reference </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6} ls={6} xl={6}>
                    <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                      Url
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
                      placeholder="Enter Url"
                    />
                  </Grid>

                  {/* Output Variable Grid */}

                  <Grid container style={{ marginBottom: '2%', paddingLeft: '2%' }}>
                    <HeaderDivider
                      title={
                        <div style={{ display: 'flex' }}>
                          <h3 className={classes.headerStyle}>Output Variables</h3>
                        </div>
                      }
                    />
                    <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
                      <Grid item xs={12} md={6} ls={6} xl={6}>
                        <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                          Type
                        </div>
                        <TextField
                          select
                          name="type"
                          placeholder='Select Type'
                          style={{ width: '300px' }}
                          value={outputVariable.type}
                          onChange={handleOutputVariableChange}
                        >
                          {STEP_TYPE_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}> {option} </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6} ls={6} xl={6}>
                        <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                          Value
                        </div>
                        <TextField
                          margin='dense'
                          name="value"
                          placeholder="Enter Value"
                          type='text'
                          onChange={handleOutputVariableChange}
                          value={outputVariable.value}
                          variant='outlined'
                        />
                      </Grid>
                      <Grid item xs={12} md={6} ls={6} xl={6}>
                        <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                          Key
                        </div>
                        <TextField
                          margin='dense'
                          name="key"
                          placeholder="Enter Key"
                          id="key"
                          type='text'
                          onChange={handleOutputVariableChange}
                          value={outputVariable.key}
                          variant='outlined'
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={4} ls={4} xl={4}>
                    <Button
                      variant="contained" color="primary" className="button"
                      onClick={handleSaveReference}
                    >
                      Save Reference
                    </Button>
                  </Grid>
                </Grid> :
                <Button
                  variant="contained" color="primary" className="button"
                  onClick={() => setReferenceBoxOpen(true)}
                >
                  Add Reference
                </Button>}
            </Grid>
          </Grid>


          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Update Step" : "Save Step"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default StepBoxPopup;
