import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ALL_OBJECTS } from '../constants/allObjects';
import { STEP_TYPE_OPTIONS } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ReferencePopup from './ReferencePopup';

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
  },
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[5],
  }
}));

// Function to normalize references
const normalizeReferences = (references) => {
  return references.map(ref => {
    if ('jsonRef' in ref) {
      return {
        referenceType: 'JSONRef',
        referenceUrl: ref.jsonRef,
        inputVariable: ref.inputVariable,
        outputVariable: ref.outputVariable
      };
    } else if ('funcRef' in ref) {
      return {
        referenceType: 'funcRef',
        referenceUrl: ref.funcRef,
        inputVariable: ref.inputVariable,
        outputVariable: ref.outputVariable
      };
    } else {
      return ref; // Already in the correct format
    }
  });
};

// Function to normalize initial data
const getNormalizedInitialData = (initialData) => {
  if (initialData) {
    return {
      ...initialData,
      references: normalizeReferences(initialData.references)
    };
  }
  return null;
};

const addNewReference = (step, reference) => {
  const updatedStep = {
    ...step,
    references: [...step.references, reference]
  };

  return updatedStep;
}

const StepBoxPopup = ({ open, handleClose, onSubmit, initialData, isEdit, allFiles }) => {

  const classes = useStyles();
  const navigate = useNavigate();

  const normalizedInitialData = getNormalizedInitialData(initialData);

  const [referenceBoxOpen, setReferenceBoxOpen] = useState(false);
  const [referencePopupOpen, setReferencePopupOpen] = useState(false);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(null);
  const [isReferenceEdit, setIsReferenceEdit] = useState(false);
  const [inputVariable, setInputVariable] = useState({
    type: '',
    key: '',
    operator: '',
    value: ''
  });

  const [outputVariable, setOutputVariable] = useState({
    type: '',
    key: '',
    value: ''
  });

  const [reference, setReference] = useState({
    referenceType: '',
    referenceUrl: '',
    inputVariable: inputVariable,
    outputVariable: outputVariable
  });

  const [step, setStep] = useState({
    stepName: '',
    stepType: '',
    useLabel: '',
    references: []
  });

  useEffect(() => {
    if (isEdit && normalizedInitialData) {
      setStep(normalizedInitialData);
    } else {
      setStep({
        stepName: '',
        stepType: '',
        useLabel: '',
        references: []
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    setStep({ ...step, [e.target.name]: e.target.value });
  };

  const handleReferenceChange = (e) => {
    setReference({ ...reference, [e.target.name]: e.target.value });
  };

  const handleOutputVariableChange = (e) => {
    const { name, value } = e.target;
    setOutputVariable({ ...outputVariable, [name]: value });
  };

  const removeReference = (index) => {
    const updatedReferences = step.references.filter((_, i) => i !== index);
    setStep({ ...step, references: updatedReferences });
  };

  const handleSaveReferences = () => {

    const newReference = {
      ...reference,
      inputVariable: { ...inputVariable },
      outputVariable: { ...outputVariable }
    };

    const updatedStep = addNewReference(step, newReference);
    setStep(updatedStep);

    setReferenceBoxOpen(false);
    setReference({ referenceType: '', referenceUrl: '', inputVariable: {}, outputVariable: {} });
    setInputVariable({ type: '', key: '', operator: '', value: '' });
    setOutputVariable({ type: '', key: '', value: '' });
  };


  const handleSaveReference = (selectedReference) => {
    if (isReferenceEdit) {
      const updatedReference = [...step.references];
      updatedReference[currentReferenceIndex] = selectedReference;
      setStep({ ...step, references: updatedReference });
    } else {
      setStep({ ...step, references: [...step.references, selectedReference] });
    }
    handleCloseReferencePopup();
  };



  const handleCloseReferencePopup = () => {
    setReferencePopupOpen(false);
    setIsReferenceEdit(false);
    setCurrentReferenceIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(step);
    handleClose();
  };

  const normalizePath = (path) => {
    if (path) {
      return path.replace(/\\/g, '/'); // Convert all backslashes to forward slashes
    } else {
      console.log('path is invalid');
    }
  };

  const handleEditReference = (index) => {

    const reference = step.references[index];
    if (reference.referenceType == "JSONRef") {
      const jsonRef = step.references[index].referenceUrl; // Path from normalizedInitialData      
      const file = allFiles.find(file => normalizePath(file.filePath).includes(normalizePath(jsonRef)));

      if (file) {
        navigate('/add-ref', { state: { fileData: file, allFiles: allFiles } });
      } else {
        console.log('File not found for referenceIndex:', index);
      }
    } else if (reference.referenceType == "funcRef") {
      // Handle funcRef editing here
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modalContainer}
    >
      <Box className={classes.modalContent}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography id="modal-title" className='heading'>
            {isEdit ? <h3>Step Details</h3> : <h3>Step Details</h3>}
          </Typography>
          <IconButton style={{ backgroundColor: 'red', color: 'white' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>General Information</h3>
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
                {ALL_OBJECTS.map((option) => (
                  <MenuItem key={option.label} value={option.label}> {option.label} </MenuItem>
                ))}
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
            <Grid container style={{ paddingLeft: '2%', paddingBottom: '20px' }} >
              <ul className='listItem'>
                {step.references.map((reference, index) => (
                  <li key={index} className="stepItem">
                    <span className="stepName">
                      {reference.referenceType || `Reference ${index + 1}`}
                    </span>
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
              <Button
                variant="contained" color="primary" className="add-step-button"
                onClick={() => setReferencePopupOpen(true)}
              >
                Add Reference
              </Button>
              <ReferencePopup
                open={referencePopupOpen}
                handleClose={handleCloseReferencePopup}
                onSubmit={handleSaveReference}
                initialData={isReferenceEdit ? step.references[currentReferenceIndex] : null}
                isEdit={isReferenceEdit}
              />
            </Grid>
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
                    onClick={handleSaveReferences}
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
