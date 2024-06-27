import { TextField, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from "react";
import HeaderDivider from '../components/headerWithDivider';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StepBoxPopup from '../popups/StepBoxPopup';
import { useLocation } from 'react-router-dom';
import HookPopup from '../popups/HookPopup';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { parsedObject } from '../constants/singleSourceString';

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
  hooksContainer: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  hookList: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  hookItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  hookName: {
    flexGrow: 1,
  },
  addButton: {
    marginTop: "10px",
    textTransform: "none",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 15px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 15px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  },
  sectionContent: {
    paddingLeft: '20px',
    paddingRight: '20px',
  }
  
}));

function generateDirectoryStructure(filePaths) {
  const directoryStructure = {};

  filePaths.forEach(filePath => {
    const parts = filePath.split('\\'); // Split by backslash to separate directories
    let currentLevel = directoryStructure;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part of the path (file name), directly store as file name
        if (Array.isArray(currentLevel)) {
          currentLevel.push(part);
        } else {
          currentLevel[part] = part;
        }
      } else {
        // Check if it's the second last part and initialize as array
        if (!currentLevel[part]) {
          currentLevel[part] = (index === parts.length - 2) ? [] : {};
        }
        currentLevel = currentLevel[part];
      }
    });
  });

  return directoryStructure;
}

export default function AddSteps(props) {
  // const context = useContext(AppContext);
  const classes = useStyles();
  const location = useLocation();

  const { fileData, allFiles } = location.state;

  console.log(JSON.parse(fileData.fileContent).beforeAll);
  console.log(parsedObject['any_byName'])

  const [stepBoxOpen, setStepBoxOpen] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [hookDialogOpen, setHookDialogOpen] = useState(false);
  const [currentHookIndex, setCurrentHookIndex] = useState(null);
  const [currentHookType, setCurrentHookType] = useState(null);
  const [formData, setFormData] = useState(JSON.parse(fileData.fileContent) || {
    scenarioName: '',
    tags: '',
    dataSource: {
      filepath: '',
      rowId: ''
    },
    steps: []
  });

  // State to manage expanded hooks
  const [expandedSections, setExpandedSections] = useState({
    beforeAll: false,
    beforeEach: false,
    afterAll: false,
    afterEach: false,
  });

  // Function to toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prevExpandedSections) => ({
      ...prevExpandedSections,
      [section]: !prevExpandedSections[section],
    }));
  };


  useEffect(() => {
    if (fileData) {
      setFormData(JSON.parse(fileData.fileContent));
      console.log(fileData)
    }
  }, [fileData]);

  const allFilePaths = allFiles.map(file=>file.filePath);
  const directoryStructure = generateDirectoryStructure(allFilePaths);
  console.log(directoryStructure);


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

  const [isGridVisible, setIsGridVisible] = useState(true)

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
      const step = formData.steps.length +1
      const updatedStep = {
        step,
        ...selectedStep
      }
      setFormData({ ...formData, steps: [...formData.steps, updatedStep] });
    }
    handleCloseStepBox();
  };

  const handleHookDialogOpen = (hookType, hookIndex) => {
    console.log("it came here");
    setCurrentHookType(hookType);
    setCurrentHookIndex(hookIndex);
    setHookDialogOpen(true);
  };

  const handleHookDialogClose = () => {
    setHookDialogOpen(false);
    setCurrentHookIndex(null);
    setCurrentHookType(null);
  };

  const handleSaveHook = (hookData) => {
    const updatedHooks = [...formData[currentHookType]];
    if (currentHookIndex !== null) {
      updatedHooks[currentHookIndex] = hookData;
    } else {
      updatedHooks.push(hookData);
    }
    setFormData({ ...formData, [currentHookType]: updatedHooks });
    handleHookDialogClose();
  };

  const removeHook = (hookType, index) => {
    const updatedHooks = formData[hookType].filter((_, i) => i !== index);
    setFormData({ ...formData, [hookType]: updatedHooks });
  };

  const saveAsJson = async () => {
    const jsonString = JSON.stringify(formData, null, 2);
    try {
      const handle = await window.showSaveFilePicker();
      const writableStream = await handle.createWritable();
      await writableStream.write(jsonString);
      await writableStream.close();
    } catch (err) {
      console.error('Error saving file:', err);
    }

  };

  const saveJson = async () => {
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileData.fileName}`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // Function to toggle section expansion


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
                Generate JSON
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
            {/* <Grid item>
              <Button
                variant="contained" color="secondary" className="button"
              // onClick={resetData}
              >
                Reset
              </Button>
            </Grid> */}
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

       {/* Hooks Information Grid */}
      <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '40px', paddingTop: '20px' }} >
        <HeaderDivider
          title={
            <div style={{ display: "flex" }}>
              <h3 className={classes.headerStyle}>Hooks Information</h3>
            </div>
          }
        />
        <Grid container direction="column" style={{paddingLeft: '2%', marginRight: '2%', paddingTop: '15px', paddingRight: '3%', paddingBottom: '5px'}}>
        {["beforeAll", "beforeEach", "afterAll", "afterEach"].map((hookType) => (
          <div key={hookType} className={classes.collapsibleSection}>
            <div className={classes.sectionHeader} onClick={() => toggleSection(hookType)}>
              <span>
                <Typography className={classes.heading}>
                  {hookType.charAt(0).toUpperCase() + hookType.slice(1)}
                </Typography>
              </span>
              <div >
                {expandedSections[hookType] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              
            </div>
            {expandedSections[hookType] && (
              <div className={classes.sectionContent}>
                <Grid container direction="column" className={classes.hooksContainer}>
                  <ul className={classes.hookList}>
                    {formData[hookType].map((hook, index) => (
                      <li key={index} className='stepItem'>
                        <span className={classes.stepName}>{hook.name || `Hook ${index + 1}`}</span>
                        <div className="stepReferences">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleHookDialogOpen(hookType, index)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => removeHook(hookType, index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.addButton}
                    onClick={() => handleHookDialogOpen(hookType, null)}
                  >
                    Add Hook
                  </Button>
                  <HookPopup
                    open={hookDialogOpen && currentHookType === hookType} // Adjust condition based on your logic
                    onClose={handleHookDialogClose}
                    onSave={handleSaveHook}
                    initialData={currentHookIndex !== null ? formData[hookType][currentHookIndex] : null}
                  />
                </Grid>
              </div>
            )}
            
          </div>
        ))}
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
                  <span className="stepName">{`${index + 1}. ${step.stepName} - (${step.stepType})` || `Step ${index + 1}`}</span>
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


