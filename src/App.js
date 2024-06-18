import React from 'react';
import './styles.css';
import AddSteps from './AddSteps'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddRef from './AddRef';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/add-steps" element={<AddSteps />} />
                    <Route path="/add-ref" element={<AddRef />} />
                    <Route path="/"  element={<AddSteps />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
