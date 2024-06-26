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
import { Refresh } from '@mui/icons-material';
import { REQUEST_TYPE } from '../constants/constants';
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
  listItem: {
    paddingLeft: '2%',
    paddingBottom: '20px',
    listStyle: 'none',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '20px',
    paddingLeft: '2%'
  },
  actionName: {
    flexGrow: 1,
    marginRight: '10px',
  },
  button: {
    marginTop: '10px',
  },
}));

export default function AddRule(props) {
  // const context = useContext(AppContext);
  const classes = useStyles();
  const location = useLocation();
  const { fileData, allFiles, stepType } = location.state;

  const [jsonFileContent, setJsonFileContent] = useState(() => stepType === "JSONRef" ? JSON.parse(fileData.fileContent) : fileData);
  const [inputVariablePopupOpen, setInputVariablePopupOpen] = useState(false)
  const [isInputVariableEdit, setIsInputVariableEdit] = useState(false)
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

  const [reference, setReference] = useState({
    inputVariables: {},
    assertion: [],
    outputVariables: [],
    actions: [],
    reqType: '',
    url:'',
    payload:''
  })

  useEffect(() => {
    if (fileData) {
      setReference(jsonFileContent);
    }
  }, [fileData]);

  console.log(fileData);

  const handleSaveInputVariable = (inputVariable) => {
    const { key, value } = inputVariable;
    setReference((prevReference) => ({
      ...prevReference,
      inputVariables: { ...inputVariable }
    }));
    handleCloseInputVariablePopup();
  };

  const handleCloseInputVariablePopup = () => {
    setInputVariablePopupOpen(false);
    setIsInputVariableEdit(false);
  };

  const handleOpenInputVariablePopup = () => {
    setInputVariablePopupOpen(true);
    setIsInputVariableEdit(reference?.inputVariables && Object.keys(reference.inputVariables).length > 0);
  };


  const handleSaveAssertion = (selectedAssertion) => {
    if (isAssertionEdit) {
      const updatedAssertions = [...reference.assertion];
      updatedAssertions[currentAssertionIndex] = selectedAssertion;
      setReference({ ...reference, assertion: updatedAssertions });
    } else {
      setReference((prevRef) => ({
        ...prevRef,
        assertion: prevRef.assertion ? [...prevRef.assertion, selectedAssertion] : [selectedAssertion]
      }))
    }
    handleCloseAssertionBox();
  };


  const handleAssertionEditButtonClick = (index) => {
    const assertionToEdit = reference.assertion[index];
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
      const updatedOutputVariables = [...reference.outputVariables];
      updatedOutputVariables[currentOutputVariableIndex] = selectedOutputVariable;
      setReference({ ...reference, outputVariables: updatedOutputVariables });
    }
    else {
      setReference((prevRef) => ({
        ...prevRef,
        outputVariables: prevRef.outputVariables ? [...prevRef.outputVariables, selectedOutputVariable] : [selectedOutputVariable]
      }))
    }
    handleCloseOutputVariableBox();
  };

  const handleOutputVariableEditButtonClick = (index) => {
    const outputVariableToEdit = reference.outputVariables[index];
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
      const updatedActions = [...reference.actions];
      updatedActions[currentActionIndex] = selectedAction;
      setReference({ ...reference, actions: updatedActions });
    } else {
      setReference((prevRef) => ({
        ...prevRef,
        actions: prevRef.actions ? [...prevRef.actions, selectedAction] : [selectedAction]
      }))
    }
    setActionPopupOpen(false);
    setParams(false)
  };

  const handleChange = (e) => {
    const {name, value} = e.target
    setReference((prevReference) => ({
      ...prevReference,
      [name]: value
    }));
  }



  const removeItem = (arrayName, index) => {
    setReference((prevRef) => {
      const updatedArray = prevRef[arrayName].filter((_, i) => i !== index);
      return { ...prevRef, [arrayName]: updatedArray };
    });
  };

  const handleRefTypeChange = (e) => {
    const { name, value } = e.target;
    setRefType(value)
  }

  const saveAsJson = async () => {

    // Create a JSON string
    const jsonString = JSON.stringify(reference, null, 2);

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
    const jsonString = JSON.stringify(reference, null, 2);

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
    <Grid container direction="row" className={classes.cardGrid}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <h5 className='heading'> Reference Information </h5>
        <Grid container direction="row-reverse" spacing={2} className={classes.stickToTop}>
          <Grid item style={{ marginleft: '2%' }}>
            <Button
              variant="contained" color="primary" className="button"
              onClick={saveJson}
            >
              Save
            </Button>
          </Grid>
          <Grid item style={{ marginleft: '2%' }}>
            <Button
              variant="contained" color="primary" className="button"
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


      {/* Input Variable Grid */}

      <Grid className='reference-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
        <Grid item xs={1} md={1}>

          <TextField
            select
            placeholder='Reference Type'
            name="refType"
            value={refType}
            onChange={handleRefTypeChange}
            fullWidth
          >
            {STEP_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}> {option} </MenuItem>
            ))}
          </TextField>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Input Variables</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px', marginTop: '15px' }}>
          <Grid item xs={12}>
            {reference?.inputVariables && Object.keys(reference.inputVariables).length > 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenInputVariablePopup}
              >
                Edit Input Variables
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenInputVariablePopup}
              >
                Add Input Variables
              </Button>
            )}
          </Grid>
          <InputVariablePopup
            open={inputVariablePopupOpen}
            handleClose={handleCloseInputVariablePopup}
            onSave={handleSaveInputVariable}
            initialData={isInputVariableEdit ? reference?.inputVariables : null}
            isEdit={isInputVariableEdit}
          />
        </Grid>
      </Grid>

      {/* Assertions Grid */}

      <Grid className='reference-grid' container direction="row" style={{ paddingBottom: '20px', paddingTop: '20px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Assertions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {reference?.assertion && reference.assertion.map((assertion, index) => (
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
            stepType={stepType}
            open={assertionPopupOpen}
            handleClose={handleCloseAssertionBox}
            onSubmit={handleSaveAssertion}
            initialData={isAssertionEdit ? reference.assertion[currentAssertionIndex] : null}
            isEdit={isAssertionEdit}
          />
        </Grid>

      </Grid>


      {/* Actions Grid  */}

      <Grid className='actions-grid' container direction="row" style={{ paddingBottom: '5px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Actions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className='listItem'>
            {reference?.actions && reference.actions.map((action, index) => (
              <li key={index} className={classes.actionItem}>
                <span className={classes.actionName}>{`Action ${index + 1} --- ${Object.keys(action)[0]}`}</span>
                <div className='stepActions'>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditButtonClick(index)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => removeItem('actions', index)}>
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
          initialData={isActionEdit ? reference.actions[currentActionIndex] : null}
          isEdit={isActionEdit}
        />
      </Grid>

      {/* Output Variables Grid */}

      <Grid container style={{ marginBottom: '20px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Output Variables</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul className="listItem">
            {reference?.outputVariables && Array.isArray(reference?.outputVariables) &&
              reference?.outputVariables.map((outputVariable, index) => (
                <li key={index} className="stepItem">
                  <span className="stepName">
                    {`outputVariable ${index + 1} --- ${Array.isArray(outputVariable.key)
                      ? outputVariable.key.join(', ')
                      : outputVariable.key
                      }`}
                  </span>
                  <div className="stepReferences">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOutputVariableEditButtonClick(index)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => removeItem('outputVariables', index)}>
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
            className="add-step-button"
            onClick={() => setOutputVariablePopupOpen(true)}
          >
            Add Output Variables
          </Button>
          <OutputVariablePopup
            open={outputVariablePopupOpen}
            handleClose={handleCloseOutputVariableBox}
            onSubmit={handleSaveOutputVariable}
            initialData={isOutputVariableEdit ? reference.outputVariables[currentOutputVariableIndex] : null}
            isEdit={isOutputVariableEdit}
          />
        </Grid>
      </Grid>

      <Grid container style={{ marginBottom: '20px' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Other Information</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <Grid item xs={4} md={2} ls={2} xl={2}>
            <div style={{ paddingBottom: '8px', paddingTop: '10px' }}>
              Request Type
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              select
              name="reqType"
              placeholder='Select Request Type'
              fullWidth
              value={reference.reqType}
              onChange={handleChange}
            >
              {REQUEST_TYPE.map((operator) => (
                <MenuItem key={operator} value={operator}> {operator} </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={5} ls={5} xl={5} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <div style={{ paddingTop: '10px' }}>
              Url
            </div>
            <TextField
              margin='dense'
              name="url"
              placeholder="Enter Url"
              fullWidth
              id="url"
              type='url'
              onChange={handleChange}
              value={reference.url}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={6} md={4.5} ls={5} xl={5}>
            <div style={{ paddingTop: '10px' }}>
              Payload
            </div>
            <TextField
              margin='dense'
              name="payload"
              placeholder="Enter Payload"
              fullWidth
              id="payload"
              type='text'
              onChange={handleChange}
              value={reference.payload}
              variant='outlined'
            />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  )
}

