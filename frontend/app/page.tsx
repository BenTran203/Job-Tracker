"use client"; 
import React, { useState, useEffect } from "react";
import { getApplications, deleteApplication } from "./services/api"; 
import LoginForm from "./components/LoginForm"; 
import RegisterForm from "./components/RegisterForm"; 
import { useAuth } from "./services/AuthContext";
import ApplicationForm from "./components/ApplicationForm";
import type { Application } from "./components/ApplicationForm"; 
import "../app/styles/AuthForms.scss"; 

export default function HomePage() {
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

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
      setError(null);
      setDataLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, logout]);

  // Function to handle the successful creation of a new application
  const handleApplicationCreated = (newApplication: Application) => {
    setApplications((prevApps) => [newApplication, ...prevApps]);
    setShowAddForm(false);
    console.log("New application added to the list:", newApplication);
  };

// Function to handle the delete button click
const handleDeleteApplication = async (id: number) => {
  if (
      !window.confirm(
          `Are you sure you want to delete this application (ID: ${id})?`
      )
  ) {
      return; 
  }
  setError(null);

  console.log(`Attempting to delete application ID: ${id}`); 

  try {
      await deleteApplication(id);
      console.log(`API call for delete ID: ${id} completed.`);

      setApplications((prevApps) => {
          console.log('Current applications state:', prevApps);
          const nextApps = prevApps.filter((app) => app.id !== id);
          console.log('New applications state (after filter):', nextApps); 
          return nextApps; 
      });

      console.log(`Application with ID ${id} deleted successfully from state.`);

  } catch (err: any) {
      console.error(`Failed to delete application with ID ${id}:`, err); 
      console.error('Error status:', err.response?.status); 
      console.error('Error data:', err.response?.data);   

      let errorMsg = `Failed to delete application.`;
      if (err.response?.status === 404 || err.message?.includes('not found')) {
          errorMsg = `Failed to delete: Application with ID ${id} not found. It may have already been deleted.`;
      
      } else {
          errorMsg = err.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg); 
  }
};
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
    setEditingApplication(null);
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
      <div >
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
      >
        <h2>Welcome</h2>
        {error && <p>Error: {error}</p>}

        {showLogin ? (
          <>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              switchToRegister={switchToRegister}
            />
            <p >
              Don't have an account?{" "}
              <button
                onClick={switchToRegister}
               
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
            <p >
              Already have an account?{" "}
              <button
                onClick={switchToLogin}
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
      <div className="main-app-container">
        <header className="app-header">
        <h1>Job Applications</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || "User"}!</span>
          <button onClick={logout}>
            Logout
          </button>
        </div>
        </header>
      </div>

      {!showAddForm && !editingApplication && (
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingApplication(null);
            setError(null);
          }}
        className="primary-button"
        >
          + Add New Application
        </button>
      )}
      {showAddForm && !editingApplication && (
        <ApplicationForm
          onSuccess={handleApplicationCreated} 
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
      {error && !dataLoading && <p>Error: {error}</p>}

      {!dataLoading && !error && (
        <ul>
          {applications.length > 0 ? (
            applications.map((app) => (
              <li
                key={app.id}
                
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
                    onClick={() => handleEditClick(app)} 
                   
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(app.id)}
                   
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
      )}
    </div>
  );
}
