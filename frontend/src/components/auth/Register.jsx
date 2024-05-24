import React, { useState } from 'react';
import authService from '../../../services/authService'; // Ensure this path matches the location of your authService

function Register() {
    const [email, setEmail] = useState(''); // State to hold the email input
    const [password, setPassword] = useState(''); // State to hold the password input
    const [error, setError] = useState(''); // State to hold any error messages

    // Handle the registration form submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await authService.register(email, password); // Call register method from authService
            console.log('Registration successful', response); // Log success message and response from server
            // You might want to redirect or manage the application state here
        } catch (err) {
            setError(err.message); // Set error message if registration fails
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>} // Display error message if any
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state on change
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state on change
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;