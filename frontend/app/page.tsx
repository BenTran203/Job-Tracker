'use client'; // Required for useState, useEffect

import React, { useState, useEffect } from 'react';
import { getApplications } from '../services/api'; // Adjust path if needed

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
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            setError(null);
            try {
                // Attempt to fetch applications
                const data = await getApplications();
                setApplications(data);
            } catch (err: any) {
                console.error("Error fetching applications:", err);
                // Handle specific errors (like 401 Unauthorized)
                if (err.response && err.response.status === 401) {
                     setError("Unauthorized. Please log in.");
                     // TODO: Redirect to login page or show login modal
                } else {
                    setError(err.message || "Failed to fetch applications.");
                }
                setApplications([]); // Clear applications on error
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            <h1>Job Applications</h1>

            {loading && <p>Loading applications...</p>}

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {!loading && !error && (
                <ul>
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <li key={app.id}>
                                <strong>{app.company_name}</strong> - {app.job_title} ({app.status})
                                {/* Add more details or links to edit/delete */}
                            </li>
                        ))
                    ) : (
                        <p>No applications found.</p>
                    )}
                </ul>
            )}

            {/* TODO: Add components for Login, Register, Add Application */}
        </div>
    );
}