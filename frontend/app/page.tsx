"use client"; // Required for hooks

import React, { useState, useEffect } from "react";
import { getApplications, deleteApplication, updateApplication } from "../services/api"; // Import Application type
import LoginForm from "./components/LoginForm"; // Adjust path if needed
import RegisterForm from "./components/RegisterForm"; // Adjust path if needed
import { useAuth } from "../services/AuthContext"; // Use the custom hook
import ApplicationForm from "./components/ApplicationForm";
import "../app/styles/AuthForms.scss"; // Adjust path if needed


export default function HomePage() {
  // Authentication state from context
  const [editingApplication, setEditingApplication] = useState<Application | null>(null); // Store the app being edited
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false); // Loading state specific to fetching applications
  const [error, setError] = useState<string | null>(null); // Error state for fetching/auth issues

  const [showLogin, setShowLogin] = useState<boolean>(true);

  useEffect(() => {
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
        if (err.response && err.response.status === 401) {
          setError("Your session may have expired. Please log in again.");
          logout();
        } else {
          setError(err.message || "Failed to fetch applications.");
        }
        setApplications([]);
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApplications();
    } else {
      setApplications([]);
      setError(null); // Clear errors related to data fetching
      setDataLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, logout]);

  const handleApplicationCreated = (newApplication: Application) => {
    // Add the new application to the beginning of the existing list
    setApplications((prevApps) => [newApplication, ...prevApps]);
    setShowAddForm(false);
    console.log("New application added to the list:", newApplication);
  };
  const handleDeleteApplication = async (id: number) => {
    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete this application (ID: ${id})?`)) {
        return; // Stop if user cancels
    }

    try {
        await deleteApplication(id); // Call the API function
        setApplications(prevApps => prevApps.filter(app => app.id !== id));
        console.log(`Application with ID ${id} deleted successfully.`);

    } catch (err: any) {
        console.error(`Failed to delete application with ID ${id}:`, err);
        setError(err.response?.data?.message || err.message || `Failed to delete application.`);
    } finally {}
};

  const handleCancelAddForm = () => {
    setShowAddForm(false); // Simply hide the form
  };

  const switchToRegister = () => {
    setError(null);
    setShowLogin(false);
  };
  const switchToLogin = () => {
    setError(null);
    setShowLogin(true);
  };
  const handleRegisterSuccess = () => {
    alert("Registration successful! Please log in.");
    setShowLogin(true);
  };
  const handleLoginSuccess = () => {
    setError(null);
    console.log("Login successful handler called in HomePage.");
  };
  const handleEditClick = (application: Application) => {
    setEditingApplication(application); 
    setShowAddForm(false);

};
  if (isAuthLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading session...</p>
      </div>
    );
  }

  // 2. Render Login/Register view if user is NOT authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          border: "px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <h2>Welcome</h2>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {showLogin ? (
          <>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              switchToRegister={switchToRegister}
            />
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Don't have an account?{" "}
              <button
                onClick={switchToRegister}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              switchToLogin={switchToLogin}
            />
            <p style={{ marginTop: "15px", textAlign: "center" }}>
              Already have an account?{" "}
              <button
                onClick={switchToLogin}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Job Applications</h1>
        <div>
          <span>Welcome, {user?.username || "User"}!</span>
          <button onClick={logout} style={{ marginLeft: "15px" }}>
            Logout
          </button>
        </div>
      </div>
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          style={{ marginBottom: "20px" }}
        >
          + Add New Application
        </button>
      ) : (
        <ApplicationForm
          onSuccess={handleApplicationCreated}
          onCancel={handleCancelAddForm} // Pass the cancel handler
        />
      )}

      <h2>Your Applications</h2>

      {/* Data Loading State */}
      {dataLoading && <p>Loading applications...</p>}

      {/* Error State (only show if not loading) */}
      {error && !dataLoading && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Application List (only show if not loading and no errors) */}
      {!dataLoading && !error && (
        // ... inside the {!dataLoading && !error && ( ... )} block ...
        <ul>
          {applications.length > 0 ? (
            applications.map((app) => (
              <li
                key={app.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  {" "}
                  {/* Group application details */}
                  <strong>{app.company_name}</strong> - {app.job_title} (
                  {app.status})
                  <br />
                  <small>
                    Applied on:{" "}
                    {new Date(app.application_date).toLocaleDateString()}
                  </small>
                  {/* TODO: Add more details if needed */}
                </div>
                <div>
                <button
                        onClick={() => handleEditClick(app)} // Pass the whole app object
                        style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Edit
                    </button>
                  <button
                    onClick={() => deleteApplication(app.id)} // Call handler with app ID
                    style={{
                      marginLeft: "10px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    // Add disabled state if needed while deleting
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>You haven't tracked any applications yet. Add your first one!</p>
          )}
        </ul>
        // ...
      )}
    </div>
  );
}
