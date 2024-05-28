import React, { useState } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';

const AuthPage = () => {
    // State to track whether the user is in "Register" mode or "Login" mode
    const [isRegistering, setIsRegistering] = useState(false);

    // Function to toggle between Login and Register forms
    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="auth">
            {/* Conditionally render the Login or Register component */}
            {isRegistering ? <Register /> : <Login />}
            {/* Button to toggle between Login and Register forms */}
            <button onClick={toggleAuthMode}>
                {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Register"}
            </button>
        </div>
    );
};

export default AuthPage;