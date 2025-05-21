import '../../styles/AuthForms.scss'; 
import '../../styles/AuthPages.scss'; 
import React, { useState, FormEvent } from 'react';
import { loginUser } from '../../lib/api/api'; // Adjust path as needed

interface LoginFormProps {
    onLoginSuccess: () => void; // Callback function for successful login
    switchToRegister: () => void; // Callback to switch to register form
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, switchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log('Attempting login with:', { username, password });
            const response = await loginUser({ username, password });
            console.log('Login successful:', response);
            // --- End of TODO ---

            // If login is successful:
            onLoginSuccess(); // Call the success callback

        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="login-username" className="username" >Username:</label>
                <input
                    type="text"
                    id="login-username"
                    className="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div>
                <label htmlFor="login-password" className="password" >Password:</label>
                <input
                    type="password"
                    id="login-password"
                    className="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginForm;