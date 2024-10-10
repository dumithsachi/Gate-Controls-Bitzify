import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/Signup';
import CardDetails from './components/Cards';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/card-details" element={<CardDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
