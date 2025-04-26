"use client"; // Required for hooks

import React, { useState, useEffect } from "react";
import { updateApplication as apiUpdateApplication } from "../services/api"; // Import update function
import { getApplications, deleteApplication } from "../services/api"; // Import Application type
import LoginForm from "./components/LoginForm"; // Adjust path if needed
import RegisterForm from "./components/RegisterForm"; // Adjust path if needed
import { useAuth } from "../services/AuthContext"; // Use the custom hook
import ApplicationForm from "./components/ApplicationForm";
import type { Application } from "./components/ApplicationForm"; // Import the TYPE here
import "../app/styles/AuthForms.scss"; // Adjust path if needed

export default function HomePage() {
  // Authentication state from context
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null); // Store the app being edited
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
// Inside HomePage component

const handleDeleteApplication = async (id: number) => {
  if (
      !window.confirm(
          `Are you sure you want to delete this application (ID: ${id})?`
      )
  ) {
      return; // Stop if user cancels
  }

  // Clear previous errors/messages before starting
  setError(null);
  // setSuccessMessage(null); // If you add a success message state

  console.log(`Attempting to delete application ID: ${id}`); // Log start

  try {
      // 1. Call the API function
      await deleteApplication(id);
      console.log(`API call for delete ID: ${id} completed.`); // Log success step 1

      // 2. Update the state (THIS IS KEY FOR IMMEDIATE UI UPDATE)
      setApplications((prevApps) => {
          console.log('Current applications state:', prevApps); // Log previous state
          const nextApps = prevApps.filter((app) => app.id !== id);
          console.log('New applications state (after filter):', nextApps); // Log next state
          return nextApps; // Return the new array without the deleted item
      });

      // 3. Provide success feedback (Optional but recommended)
      console.log(`Application with ID ${id} deleted successfully from state.`);
      // You could set a temporary success message state here
      // setSuccessMessage(`Application ${id} successfully deleted!`);
      // setTimeout(() => setSuccessMessage(null), 3000); // Clear after 3s

  } catch (err: any) {
      // 4. Handle errors IF the API call failed
      console.error(`Failed to delete application with ID ${id}:`, err); // Log the full error object
      console.error('Error status:', err.response?.status); // Log status code if available
      console.error('Error data:', err.response?.data);   // Log response data if available

      let errorMsg = `Failed to delete application.`;
      if (err.response?.status === 404 || err.message?.includes('not found')) {
          errorMsg = `Failed to delete: Application with ID ${id} not found. It may have already been deleted.`;
          // Refresh list if desired when not found
          // fetchApplications();
      } else {
          // Use more specific error from backend if available
          errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg); // Set the error state to display it

  } finally {
      // Optional: handle loading states if you have them
      // setLoading(false);
  }
};
  // handle function
  const handleCancelAddForm = () => {
    setShowAddForm(false);
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

  // Function to handle the edit button click
  const handleEditClick = (application: Application) => {
    setEditingApplication(application);
    setShowAddForm(false);
  };
  const handleUpdateSuccess = (updatedApplication: Application) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
    setEditingApplication(null);
    console.log(
      "Application updated successfully in list:",
      updatedApplication
    );
  };
  const handleCancelEdit = () => {
    setEditingApplication(null); // Exit editing mode without saving
  };
  const handleApplicationUpdated = (updatedApplication: Application) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === updatedApplication.id ? updatedApplication : app
      )
    );
    setEditingApplication(null);
    console.log(
      "Application updated successfully in list:",
      updatedApplication
    );
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

      {!showAddForm && !editingApplication && (
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingApplication(null);
            setError(null);
          }}
          style={{ marginBottom: "20px" }}
        >
          + Add New Application
        </button>
      )}
      {showAddForm && !editingApplication && (
        <ApplicationForm
          onSuccess={handleApplicationCreated} // Use the update handler
          onCancel={handleCancelAddForm}
        />
      )}
      {editingApplication && (
        <ApplicationForm
          key={editingApplication.id}
          initialData={editingApplication}
          onSuccess={handleApplicationUpdated}
          onCancel={handleCancelEdit}
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
                    {/* Check if app.application_date exists before creating Date */}
                    {
                      app.application_date
                        ? new Date(app.application_date).toLocaleDateString()
                        : "N/A"
                    }
                  </small>
                  {/* TODO: Add more details if needed */}
                </div>
                <div>
                  <button
                    onClick={() => handleEditClick(app)} // Pass the whole app object
                    style={{
                      background: "#ffc107",
                      color: "black",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(app.id)} // Call handler with app ID
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
