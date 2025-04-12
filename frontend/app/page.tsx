'use client'; // Required for hooks

import React, { useState, useEffect } from 'react';
import { getApplications } from '../services/api'; // Adjust path if needed
import LoginForm from './components/LoginForm'; // Adjust path if needed
import RegisterForm from './components/RegisterForm'; // Adjust path if needed
import { useAuth } from '../services/AuthContext'; // Use the custom hook

// Define an interface for the application data matching your backend model
interface Application {
    id: number;
    company_name: string;
    job_title: string;
    status: string;
    application_date: string; // Or Date
    // Add other fields as needed
}

export default function HomePage() {
    // Authentication state from context
    const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();

    // State for application data
    const [applications, setApplications] = useState<Application[]>([]);
    const [dataLoading, setDataLoading] = useState<boolean>(false); // Loading state specific to fetching applications
    const [error, setError] = useState<string | null>(null); // Error state for fetching/auth issues

    // State for toggling login/register forms
    const [showLogin, setShowLogin] = useState<boolean>(true);

    // Effect to fetch applications *only* when authenticated
    useEffect(() => {
        // Don't fetch if the authentication status is still being determined
        if (isAuthLoading) {
            return;
        }

        // Define the async function to fetch data
        const fetchApplications = async () => {
            setDataLoading(true);
            setError(null);      
            try {
                console.log("Attempting to fetch applications...");
                const data = await getApplications();
                setApplications(data);
            } catch (err: any) {
                console.error("Error fetching applications:", err);
                // Handle specific errors (like 401 Unauthorized)
                if (err.response && err.response.status === 401) {
                     // If unauthorized fetching data, likely expired/invalid token
                    setError("Your session may have expired. Please log in again.");
                    logout(); // Force logout if token invalid
                } else {
                    setError(err.message || "Failed to fetch applications.");
                }
                setApplications([]); // Clear applications on error
            } finally {
                setDataLoading(false); // Indicate data fetching has finished
            }
        };

        if (isAuthenticated) {
            fetchApplications();
        } else {
            // If the user is not authenticated (or logs out), clear the data and errors
            setApplications([]);
            setError(null); // Clear errors related to data fetching
            setDataLoading(false); 
        }

        // Rerun effect if authentication status or loading status changes
    }, [isAuthenticated, isAuthLoading, logout]);

    // --- Form Switching Handlers ---
    const switchToRegister = () => {
        setError(null); // Clear errors when switching forms
        setShowLogin(false);
    };
    const switchToLogin = () => {
        setError(null); // Clear errors when switching forms
        setShowLogin(true);
    };
    const handleRegisterSuccess = () => {
        alert("Registration successful! Please log in."); // Simple feedback
        setShowLogin(true);
    };

    // 1. Show primary loading indicator while checking auth status
    if (isAuthLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Loading session...</p>
            </div>
        );
    }

    // 2. Render Login/Register view if user is NOT authenticated
    if (!isAuthenticated) {
        return (
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Welcome</h2>
                 {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {showLogin ? (
                    <>
                        <LoginForm onLoginSuccess={function (): void {
                            throw new Error('Function not implemented.');
                        } } switchToRegister={function (): void {
                            throw new Error('Function not implemented.');
                        } }                            
                        />
                        <p style={{ marginTop: '15px', textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <button onClick={switchToRegister} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                                Register here
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm onRegisterSuccess={handleRegisterSuccess} switchToLogin={function (): void {
                                throw new Error('Function not implemented.');
                            } } />
                        <p style={{ marginTop: '15px', textAlign: 'center' }}>
                            Already have an account?{' '}
                            <button onClick={switchToLogin} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                                Login here
                            </button>
                        </p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Job Applications</h1>
                <div>
                    <span>Welcome, {user?.username || 'User'}!</span>
                    <button onClick={logout} style={{ marginLeft: '15px' }}>Logout</button>
                </div>
            </div>

            <h2>Your Applications</h2>

            {/* Data Loading State */}
            {dataLoading && <p>Loading applications...</p>}

            {/* Error State (only show if not loading) */}
            {error && !dataLoading && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Application List (only show if not loading and no errors) */}
            {!dataLoading && !error && (
                <ul>
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <li key={app.id} style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
                                <strong>{app.company_name}</strong> - {app.job_title} ({app.status})
                                <br />
                                <small>Applied on: {new Date(app.application_date).toLocaleDateString()}</small>
                                {/* TODO: Add edit/delete buttons/links here */}
                            </li>
                        ))
                    ) : (
                        <p>You haven't tracked any applications yet. Add your first one!</p>
                    )}
                </ul>
            )}

        </div>
    );
}