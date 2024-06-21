import React from 'react';
import './styles.css';
import AddSteps from './pages/AddSteps.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddRef from './pages/AddRef.js';
import LandingPage from './LandingPage.js';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/add-steps" element={<AddSteps />} />
                    <Route path="/add-ref" element={<AddRef />} />
                    <Route path="/"  element={<LandingPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
