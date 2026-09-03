import React from 'react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import logoBlueImg from '../assets/logo1_transparent_blue.png';

export default function UnauthorizedPage({ onNavigate }) {
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('Home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #071C3B 0%, #0F2747 50%, #063B73 100%)',
      padding: '24px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 161, 152, 0.12) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 2,
        boxSizing: 'border-box'
      }}>
        {/* Company Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src={logoBlueImg}
            alt="Blue Crescent Engineering"
            style={{ height: '48px', objectFit: 'contain' }}
          />
        </div>

        {/* Security Warning Icon */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: '#DC2626',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.15)'
        }}>
          <ShieldAlert size={38} />
        </div>

        {/* 404 Code Badge */}
        <div style={{
          display: 'inline-block',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          fontSize: '13px',
          fontWeight: '800',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '4px 14px',
          borderRadius: '20px',
          marginBottom: '12px'
        }}>
          Error 404
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: '#0F172A',
          margin: '0 0 12px 0',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.5px'
        }}>
          404 – Unauthorized Entry
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '14.5px',
          color: '#64748B',
          lineHeight: '1.65',
          margin: '0 0 32px 0'
        }}>
          The route you are trying to access is restricted or does not exist. Access via this URL path has been disabled.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleGoHome}
            style={{
              background: 'linear-gradient(135deg, #063B73 0%, #0057B8 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(6, 59, 115, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 59, 115, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(6, 59, 115, 0.25)';
            }}
          >
            <Home size={16} /> Return to Home
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <div style={{
        marginTop: '28px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
        textAlign: 'center',
        zIndex: 2
      }}>
        © {new Date().getFullYear()} Blue Crescent Engineering. All rights reserved.
      </div>
    </div>
  );
}
