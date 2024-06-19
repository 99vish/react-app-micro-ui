import { TextField, Button, Grid, makeStyles } from '@material-ui/core';
import React, { useState } from "react";
import HeaderDivider from './components/headerWithDivider';
import { STEP_TYPE_OPTIONS, ACTION_TYPE_OPTIONS, OBJECTS_OPTIONS, SELECTOR_TYPE_OPTIONS } from './components/constants';
import { Autocomplete, MenuItem, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PopupForm from './components/PopupForm';

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
  const [actions, setActions] = useState({
    actionType: '',
    selectorType: '',
    selectedObject: '',
    selector: '',
    occurance: '',
    x: '',
    y: '',
    value: ''
  })

  const [selectorTypeIndex, setSelectorTypeIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSteps({ ...steps, [name]: value });
  }

  const handleScenarioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleSaveAction = (action) => {
    if (isEdit) {
      const updatedActions = [...steps.actions];
      updatedActions[currentActionIndex] = action;
      setSteps({ ...steps, actions: updatedActions });
    } else {
      setSteps({ ...steps, actions: [...steps.actions, action] });
    }
    handleClosePopup();
  };

  const handleDataSourceChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, dataSource: { ...formData.dataSource, [name]: value } });
  }
  const onSelectChange = (e) => {
    const { name, value } = e.target;
    setSteps({ ...steps, [name]: value });
  }

  const onSelectorTypeChange = (e) => {
    const { name, value } = e.target
    setActions({ ...actions, [name]: value })
    let tempActions = { ...actions };
    tempActions[name] = value;
    setSelectorTypeIndex(SELECTOR_TYPE_OPTIONS.indexOf(tempActions.selectorType))
    let tempIndex = SELECTOR_TYPE_OPTIONS.indexOf(tempActions.selectorType);

    setSelectedOptions(OBJECTS_OPTIONS[tempIndex])
  }


  const editStep = (stepIndex) => {
    const stepToEdit = formData.steps[stepIndex];
    if (stepToEdit) {
      setSteps(stepToEdit);
    }
  };
  const handleOpenPopup = () => setPopup(true);
  const handleEditButtonClick = (index) => {
    setCurrentActionIndex(index);
    setIsEdit(true);
    handleOpenPopup();
  };

  const removeStep = (index) => {
    const steps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps });
  };

  const removeAction = (index) => {
    const actions = steps.actions.filter((_, i) => i !== index);
    setSteps({ ...steps, actions });
  };

  const handleClosePopup = () => {
    setPopup(false);
    setIsEdit(false);
    setCurrentActionIndex(null);
    setActions({
      ...actions,
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
              name="stepType"
              placeholder='Select Step Type'
              style={{ width: '300px' }}
              value={steps.stepType}
              onChange={onSelectChange}
            >
              {STEP_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}> {option} </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Key
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              margin='dense'
              name="tags"
              placeholder="Enter Keys"
              id="Tags"
              type='text'
              onChange={e => handleScenarioChange(e)}
              value={formData.tags}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Operator
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              select
              name="stepType"
              placeholder='Select Step Type'
              style={{ width: '300px' }}
              value={steps.stepType}
              onChange={onSelectChange}
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
              name="rowId"
              placeholder="Enter Value"
              type='text'
              onChange={e => handleDataSourceChange(e)}
              value={formData.dataSource.rowId}
              variant='outlined'
            />
          </Grid>
        </Grid>
      </Grid>


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
              name="stepType"
              placeholder='Select Step Type'
              style={{ width: '300px' }}
              value={steps.stepType}
              onChange={onSelectChange}
            >
              {STEP_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}> {option} </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Value
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              margin='dense'
              name="rowId"
              placeholder="Enter Value"
              type='text'
              onChange={e => handleDataSourceChange(e)}
              value={formData.dataSource.rowId}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12} md={6} ls={6} xl={6}>
            <div style={{ paddingBottom: '5px', paddingTop: '10px' }}>
              Key
              <span style={{ color: 'red' }}>*</span>
            </div>
            <TextField
              margin='dense'
              name="tags"
              placeholder="Enter Keys"
              id="Tags"
              type='text'
              onChange={e => handleScenarioChange(e)}
              value={formData.tags}
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

