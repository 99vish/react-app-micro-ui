import { Button, Grid, makeStyles } from '@material-ui/core';
import React, { useState } from "react";
import HeaderDivider from './components/headerWithDivider';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PopupForm from './components/PopupForm';
import AssertionBoxPopup from './components/AssertionsBoxPopup';
import OutputVariablePopup from './components/OutputVariablesPopup';

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


  const [isEdit, setIsEdit] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(null);
  const [popup, setPopup] = useState(false)
  const [assertionBoxOpen, setAssertionBoxOpen] = useState(false)
  const [isAssertionEdit, setIsAssertionEdit] = useState(false)
  const [currentAssertionIndex, setCurrentAssertionIndex] = useState(null)
  const [outputVariablePopupOpen, setOutputVariablePopupOpen] = useState(false)
  const [isOutputVariableEdit, setIsOutputVariableEdit] = useState(false)
  const [currentOutputVariableIndex, setCurrentOutputVariableIndex] = useState(null)


  const [steps, setSteps] = useState({
    assertions: [],
    outputVariables: [],
    actions: []
  })

  const handleSaveAssertion = (selectedAssertion) => {
    if (isAssertionEdit) {
      const updatedAssertions = [...steps.assertions];
      updatedAssertions[currentAssertionIndex] = selectedAssertion;
      setSteps({ ...steps, assertions: updatedAssertions });
    } else {
      setSteps({ ...steps, assertions: [...steps.assertions, selectedAssertion] });
    }
    handleCloseAssertionBox();
  };

  const handleAssertionEditButtonClick = (index) => {
    const assertionToEdit = steps.assertions[index];
    if (assertionToEdit) {
      setCurrentAssertionIndex(index);
      setIsAssertionEdit(true);
      setAssertionBoxOpen(true)
    }
  };

  const handleCloseAssertionBox = () => {
    setAssertionBoxOpen(false);
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

  const handleOpenPopup = () => setPopup(true);

  const handleEditButtonClick = (index) => {
    setCurrentActionIndex(index);
    setIsEdit(true);
    handleOpenPopup();
  };

  const handleClosePopup = () => {
    setPopup(false);
    setIsEdit(false);
    setCurrentActionIndex(null);
  };


  const handleSaveAction = (selectedAction) => {
    if (isEdit) {
        const updatedActions = [...steps.actions];
        updatedActions[currentActionIndex] = selectedAction;
        setSteps({ ...steps, actions: updatedActions });
    } else {
        setSteps({ ...steps, actions: [...steps.actions, selectedAction] });
    }
    setPopup(false);
};

  const removeItem = (arrayName, index) => {
    setSteps((prevSteps) => {
      const updatedArray = prevSteps[arrayName].filter((_, i) => i !== index);
      return { ...prevSteps, [arrayName]: updatedArray };
    });
  };
  

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

      {/* Assertions Grid */}

      <Grid className='steps-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Assertions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {steps.assertions.map((assertion, index) => (
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
                      onClick={() => removeItem('assertions', index)}
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
            onClick={() => setAssertionBoxOpen(true)}
          >
            Add Assertion
          </Button>
          <AssertionBoxPopup
            open={assertionBoxOpen}
            handleClose={handleCloseAssertionBox}
            onSubmit={handleSaveAssertion}
            initialData={isAssertionEdit ? steps.assertions[currentAssertionIndex] : null}
            isEdit={isAssertionEdit}
          />
        </Grid>

      </Grid>

      {/* Output Variables */}

      <Grid container style={{ marginBottom: '2%' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Output Variables</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {steps.outputVariables.map((outputVariable, index) => (
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

      {/* Actions  */}

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
            onClick={() => setPopup(true)}
          >
            Add Action
          </Button>
        </Grid>
        <PopupForm
          open={popup}
          handleClose={handleClosePopup}
          onSubmit={handleSaveAction}
          initialData={isEdit ? steps.actions[currentActionIndex] : null}
          isEdit={isEdit}
        />
      </Grid>
    </Grid>
  )
}

