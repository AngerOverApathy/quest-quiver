// components/Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom'; 
import authService from '../../../services/authService';

const Logout = () => {
    const history = useHistory(); 

    const handleLogout = () => {
        authService.logout();
        console.log('Logout successful');
        history.push('/login'); 
    };

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
};

export default Logout;
