import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate logout logic here, e.g., clearing user data, tokens, etc.
        console.log('User logged out');

        // Redirect to the home page after logout
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
            <p>You will be redirected shortly.</p>
        </div>
    );
}