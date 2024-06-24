import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import React, { act, useEffect, useState } from "react";
import HeaderDivider from '../components/headerWithDivider';
import { STEP_TYPE_OPTIONS, ACTION_TYPE_OPTIONS, OBJECTS_OPTIONS, SELECTOR_TYPE_OPTIONS } from '../constants/constants';
import { Autocomplete, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionPopup from '../popups/ActionPopup';
import { useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AssertionBoxPopup from '../popups/AssertionPopup';
import OutputVariablePopup from '../popups/OutputVariablePopup';
import InputVariablePopup from '../popups/InputVariablePopup';

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
  const location = useLocation();
  const { fileData, allFiles } = location.state;

  const [jsonFileContent, setJsonFileContent] = useState(() => JSON.parse(fileData.fileContent));
  const [inputVariablePopupOpen, setInputVariablePopupOpen] = useState(false)
  const [isInputVariableEdit, setIsInputVariableEdit] = useState(false)
  const [currentInputVariableIndex, setCurrentInputVariableIndex] = useState(false)
  const [actionPopupOpen, setActionPopupOpen] = useState(false);
  const [isActionEdit, setIsActionEdit] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(null);
  const [assertionPopupOpen, setAssertionPopupOpen] = useState(false);
  const [isAssertionEdit, setIsAssertionEdit] = useState(false);
  const [currentAssertionIndex, setCurrentAssertionIndex] = useState(null);
  const [outputVariablePopupOpen, setOutputVariablePopupOpen] = useState(false);
  const [isOutputVariableEdit, setIsOutputVariableEdit] = useState(false);
  const [currentOutputVariableIndex, setCurrentOutputVariableIndex] = useState(null);
  const [refType, setRefType] = useState('UI')
  const [params, setParams] = useState(false)

  const [steps, setSteps] = useState({
    inputVariables: [],
    assertion: [],
    outputVariables: [],
    actions: []
  })

  useEffect(() => {
    if (fileData) {
      setSteps(jsonFileContent);
    }
  }, [fileData]);

  console.log(fileData);

  const handleSaveInputVaraible = (inputVariables) => {
    console.log(inputVariables)
    setSteps({ ...steps, inputVariables: inputVariables })
    handleCloseInputVariablePopup();
  };

  console.log(jsonFileContent);
  console.log(jsonFileContent.actions)

  const handleInputVariableEditButtonClick = (index) => {
    const inputVariableToEdit = steps.inputVariables[index];
    if (inputVariableToEdit) {
      setCurrentInputVariableIndex(index);
      setIsInputVariableEdit(true);
      setInputVariablePopupOpen(true)
    }
  };

  const handleCloseInputVariablePopup = () => {
    setInputVariablePopupOpen(false);
    setIsInputVariableEdit(false);
    setCurrentInputVariableIndex(null);
  };


  const handleSaveAssertion = (selectedAssertion) => {
    if (isAssertionEdit) {
      const updatedAssertions = [...steps.assertion];
      updatedAssertions[currentAssertionIndex] = selectedAssertion;
      setSteps({ ...steps, assertion: updatedAssertions });
    } else {
      setSteps({ ...steps, assertion: [...steps.assertion, selectedAssertion] });
    }
    handleCloseAssertionBox();
  };


  const handleAssertionEditButtonClick = (index) => {
    const assertionToEdit = steps.assertion[index];
    if (assertionToEdit) {
      setCurrentAssertionIndex(index);
      setIsAssertionEdit(true);
      setAssertionPopupOpen(true)
    }
  };

  const handleCloseAssertionBox = () => {
    setAssertionPopupOpen(false);
    setIsAssertionEdit(false);
    setCurrentAssertionIndex(null);
  };

  const handleSaveOutputVariable = (selectedOutputVariable) => {
    if (isOutputVariableEdit) {
      const updatedOutputVariables = [...steps.outputVariables];
      updatedOutputVariables[currentOutputVariableIndex] = selectedOutputVariable;
      setSteps({ ...steps, outputVariables: updatedOutputVariables });
    } else {
      setSteps({ ...steps, outputVariables: [...steps.outputVariables, selectedOutputVariable] });
    }
    handleCloseOutputVariableBox();
  };

  const handleOutputVariableEditButtonClick = (index) => {
    const outputVariableToEdit = steps.outputVariables[index];
    if (outputVariableToEdit) {
      setCurrentOutputVariableIndex(index);
      setIsOutputVariableEdit(true);
      setOutputVariablePopupOpen(true)
    }
  };

  const handleCloseOutputVariableBox = () => {
    setOutputVariablePopupOpen(false);
    setIsOutputVariableEdit(false);
    setCurrentOutputVariableIndex(null);
  };

  const handleOpenPopup = () => setActionPopupOpen(true);

  const handleEditButtonClick = (index) => {
    setCurrentActionIndex(index);
    setIsActionEdit(true);
    handleOpenPopup();
    setParams(true)
  };

  const handleClosePopup = () => {
    setActionPopupOpen(false);
    setIsActionEdit(false);
    setCurrentActionIndex(null);
    setParams(false)
  };


  const handleSaveAction = (selectedAction) => {
    if (isActionEdit) {
      const updatedActions = [...steps.actions];
      updatedActions[currentActionIndex] = selectedAction;
      setSteps({ ...steps, actions: updatedActions });
    } else {
      setSteps({ ...steps, actions: [...steps.actions, selectedAction] });
    }
    setActionPopupOpen(false);
    setParams(false)
  };


  const removeItem = (arrayName, index) => {
    setSteps((prevSteps) => {
      const updatedArray = prevSteps[arrayName].filter((_, i) => i !== index);
      return { ...prevSteps, [arrayName]: updatedArray };
    });
  };

  const handleRefTypeChange = (e) => {
    const { name, value } = e.target;
    setRefType(value)
  }

  console.log(jsonFileContent);
  console.log(jsonFileContent.actions)

  const generateJson = () => {
    const json = JSON.stringify(steps, null, 2);
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
    <Grid container direction="row" className={classes.cardGrid}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <h5 className='heading'> Add Reference </h5>
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


      {/* Input Varaible Grid */}

      {/* {jsonFileContent.assertion && jsonFileContent.assertion.length > 0 && ( */}
      <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
        <Grid item xs={1} md={1}>

          <TextField
            select
            placeholder='Reference Type'
            name="refType"
            value={refType}
            onChange={handleRefTypeChange}
            fullWidth
          >
            <MenuItem key="UI" value="UI">UI</MenuItem>
            <MenuItem key="API" value="API">API</MenuItem>
          </TextField>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Input Variables</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {Array.isArray(steps?.inputVariables) && steps?.inputVariables.map((inputVariable, index) => (
              <li key={index} className="stepItem">
                <span className="stepName">{`inputVariable ${index + 1} --- ${inputVariable.type}`}</span>
                <div className='stepReferences'>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleInputVariableEditButtonClick(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => removeItem('inputVariables', index)}
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
            onClick={() => setInputVariablePopupOpen(true)}
          >
            Add InputVariable
          </Button>
          <InputVariablePopup
            open={inputVariablePopupOpen}
            handleClose={handleCloseInputVariablePopup}
            onSubmit={handleSaveInputVaraible}
            initialData={isInputVariableEdit ? steps.inputVariables[currentInputVariableIndex] : null}
            isEdit={isInputVariableEdit}
          />
        </Grid>
      </Grid>
      {/* )} */}

      {/* Assertions Grid */}

      {jsonFileContent.assertion && jsonFileContent.assertion.length > 0 && (
        <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '20px', paddingTop: '20px' }}>
          <HeaderDivider
            title={
              <div style={{ display: 'flex' }}>
                <h3 className={classes.headerStyle}>Assertions</h3>
              </div>
            }
          />
          <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
            <ul className='listItem'>
              {steps.assertion.map((assertion, index) => (
                <li key={index} className="stepItem">
                  <span className="stepName">{`assertion ${index + 1} --- ${assertion.type}`}</span>
                  <div className='stepReferences'>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleAssertionEditButtonClick(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => removeItem('assertion', index)}
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
              onClick={() => setAssertionPopupOpen(true)}
            >
              Add Assertion
            </Button>
            <AssertionBoxPopup
              open={assertionPopupOpen}
              handleClose={handleCloseAssertionBox}
              onSubmit={handleSaveAssertion}
              initialData={isAssertionEdit ? steps.assertion[currentAssertionIndex] : null}
              isEdit={isAssertionEdit}
            />
          </Grid>

        </Grid>
      )}

      {/* Actions Grid  */}
      
      <Grid className='actions-grid' container direction="row" style={{ paddingBottom: '2%' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Actions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {steps.actions.map((action, index) => (
              <li key={index} className="actionItem">
                <span className="actionName">{`Action ${index + 1} --- ${action.actionType}`}</span>
                <div className='stepActions'>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleEditButtonClick(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => removeItem('actions', index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>
          <Button
            variant="contained" color="primary" className="button"
            onClick={() => setActionPopupOpen(true)}
          >
            Add Action
          </Button>
        </Grid>
        <ActionPopup
          open={actionPopupOpen}
          openParams={params}
          handleClose={handleClosePopup}
          onSubmit={handleSaveAction}
          initialData={isActionEdit ? steps.actions[currentActionIndex] : null}
          isEdit={isActionEdit}
          actionsData={jsonFileContent.actions}
        />
      </Grid>
      <Grid container style={{ marginBottom: '20px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Output Variables</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {Array.isArray(steps?.inputVariables) && steps?.outputVariables.map((outputVariable, index) => (
              <li key={index} className="stepItem">
                <span className="stepName">{`outputVariable ${index + 1} --- ${outputVariable.type}`}</span>
                <div className='stepReferences'>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleOutputVariableEditButtonClick(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => removeItem('outputVariables', index)}
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
            onClick={() => setOutputVariablePopupOpen(true)}
          >
            Add Output_Variable
          </Button>
          <OutputVariablePopup
            open={outputVariablePopupOpen}
            handleClose={handleCloseOutputVariableBox}
            onSubmit={handleSaveOutputVariable}
            initialData={isOutputVariableEdit ? steps.outputVariables[currentOutputVariableIndex] : null}
            isEdit={isOutputVariableEdit}
          />
        </Grid>
      </Grid>

    </Grid>
  )
}

