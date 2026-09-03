import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, ShieldAlert } from 'lucide-react';
import './MaintenancePage.css';
import logoBlueImg from '../assets/logo1_transparent_blue.png';

export default function MaintenancePage({ onNavigate, maintenanceData }) {
  const [isChecking, setIsChecking] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [statusInfo, setStatusInfo] = useState({
    title: maintenanceData?.maintenanceTitle || 'WEBSITE UNDER MAINTENANCE',
    message: maintenanceData?.maintenanceMessage || 'We are currently performing scheduled maintenance to improve our website and digital services.\nThank you for your patience.\nWe will be back online shortly.'
  });

  useEffect(() => {
    // Fetch latest content text if not passed directly
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/settings/maintenance-status');
        if (res.ok) {
          const data = await res.json();
          if (data.maintenanceTitle) {
            setStatusInfo({
              title: data.maintenanceTitle,
              message: data.maintenanceMessage
            });
          }
        }
      } catch (err) {
        console.warn('Could not refresh maintenance content:', err);
      }
    };
    fetchStatus();
  }, []);

  const handleCheckAgain = async () => {
    setIsChecking(true);
    setToastMessage('Checking website status...');

    try {
      const res = await fetch('/api/settings/maintenance-status');
      if (res.ok) {
        const data = await res.json();
        if (data.maintenanceMode === false) {
          setToastMessage('Website is Live! Redirecting...');
          setTimeout(() => {
            window.location.reload();
          }, 400);
          return;
        } else {
          setToastMessage('Status checked: Maintenance is still in progress. Please check back shortly.');
        }
      } else {
        setToastMessage('Unable to check status right now. Please try again.');
      }
    } catch (err) {
      setToastMessage('Network check failed. Please refresh the page.');
    } finally {
      setTimeout(() => {
        setIsChecking(false);
      }, 500);

      // Clear toast message after 4 seconds
      setTimeout(() => {
        setToastMessage('');
      }, 4000);
    }
  };

  return (
    <div className="maintenance-page-root">
      <div className="maintenance-bg-glow" />

      <main className="maintenance-card">
        {/* Company Branding Logo */}
        <div className="maintenance-logo-wrap">
          <img 
            src={logoBlueImg} 
            alt="Blue Crescent Engineering" 
            className="maintenance-logo" 
          />
        </div>

        <p className="maintenance-company-title">BLUE CRESCENT ENGINEERING</p>
        <h1 className="maintenance-heading">{statusInfo.title}</h1>
        
        <div className="maintenance-divider" />

        <p className="maintenance-message">
          {statusInfo.message}
        </p>

        {/* Status Indicator */}
        <div className="maintenance-status-badge">
          <span className="maintenance-status-dot" />
          <span>SYSTEM STATUS: MAINTENANCE IN PROGRESS</span>
        </div>

        {/* Check Again Interactive Button */}
        <div className="maintenance-btn-wrap">
          <button 
            type="button"
            className="maintenance-check-btn"
            onClick={handleCheckAgain}
            disabled={isChecking}
          >
            <RefreshCw size={16} className={isChecking ? 'spin-icon' : ''} style={isChecking ? { animation: 'spin 1s linear infinite' } : {}} />
            {isChecking ? 'CHECKING STATUS...' : 'CHECK AGAIN'}
          </button>

          {toastMessage && (
            <div className="maintenance-toast" role="status">
              {toastMessage}
            </div>
          )}
        </div>
      </main>

      {/* Admin Quick Access Bypass Link */}
      <footer className="maintenance-footer-link">
        <button 
          type="button" 
          className="maintenance-admin-link"
          onClick={() => {
            if (onNavigate) {
              onNavigate('Admin');
            } else {
              window.location.href = '/manager';
            }
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Lock size={13} /> Admin Portal Access
        </button>
      </footer>
    </div>
  );
}
