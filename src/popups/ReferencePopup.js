import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Modal, Typography, Grid, IconButton, MenuItem, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { REQUEST_TYPE } from '../constants/constants';
import HeaderDivider from '../components/headerWithDivider';
import { makeStyles } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import OutputVariablePopup from './OutputVariablePopup';
import InputVariablePopup from './InputVariablePopup';
import AssertionBoxPopup from '../popups/AssertionPopup';
import EditIcon from '@mui/icons-material/Edit';
import ActionPopup from './ActionPopup';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 700,
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
  },
  treeView: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
    overflowY: 'auto',
  },
  filePathContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
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
    maxHeight: '100vh',
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[5],
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



const ReferencePopup = ({ stepType, open, handleClose, onSubmit, initialData, isEdit, allFiles }) => {

  const classes = useStyles();

  const [reference, setReference] = useState({
    jsonRef: '',
    inputVariables: [],
    outputVariable: [],
    assertion: [],
    queryParams: [],
    reqType: '',
    url: '',
    payload: ''
  })

  const [actionPopupOpen, setActionPopupOpen] = useState(false);
  const [isActionEdit, setIsActionEdit] = useState(false);
  const [currentActionIndex, setCurrentActionIndex] = useState(null);
  const [params, setParams] = useState(false)
  const [inputVariablePopupOpen, setInputVariablePopupOpen] = useState(false)
  const [isInputVariableEdit, setIsInputVariableEdit] = useState(false)
  const [assertionPopupOpen, setAssertionPopupOpen] = useState(false);
  const [isAssertionEdit, setIsAssertionEdit] = useState(false);
  const [currentAssertionIndex, setCurrentAssertionIndex] = useState(null);
  const [outputVariablePopupOpen, setOutputVariablePopupOpen] = useState(false);
  const [isOutputVariableEdit, setIsOutputVariableEdit] = useState(false);
  const [currentOutputVariableIndex, setCurrentOutputVariableIndex] = useState(null);

  const normalizePath = (path) => {
    if (path) {
      return path.replace(/\\/g, '/'); // Convert all backslashes to forward slashes
    } else {
      console.log('path is invalid');
    }
  };

  const populateFileContent = (initialData) => {
    const jsonRef = initialData.referenceUrl; // Path from normalizedInitialData      
    const file = allFiles.find(file => normalizePath(file.filePath).includes(normalizePath(jsonRef)));

    if (file) {
      let fileContentJSON = JSON.parse(file.fileContent)
      initialData = {
        ...initialData,
        ...fileContentJSON
      }
      console.log(initialData)
      setReference(initialData)
    } else {
      console.log('File not found for referenceIndex:');
    }
  }
  const allFilePaths = allFiles.map(file => file.filePath);
  const directoryStructure = generateDirectoryStructure(allFilePaths);
  console.log(directoryStructure);


  useEffect(() => {
    if (isEdit && initialData) {
      initialData.referenceType === 'jsonRef' ? populateFileContent(initialData) : setReference(initialData);
      console.log(initialData)
    }
  }, [isEdit, initialData, open]);


  const handleRefTypeChange = (e) => {
    const newRefType = e.target.value;
    const oldRefValue = reference.jsonRef || reference.funcRef || "";
    setReference((prevReference) => {
      return {
        [newRefType]: oldRefValue,
      };
    });
  };

  const handleFilePathChange = (e) => {
    const { value } = e.target;
    setReference((prevReference) => {
      const refKey = prevReference.jsonRef !== undefined ? 'jsonRef' : 'funcRef';
      return {
        ...prevReference,
        [refKey]: value
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReference((prevReference) => ({
      ...prevReference,
      [name]: value
    }));
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

  const handleSaveQueryParams = (inputVariable) => {
    setReference((prevReference) => ({
      ...prevReference,
      queryParams: { ...inputVariable }
    }));
    handleCloseInputVariablePopup();
  };

  const handleSaveInputVariable = (inputVariable) => {
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

  const handleOpenInputVariablePopup = (prop) => {
    setInputVariablePopupOpen(true);
    setIsInputVariableEdit(reference?.[prop] && Object.keys(reference?.[prop]).length > 0);
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

  const removeItem = (arrayName, index) => {
    setReference((prevRef) => {
      const updatedArray = prevRef[arrayName].filter((_, i) => i !== index);
      return { ...prevRef, [arrayName]: updatedArray };
    });
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



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reference);
    handleClose();
  };


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modalContainer}
    >
      <Box className={classes.modalContent} sx={style}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography id="modal-title" className='heading'>
            {isEdit ? <h3>Edit References</h3> : <h3>Add Reference</h3>}
          </Typography>
          <IconButton className='closeButton' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Reference Information</h3>
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
                label='Select Type'
                style={{ width: '300px' }}
                value={Object.keys(reference)[0]}
                onChange={handleRefTypeChange}
              >
                <MenuItem key='funcRef' value='funcRef'> Functional Reference </MenuItem>
                <MenuItem key='jsonRef' value='jsonRef'> JSON Reference </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} ls={6} xl={6}>
              <div style={{ paddingTop: '5px' }}>
                FilePath
                <span style={{ color: 'red' }}>*</span>
              </div>
              <TextField
                margin='dense'
                name='referenceUrl'
                type='text'
                variant='outlined'
                id="referenceFilePath"
                onChange={handleFilePathChange}
                value={reference.jsonRef || reference.funcRef}
                placeholder="Enter FilePath"
              />
            </Grid>
          </Grid>

          {/* General Information Grid */}

          {stepType === "API" && <>
            <Grid container>
              <HeaderDivider
                title={
                  <div style={{ display: 'flex' }}>
                    <h3 className={classes.headerStyle}>HTTP Request Details</h3>
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

            {/* Query Params Grid */}
            <Grid className='reference-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
              <HeaderDivider
                title={
                  <div style={{ display: 'flex' }}>
                    <h3 className={classes.headerStyle}> Query Params</h3>
                  </div>
                }
              />
              <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
                <Grid item xs={12}>
                  {reference?.queryParams && Object.keys(reference.queryParams).length > 0 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenInputVariablePopup('queryParams')}
                    >
                      Edit QueryParams
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenInputVariablePopup}
                    >
                      Add QueryParams
                    </Button>
                  )}
                </Grid>
                <InputVariablePopup
                  stepType={stepType}
                  open={inputVariablePopupOpen}
                  handleClose={handleCloseInputVariablePopup}
                  onSave={handleSaveQueryParams}
                  initialData={isInputVariableEdit ? reference?.inputVariables : null}
                  isEdit={isInputVariableEdit}
                />
              </Grid>
            </Grid>
          </>}

          {/* Input Variables Grid */}
          {stepType === "UI" && <>
            <Grid className='reference-grid' container direction="row" style={{ paddingBottom: '5px', paddingTop: '20px' }}>
              <HeaderDivider
                title={
                  <div style={{ display: 'flex' }}>
                    <h3 className={classes.headerStyle}> Input Variables</h3>
                  </div>
                }
              />
              <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
                <Grid item xs={12}>
                  {reference?.inputVariables && Object.keys(reference.inputVariables).length > 0 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenInputVariablePopup('inputVariable')}
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
                  stepType={stepType}
                  open={inputVariablePopupOpen}
                  handleClose={handleCloseInputVariablePopup}
                  onSave={handleSaveInputVariable}
                  initialData={isInputVariableEdit ? reference?.inputVariables : null}
                  isEdit={isInputVariableEdit}
                />
              </Grid>
            </Grid>
          </>}

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
                stepType={stepType}
                open={outputVariablePopupOpen}
                handleClose={handleCloseOutputVariableBox}
                onSubmit={handleSaveOutputVariable}
                initialData={isOutputVariableEdit ? reference.outputVariables[currentOutputVariableIndex] : null}
                isEdit={isOutputVariableEdit}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
              {isEdit ? "Update Reference" : "Save Reference"}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal >
  );
};

export default ReferencePopup;