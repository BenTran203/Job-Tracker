'use client';

import React, { useState, FormEvent, useEffect } from 'react';
// Import both create and update API functions
import { createApplication, updateApplication } from '../../services/api'; // Adjust path if needed

interface ApplicationFormData {
    company_name: string;
    job_title: string;
    status?: string;
    application_date?: string;
    job_description?: string;
    notes?: string;
    url?: string;
}

export interface Application {
    id: number; 
    company_name: string;
    job_title: string;
    status?: string;
    application_date?: string | Date;
    job_description?: string;
    notes?: string;
    url?: string;
}

interface ApplicationFormProps {
    onSuccess: (updatedOrNewApplication: Application) => void; // Callback with the result
    onCancel?: () => void;
    initialData?: Application | null; // Optional data for editing
}

const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist', 'Other'];

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, onCancel, initialData }) => {
    const isEditing = !!initialData; // Determine if we are in edit mode

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

    // Effect to populate form when initialData is provided (for editing)
    useEffect(() => {
        if (isEditing && initialData) {
            // Format date correctly for the input type="date" (YYYY-MM-DD)
            const formattedDate = initialData.application_date
                ? new Date(initialData.application_date).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            setFormData({
                company_name: initialData.company_name || '',
                job_title: initialData.job_title || '',
                status: initialData.status || STATUS_OPTIONS[0],
                application_date: formattedDate,
                job_description: initialData.job_description || '',
                notes: initialData.notes || '',
                url: initialData.url || '',
            });
        } else {
             // Reset form if initialData is removed (e.g., cancel edit)
             setFormData({
                company_name: '',
                job_title: '',
                status: STATUS_OPTIONS[0],
                application_date: new Date().toISOString().split('T')[0],
                job_description: '',
                notes: '',
                url: '',
            });
        }
    }, [initialData, isEditing]); // Rerun effect if initialData changes

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // ... handleChange remains the same ...
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (!formData.company_name || !formData.job_title) {
            // ... validation remains the same ...
            setError('Company Name and Job Title are required.');
            setLoading(false);
            return;
        }

        try {
            let resultApplication: Application;
            if (isEditing && initialData) {
                // --- UPDATE ---
                console.log('Submitting updated application data:', formData);
                resultApplication = await updateApplication(initialData.id, formData); // Pass ID and data
                console.log('Application updated successfully:', resultApplication);
            } else {
                // --- CREATE ---
                console.log('Submitting new application data:', formData);
                resultApplication = await createApplication(formData);
                console.log('Application created successfully:', resultApplication);
            }
            onSuccess(resultApplication); 

        } catch (err: any) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} application:`, err);
            setError(err.response?.data?.message || err.message || `Failed to save application. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', marginTop: '20px', marginBottom: '20px' }}>
            {/* Change title based on mode */}
            <h3>{isEditing ? 'Edit Application' : 'Add New Application'}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* ... Form fields remain the same (company_name, job_title, etc.) ... */}
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
                    {loading ? 'Saving...' : (isEditing ? 'Update Application' : 'Save Application')}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ApplicationForm;