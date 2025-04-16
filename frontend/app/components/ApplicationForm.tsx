'use client';

import React, { useState, FormEvent } from 'react';
import { createApplication } from '../../services/api'; 

// Define the shape of the data the form handles, based on ApplicationCreationData
interface ApplicationFormData {
    company_name: string;
    job_title: string;
    status?: string;
    application_date?: string; 
    job_description?: string;
    notes?: string;
    url?: string;
}

// Define props for the component, including a success callback
interface ApplicationFormProps {
    onSuccess: (newApplication: any) => void; // Callback when creation is successful, passing the new app data
    onCancel?: () => void; 
}

// Define possible status options (customize as needed)
const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist', 'Other'];

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<ApplicationFormData>({
        company_name: '',
        job_title: '',
        status: STATUS_OPTIONS[0], 
        application_date: new Date().toISOString().split('T')[0],
        job_description: '',
        notes: '',
        url: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation (add more as needed)
        if (!formData.company_name || !formData.job_title) {
            setError('Company Name and Job Title are required.');
            setLoading(false);
            return;
        }

        try {
            console.log('Submitting application data:', formData);
            // Call the API function from api.ts
            const newApplication = await createApplication(formData);
            console.log('Application created successfully:', newApplication);

            // Call the success callback passed from the parent
            onSuccess(newApplication);

            // Optionally reset the form after successful submission
            setFormData({
                company_name: '',
                job_title: '',
                status: STATUS_OPTIONS[0],
                application_date: new Date().toISOString().split('T')[0],
                job_description: '',
                notes: '',
                url: '',
            });

        } catch (err: any) {
            console.error('Failed to create application:', err);
            setError(err.response?.data?.message || err.message || 'Failed to save application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', marginTop: '20px', marginBottom: '20px' }}>
            <h3>Add New Application</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Company Name */}
            <div>
                <label htmlFor="company_name">Company Name:</label>
                <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
            </div>

            {/* Job Title */}
            <div>
                <label htmlFor="job_title">Job Title:</label>
                <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
            </div>

            {/* Status */}
            <div>
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                >
                    {STATUS_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            {/* Application Date */}
            <div>
                <label htmlFor="application_date">Application Date:</label>
                <input
                    type="date"
                    id="application_date"
                    name="application_date"
                    value={formData.application_date}
                    onChange={handleChange}
                    disabled={loading}
                />
            </div>

            {/* Job URL */}
            <div>
                <label htmlFor="url">Job Posting URL:</label>
                <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="https://..."
                />
            </div>

            {/* Job Description */}
            <div>
                <label htmlFor="job_description">Job Description:</label>
                <textarea
                    id="job_description"
                    name="job_description"
                    value={formData.job_description}
                    onChange={handleChange}
                    rows={4}
                    disabled={loading}
                />
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes">Notes:</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    disabled={loading}
                />
            </div>

            {/* Buttons */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Application'}
                </button>
                {onCancel && ( // Only show Cancel button if onCancel prop is provided
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ApplicationForm;