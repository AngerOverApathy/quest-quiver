// components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import authService from '../../../services/authService';

const Logout = () => {
    const navigate = useNavigate(); 

    const handleLogout = () => {
        authService.logout();
        console.log('Logout successful');
        navigate('/login'); 
    };

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
};

export default Logout;
