/**
 * Function to handle user login
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} - A promise that resolves with the user data if successful, otherwise throws an error
 */

// Base URL for the API endpoints, adjust if your backend URL changes
const API_BASE_URL = 'http://localhost:5050/user/';

const login = async (email, password) => {
    // Construct the full URL for the login endpoint
    const response = await fetch(`${API_BASE_URL}login`, {
        method: 'POST', // Use POST method for login
        headers: {'Content-Type': 'application/json'}, // Set content type as JSON
        body: JSON.stringify({ email, password }) // Convert the email and password to JSON string
    });
    

    // Parse the JSON response body
    const data = await response.json();

    // Check if the response status was 'ok' (HTTP status code in the range 200-299)
    if (response.ok) {
        // If login is successful, store the received JWT in local storage
        localStorage.setItem('token', data.token);
    } else {
        // If login is not successful, throw an error with the message from the server
        throw new Error(data.message);
    }
};

/**
 * Function to log out the user
 */
const logout = () => {
    // Remove the JWT from local storage to log out the user
    localStorage.removeItem('token');
};

// Export the login and logout functions for use in other parts of the application
export default {
    login,
    logout
};
