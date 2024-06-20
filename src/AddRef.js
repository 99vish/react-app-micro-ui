import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import React, { act, useState } from "react";
import HeaderDivider from './components/headerWithDivider';
import { STEP_TYPE_OPTIONS, ACTION_TYPE_OPTIONS, OBJECTS_OPTIONS, SELECTOR_TYPE_OPTIONS } from './components/constants';
import { Autocomplete, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PopupForm from './components/PopupForm';
import AddIcon from '@mui/icons-material/Add';

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
  let index = 1

  const [steps, setSteps] = useState({
    step: index,
    stepName: '',
    stepType: '',
    actions: []
  })

  let actions = steps.actions
  const [action, setAction] = useState({
    actionType: '',
    elementType: '',
    selector: '',
    occurance: '',
    x: '',
    y: '',
    value: '',
    url: ''
  })

  const [assertions, setAssertions] = useState({
    type: '',
    key: [''],
    operator: '',
    value: ''
  })

  const [outputVariable, setOutputVariable] = useState({
    type: '',
    key: [''],
    value: ''
  })

  const formData = {
    actions: steps.actions,
    assertions: assertions,
    outputVariables: outputVariable
  }


  const handleSaveAction = (selectedAction) => {
    if (isEdit) {
      const updatedActions = [...steps.actions];
      updatedActions[currentActionIndex] = selectedAction;
      setSteps({ ...steps, actions: updatedActions });
    } else {
      setSteps({ ...steps, actions: [...steps.actions, selectedAction] });
    }
    handleClosePopup();
  };

  const handleOpenPopup = () => setPopup(true);
  const handleEditButtonClick = (index) => {
    setCurrentActionIndex(index);
    setIsEdit(true);
    handleOpenPopup();
  };

  const removeAction = (index) => {
    const actions = steps.actions.filter((_, i) => i !== index);
    setSteps({ ...steps, actions });
  };

  const handleClosePopup = () => {
    setPopup(false);
    setIsEdit(false);
    setCurrentActionIndex(null);
    setAction({
      ...action,
      actionType: '',
      selectorType: '',
      selectedObject: '',
      selector: '',
      occurance: '',
      x: '',
      y: '',
      value: ''
    });
  };

  const handleAssertionChange = (e) => {
    const { name, value } = e.target;
    setAssertions({ ...assertions, [name]: value });
    console.log("HI")
  }

  const handleAssertionKeyChange = (index, event) => {
    const newKeys = [...assertions.key];
    newKeys[index] = event.target.value;
    setAssertions({
      ...assertions,
      key: newKeys,
    });
  };

  const addKeyField = () => {
    setAssertions({
      ...assertions,
      key: [...assertions.key, ''],
    });
  };

  const deleteKeyField = (index) => {
    const newKeys = assertions.key.filter((_, i) => i !== index);
    setAssertions({
      ...assertions,
      key: newKeys,
    });
  };

  const handleOutputKeyChange = (index, event) => {
    const newKeys = [...outputVariable.key];
    newKeys[index] = event.target.value;
    setOutputVariable({
      ...outputVariable,
      key: newKeys,
    });
  };

  const addOutputKeyField = () => {
    setOutputVariable({
      ...outputVariable,
      key: [...outputVariable.key, ''],
    });
  };

  const deleteOutputKeyField = (index) => {
    const newKeys = outputVariable.key.filter((_, i) => i !== index);
    setOutputVariable({
      ...outputVariable,
      key: newKeys,
    });
  };

  const handleOutputVariableChange = (e) => {
    const { name, value } = e.target;
    setOutputVariable({ ...outputVariable, [name]: value });
  }

  const generateJson = () => {
    const json = JSON.stringify(formData, null, 2);
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

      <Grid container style={{ marginBottom: '2%' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Assertions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Type
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              select
              name="type"
              placeholder='Select Type'
              style={{ width: '300px' }}
              value={assertions.type}
              onChange={handleAssertionChange}
            >
              {STEP_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}> {option} </MenuItem>
              ))}
            </TextField>
          </Grid>
          <div>
            Key
            {assertions.key.map((key, index) => (
              <Grid container alignItems="center" key={index}>
                <Grid item>
                  <TextField
                    margin='dense'
                    name="key"
                    placeholder="Enter Key"
                    id={`outputKey-${index}`}
                    type='text'
                    onChange={e => handleAssertionKeyChange(index, e)}
                    value={key}
                    variant='outlined'
                  />
                </Grid>
                {index === assertions.key.length - 1 && (
                  <>
                    <Grid item>
                      <IconButton onClick={addKeyField}>
                        <AddIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => deleteKeyField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </>
                )}
              </Grid>
            ))}
          </div>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Operator
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              select
              name="operator"
              placeholder='Select Operator'
              style={{ width: '300px' }}
              value={assertions.operator}
              onChange={handleAssertionChange}
            >
              <MenuItem key='equals' value='equals'> Equals </MenuItem>
              <MenuItem key='notEquals' value='notEquals'> Not Equals </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Value
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              margin='dense'
              name="value"
              placeholder="Enter Values"
              id="assertionValue"
              type='text'
              onChange={handleAssertionChange}
              value={assertions.value}
              variant='outlined'
            />
          </Grid>
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
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Type
              <span style={{ color: 'red' }}>*</span>
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
            <div>
              Key
              {outputVariable.key.map((key, index) => (
                <Grid container alignItems="center" key={index}>
                  <Grid item>
                    <TextField
                      margin='dense'
                      name="key"
                      placeholder="Enter Key"
                      id={`outputKey-${index}`}
                      type='text'
                      onChange={e => handleOutputKeyChange(index, e)}
                      value={key}
                      variant='outlined'
                    />
                  </Grid>
                  {index === outputVariable.key.length - 1 && (
                    <>
                      <Grid item>
                        <IconButton onClick={addOutputKeyField}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => deleteOutputKeyField(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Value
              <span style={{ color: 'red' }}>*</span>
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
        </Grid>
      </Grid>


      <Grid className='actions-grid' container direction="row" style={{ paddingBottom: '2%' }}>
        <HeaderDivider
          title={
            <div style={{ display: 'flex' }}>
              <h3 className={classes.headerStyle}>Actions</h3>
            </div>
          }
        />
        <Grid container direction="row" style={{ paddingLeft: '2%', paddingBottom: '20px' }}>
          <ul>
            {steps.actions.map((action, index) => (
              <li key={index} className="actionItem">
                <span className="actionName">{action.actionType || `Action ${index + 1}`}</span>
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
                      onClick={() => removeAction(index)}
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

