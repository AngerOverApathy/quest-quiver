import React from 'react';
import Register from '../../components/Register';
import Login from '../../components/Login';

const AuthPage = () => {
    return (
        <div className='auth'>
            <Register />
            <Login />
        </div>
    );
};

export default AuthPage;
