import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import HeaderDivider from '../components/headerWithDivider';
import { STEP_TYPE_OPTIONS, ACTION_TYPE_OPTIONS, OBJECTS_OPTIONS, SELECTOR_TYPE_OPTIONS } from '../constants/constants';
import { Autocomplete, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StepBoxPopup from '../popups/StepBoxPopup';
import { useLocation } from 'react-router-dom';

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

export default function AddSteps(props) {
  // const context = useContext(AppContext);
  const classes = useStyles();
  const location = useLocation();

  const { fileData, allFiles } = location.state;
  const [stepBoxOpen, setStepBoxOpen] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(JSON.parse(fileData.fileContent) || {
  scenarioName: '',
  tags: '',
  dataSource: {
    filepath: '',
    rowId: ''
  },
  steps: []
  });

  
  useEffect(() => {
    if (fileData) {
      setFormData(JSON.parse(fileData.fileContent));
    }
  }, [fileData]);


  const handleScenarioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleDataSourceChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, dataSource: { ...formData.dataSource, [name]: value } });
  }

  const handleEditButtonClick = (stepIndex) => {
    const stepToEdit = formData.steps[stepIndex];
    if (stepToEdit) {
      setCurrentStepIndex(stepIndex);
      setIsEdit(true);
      setStepBoxOpen(true);
    }
  };


  const removeStep = (index) => {
    const steps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps });
  };

  const handleCloseStepBox = () => {
    setStepBoxOpen(false);
    setIsEdit(false);
    setCurrentStepIndex(null);
  };

  const handleSaveAction = (selectedStep) => {
    if (isEdit) {
      const updatedSteps = [...formData.steps];
      updatedSteps[currentStepIndex] = selectedStep;
      setFormData({ ...formData, steps: updatedSteps });
    } else {
      setFormData({ ...formData, steps: [...formData.steps, selectedStep] });
    }
    handleCloseStepBox();
  };

  const saveAsJson = async () => {

      // Create a JSON string
    const jsonString = JSON.stringify(formData, null, 2);

    try {
      const handle = await window.showSaveFilePicker();
      const writableStream = await handle.createWritable();
      
      // Write the JSON string to the writable stream
      await writableStream.write(jsonString);
      
      // Close the writable stream
      await writableStream.close();
    } catch (err) {
        console.error('Error saving file:', err);
    }

  };

  const saveJson = async () => {
    const jsonString = JSON.stringify(formData, null, 2);

    // Convert JSON string to a Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Set attributes for download dialog
    link.setAttribute('download', `${fileData.fileName}`);
    link.style.display = 'none';
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Trigger the click event to open the save dialog
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    };



  return (
    <Grid container style={{ backgroundColor: "#fff" }}>
      <Grid container direction="row" className={classes.cardGrid}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <h5 className='heading'> Scenario Information </h5>
          <Grid container direction="row-reverse" spacing={2} className={classes.stickToTop}>
          <Grid item style={{ marginleft: '2%' }}>
              <Button
                variant="contained" color="primary" className={classes.button}
                onClick={saveJson}
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained" color="primary" className={classes.button}
                onClick={saveAsJson}
              >
                Save As
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained" color="secondary" className="button"
              // onClick={resetData}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </div>

        {/* Scenario Information Grid */}

        <Grid container style={{ marginBottom: '2%' }}>
          <HeaderDivider
            title={
              <div style={{ display: 'flex' }}>
                <h3 className={classes.headerStyle}>General Information</h3>
              </div>
            }
          />
          <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Scenario Name
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name="scenarioName"
                placeholder="Enter Scenario Name"
                id="scenarioName"
                type='text'
                onChange={e => handleScenarioChange(e)}
                value={formData.scenarioName}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Tags
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name="tags"
                placeholder="Enter Tags"
                id="Tags"
                type='text'
                onChange={e => handleScenarioChange(e)}
                value={formData.tags}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Data Source - FilePath
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name="filepath"
                placeholder="Enter filepath"
                type='text'
                onChange={e => handleDataSourceChange(e)}
                value={formData.dataSource.filepath}
                variant='outlined'
              />
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
                Data Source - Row ID
              </div>
              <TextField
                margin='dense'
                name="rowId"
                placeholder="Enter row ID"
                type='text'
                onChange={e => handleDataSourceChange(e)}
                value={formData.dataSource.rowId}
                variant='outlined'
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Steps Information */}

        <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
          <HeaderDivider
            title={
              <div style={{ display: 'flex' }}>
                <h3 className={classes.headerStyle}>Steps Information</h3>
              </div>
            }
          />
          <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <ul className='listItem'>
              {formData.steps.map((step, index) => (
                <li key={index} className="stepItem">
                  <span className="stepName">{`${step.stepName} - (${step.stepType})` || `Step ${index + 1}`}</span>
                  <div className='stepReferences'>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleEditButtonClick(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => removeStep(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="contained" color="primary" className="add-step-button"
              onClick={() => setStepBoxOpen(true)}
            >
              Add Step
            </Button>
            <StepBoxPopup
              open={stepBoxOpen}
              handleClose={handleCloseStepBox}
              onSubmit={handleSaveAction}
              initialData={isEdit ? formData.steps[currentStepIndex] : null}
              isEdit={isEdit}
              allFiles={allFiles}
            />
          </Grid>

        </Grid>
      </Grid>
    </Grid >
  )
}
