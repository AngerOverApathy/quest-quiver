import React from 'react';
import Register from '../../components/Register';
import Login from '../../components/Login';
import Logout from '../../components/Logout';

const AuthPage = () => {
    return (
        <div className='auth'>
            <Register />
            <Login />
            <Logout />
        </div>
    );
};

export default AuthPage;
