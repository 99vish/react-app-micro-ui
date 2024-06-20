import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import React, { useState } from "react";
import HeaderDivider from './components/headerWithDivider';
import { STEP_TYPE_OPTIONS, ACTION_TYPE_OPTIONS, OBJECTS_OPTIONS, SELECTOR_TYPE_OPTIONS } from './components/constants';
import { Autocomplete, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StepBoxPopup from './components/StepBoxPopup';

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

export default function AddRule(props) {
  // const context = useContext(AppContext);
  const classes = useStyles();


  const [stepBoxOpen, setStepBoxOpen] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [referenceBoxOpen, setReferenceBoxOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false);
  let index = 1


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

  const [references, setReferences] = useState({
    referenceType: '',
    referenceUrl: '',
    inputVariable: inputVariable,
    outputVariable: outputVariable
  })

  const [step, setStep] = useState({
    stepNumber: index,
    stepName: '',
    stepType: '',
    references: []
  })

  const [formData, setFormData] = useState({
    scenarioName: '',
    tags: '',
    dataSource: { filepath: '', rowId: '' },
    beforeAll: [],
    beforeEach: [],
    steps: [],
    afterEach: [],
    afterAll: []
  })


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
      setStep(stepToEdit);
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


  const generateJson = () => {
    const data = {

      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };
    const json = JSON.stringify(data, null, 2);
    console.log(json);


    // Create a blob from the JSON string
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demo.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL
    URL.revokeObjectURL(url);
  };


  return (
    <Grid container style={{ backgroundColor: "#fff" }}>
      <Grid container direction="row" className={classes.cardGrid}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <h5 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3a546b', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif ', paddingTop: '1rem', width: '50%' }}> Add JSON </h5>
          <Grid container direction="row-reverse" spacing={2} className={classes.stickToTop}>
            <Grid item style={{ marginleft: '2%' }}>
              <Button
                variant="contained" color="primary" className="button"
                onClick={generateJson}
              >
                Generate JSON
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
                <h3 className={classes.headerStyle}>Scenario Information</h3>
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
                <span style={{ color: 'red' }}>*</span>
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

        <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '5px', paddingRight: '4%', paddingTop: '20px' }}>
          <HeaderDivider
            title={
              <div style={{ display: 'flex' }}>
                <h3 className={classes.headerStyle}>Steps Information</h3>
              </div>
            }
          />
          <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <ul>
              {formData.steps.map((step, index) => (
                <li key={index} className="stepItem">
                  <span className="stepName">{step.stepName || `Step ${index + 1}`}</span>
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
            />
          </Grid>


          {/* References Grid Starts Here */}


        </Grid>
      </Grid>
    </Grid >
  )
}
