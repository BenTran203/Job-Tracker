"use client";
import React, { useState, useEffect } from "react";
import { getApplications, deleteApplication } from "./lib/api/api";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ApplicationForm from "./components/interface/ApplicationForm";
import StartingPage from "./components/interface/StartingPage";
import type { Application } from "./components/interface/ApplicationForm";
import "../app/styles/AuthForms.scss";

export default function HomePage() {
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [showStartingPage, setShowStartingPage] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();

  // Load applications when authenticated
  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        } else {
          setError(err.message || "Failed to load applications.");
        }
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApps();
    } else {
      setApplications([]);
      setError(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, logout]);

  // Early returns
  if (authLoading) return <p>Loading session...</p>;

  if (showStartingPage) {
    return (
      <div className="auth-container">
        <StartingPage
          onNavigateToLogin={() => {
            setShowStartingPage(false);
            setShowLoginForm(true);
          }}
          onNavigateToRegister={() => {
            setShowStartingPage(false);
            setShowLoginForm(false);
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <h2>Welcome</h2>
        {error && <p>Error: {error}</p>}
        {showLoginForm ? (
          <>
            <LoginForm
              onLoginSuccess={() => setError(null)}
              switchToRegister={() => setShowLoginForm(false)}
            />
            <p>
              Don't have an account?{" "}
              <button className="switch-button" onClick={() => setShowLoginForm(false)}>
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm
              onRegisterSuccess={() => {
                alert("Registration successful! Please log in.");
                setShowLoginForm(true);
              }}
              switchToLogin={() => setShowLoginForm(true)}
            />
            <p>
              Already have an account?{" "}
              <button className="switch-button" onClick={() => setShowLoginForm(true)}>
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Authenticated UI
  return (
    <div className="main-app-container">
      <header className="app-header">
        <h1>Job Applications</h1>
        <div className="user-info">
          <span>Welcome, {user?.username || "User"}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {!showAddForm && !editingApp && (
        <button
          className="primary-button"
          onClick={() => {
            setShowAddForm(true);
            setEditingApp(null);
            setError(null);
          }}
        >
          + Add New Application
        </button>
      )}

      {showAddForm && !editingApp && (
        <ApplicationForm
          onSuccess={(newApp) => {
            setApplications((prev) => [newApp, ...prev]);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingApp && (
        <ApplicationForm
          key={editingApp.id}
          initialData={editingApp}
          onSuccess={(updatedApp) => {
            setApplications((prev) =>
              prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
            );
            setEditingApp(null);
          }}
          onCancel={() => setEditingApp(null)}
        />
      )}

      <h2>Your Applications</h2>
      {isLoading && <p>Loading applications...</p>}
      {error && !isLoading && <p>Error: {error}</p>}

      {!isLoading && !error && (
        <ul>
          {applications.length ? (
            applications.map((app) => (
              <li key={app.id}>
                <strong>{app.company_name}</strong> - {app.job_title} ({app.status})
                <br />
                <small>
                  Applied on:{" "}
                  {app.application_date
                    ? new Date(app.application_date).toLocaleDateString()
                    : "N/A"}
                </small>
                <div>
                  <button onClick={() => setEditingApp(app)}>Edit</button>
                  <button onClick={() => handleDelete(app.id)}>Delete</button>
                </div>
              </li>
            ))
          ) : (
            <p>You haven't tracked any applications yet.</p>
          )}
        </ul>
      )}
    </div>
  );

  // Delete handler
  async function handleDelete(id: number) {
    if (!window.confirm(`Delete application ID ${id}?`)) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err: any) {
      const message =
        err.response?.status === 404
          ? `Application not found (ID ${id}).`
          : err.response?.data?.message || "Failed to delete application.";
      setError(message);
    }
  }
}
