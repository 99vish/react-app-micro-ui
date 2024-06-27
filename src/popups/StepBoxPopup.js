import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, Tooltip, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { STEP_TYPE_OPTIONS } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { makeStyles } from '@material-ui/core';
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
    height: '90vh',
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
        referenceType: 'jsonRef',
        referenceUrl: ref.jsonRef,
        inputVariables: ref.inputVariables,
        outputVariables: ref.outputVariables
      };
    } else if ('funcRef' in ref) {
      return {
        referenceType: 'funcRef',
        referenceUrl: ref.funcRef,
        inputVariables: ref.inputVariables,
        outputVariables: ref.outputVariables
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

const StepBoxPopup = ({ open, handleClose, onSubmit, initialData, isEdit, allFiles }) => {

  const classes = useStyles();
  const [stepType, setStepType] = useState('')
  const normalizedInitialData = getNormalizedInitialData(initialData);
  const navigate = useNavigate();

  const [referencePopupOpen, setReferencePopupOpen] = useState(false);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(null);
  const [isReferenceEdit, setIsReferenceEdit] = useState(false);
  const [step, setStep] = useState({
    stepName: '',
    stepType: '',
    useLabel: '',
    references: []
  });

  

  useEffect(() => {
    if (isEdit && normalizedInitialData) {
      setStep(normalizedInitialData);
      setStepType(normalizedInitialData.stepType)
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

  const removeReference = (index) => {
    const updatedReferences = step.references.filter((_, i) => i !== index);
    setStep({ ...step, references: updatedReferences });
  };


  const handleSaveReference = (selectedReference) => {
    console.log(selectedReference);

    if (isReferenceEdit) {
      const updatedReference = [...step.references];
      updatedReference[currentReferenceIndex] = selectedReference;
      setStep((prevStep) => ({
        ...prevStep,
        references: updatedReference,
      }));
    } else {
      setStep((prevStep) => {
        let temp = {
          ...prevStep,
          references: [...prevStep.references, selectedReference],
        }
        return temp;
      })
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
    if (reference.referenceType == "jsonRef") {
      const jsonRef = step.references[index].referenceUrl; // Path from normalizedInitialData      
      const file = allFiles.find(file => normalizePath(file.filePath).includes(normalizePath(jsonRef)));

      if (file) {
        navigate('/add-ref', { state: { fileData: file, allFiles: allFiles, type: "jsonRef", stepType: stepType } });
        let fileContentJSON = stepType === "JSONRef" ? JSON.parse(file.fileContent) : file
        setCurrentReferenceIndex(index)
        setIsReferenceEdit(true)
        setReferencePopupOpen(true)
        navigate('/add-ref', { state: { fileData: file, allFiles: allFiles, type: "jsonRef", stepType: stepType } });
      } else {
        console.log('File not found for referenceIndex:', index);
      }
    } else if (reference.referenceType == "funcRef") {
      setCurrentReferenceIndex(index)
      setIsReferenceEdit(true)
      setReferencePopupOpen(true)
       navigate('/add-ref', { state: { fileData: reference, allFiles: allFiles, type: "funcRef", stepType: stepType } });
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
          <IconButton onClick={handleClose}>
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
                <MenuItem key='CarrierGo' value='CarrierGo'> CarrierGo </MenuItem>
                <MenuItem key='Logistics' value='Logistics'> Logistics </MenuItem>
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
                      {`${reference?.referenceType} - ${reference?.referenceUrl}` || `Reference ${index + 1}`}
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
                stepType={step.stepType}
                open={referencePopupOpen}
                handleClose={handleCloseReferencePopup}
                onSubmit={handleSaveReference}
                initialData={isReferenceEdit ? step.references[currentReferenceIndex] : null}
                isEdit={isReferenceEdit}
                allFiles={allFiles}
              />
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
