import React from "react";
import '../../styles/AuthForms.scss'; 

interface StartingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

const StartingPage: React.FC<StartingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
}) => {
  return (
    <div className="starting-page-container">
      <h1 className="starting-page-title">Welcome to Job Application Tracker</h1>
      <p className="starting-page-description">
        Organize and track your job applications effortlessly.
      </p>
      <div className="starting-page-actions">
        <button
          className="button button-primary"
          onClick={onNavigateToLogin}
        >
          Log In
        </button>
        <button
          className="button button-secondary"
          onClick={onNavigateToRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default StartingPage;