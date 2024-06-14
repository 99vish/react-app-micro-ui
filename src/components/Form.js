// src/Form.js
import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [stepName, setStepName] = useState('');
  const [stepType, setStepType] = useState('');
  const [actionType, setActionType] = useState('');
  const [generateReference, setGenerateReference] = useState(false);

  const handleReset = () => {
    setStepName('');
    setStepType('');
    setActionType('');
    setGenerateReference(false);
  };

  const handleGenerateJSON = () => {
    const jsonOutput = {
      stepName,
      stepType,
      actionType,
      generateReference,
    };
    console.log('Generated JSON:', JSON.stringify(jsonOutput, null, 2));
    alert('JSON generated! Check the console for details.');
  };

  return (
    <div className="form-container">
      <h2>Add JSON</h2>
      <div className="form-section">
        <h3>General Information</h3>
        <div className="form-group">
          <label>Step Name<span className="required">*</span></label>
          <input
            type="text"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            placeholder="Enter Step Name"
          />
        </div>
        <div className="form-group">
          <label>Step Type<span className="required">*</span></label>
          <select value={stepType} onChange={(e) => setStepType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Type1">Type 1</option>
            <option value="Type2">Type 2</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={generateReference}
              onChange={(e) => setGenerateReference(e.target.checked)}
            />
            Generate Reference JSON
          </label>
        </div>
      </div>
      <div className="form-section">
        <h3>Action Type</h3>
        <div className="form-group">
          <label>Action Type<span className="required">*</span></label>
          <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
            <option value="">Select Action</option>
            <option value="Action1">Action 1</option>
            <option value="Action2">Action 2</option>
          </select>
        </div>
      </div>
      <div className="form-buttons">
        <button className="reset-button" onClick={handleReset}>Reset</button>
        <button className="generate-button" onClick={handleGenerateJSON}>Generate JSON</button>
      </div>
    </div>
  );
};

export default Form;
