import React, { useState, useEffect } from 'react';

const RunwayAlert = ({ runwayMonths }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show alert if runway is less than 3 months
    if (runwayMonths < 3) {
      setShowAlert(true);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Remove from DOM after fade out
        setTimeout(() => setShowAlert(false), 300);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
      setIsVisible(false);
    }
  }, [runwayMonths]);

  if (!showAlert) return null;

  return (
    <div className={`runway-alert ${isVisible ? 'visible' : ''}`}>
      <div className="runway-alert-content">
        <div className="runway-alert-icon">⚠️</div>
        <div className="runway-alert-text">
          <h3>Low Runway Warning</h3>
          <p>Your startup has only {runwayMonths} months of runway remaining. Consider raising funds or reducing expenses.</p>
        </div>
        <button 
          className="runway-alert-close"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => setShowAlert(false), 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default RunwayAlert; 