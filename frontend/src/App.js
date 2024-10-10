import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/Signup';
import CardDetails from './components/Cards';
import TowerDetails from './components/Towers';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Nested Routes for Dashboard */}
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="card-details" element={<CardDetails />} />
                    <Route path="tower-details" element={<TowerDetails />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
