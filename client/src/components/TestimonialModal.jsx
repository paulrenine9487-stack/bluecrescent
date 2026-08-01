import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Globe, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon, 
  ShieldCheck, 
  ArrowRight, 
  X 
} from 'lucide-react';

export default function TestimonialModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: '',
    company_name: ''
  });
  
  // Form fields
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Generate Captcha Code
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setSubmitSuccess(false);
      setErrorMsg('');
      setCaptchaInput('');
      setEmail('');
      setWebsite('');
      setPhotoName('');
      setFormData({
        title: '',
        content: '',
        author_name: '',
        company_name: ''
      });
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Captcha Validation
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Invalid Captcha code. Please try again.');
      generateCaptcha();
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          author_name: formData.author_name,
          company_name: formData.company_name,
          status: 'pending'
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to submit testimonial.');
        generateCaptcha();
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection.');
      generateCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
    }
  };

  // Styled input styles helper (White background, dark text, mint border focus)
  const getInputStyle = (fieldName) => ({
    width: '100%',
    height: '58px',
    background: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    border: focusedField === fieldName ? '1px solid #00A198' : '1px solid #CBD5E1',
    borderRadius: '14px',
    padding: '0 18px 0 46px',
    fontSize: '15px',
    color: '#0B1F3A',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 0 18px rgba(0, 161, 152, 0.20)' : 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  });

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(3, 15, 34, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '100px 16px 40px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '760px',
          background: 'linear-gradient(180deg, #FFFFF0 0%, #FAF9F6 100%)', // Premium Ivory Background
          borderRadius: '24px',
          border: '1px solid rgba(11, 31, 58, 0.08)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(18px)',
          padding: '40px',
          position: 'relative',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(11, 31, 58, 0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B1F3A',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(11, 31, 58, 0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(11, 31, 58, 0.05)'}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {submitSuccess ? (
          /* SUCCESS STATE */
          <div 
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '20px',
              padding: '48px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.5s ease',
              margin: '20px 0'
            }}
          >
            <div 
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                marginBottom: '24px',
                animation: 'scaleIn 0.3s ease'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ width: '36px', height: '36px' }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0B1F3A', margin: '0 0 8px 0' }}>Thank you!</h2>
            <p style={{ fontSize: '16px', color: '#475569', margin: 0 }}>
              Your testimonial has been submitted successfully.
            </p>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} style={{ boxSizing: 'border-box' }}>
            {/* HEADER */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <span style={{ fontSize: '54px', color: '#00A198', lineHeight: 1, fontFamily: 'serif', display: 'block', opacity: 0.8 }}>“</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0B1F3A', margin: '-15px 0 6px 0' }}>
                Submit Your Testimonial
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', margin: '0 0 20px 0' }}>
                Share your experience with Blue Crescent Engineering.
              </p>
              {/* Divider */}
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #008B83 0%, #00A198 100%)', width: '80px', borderRadius: '2px' }} />
            </div>

            {errorMsg && (
              <div 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  color: '#EF4444', 
                  borderRadius: '12px', 
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  marginBottom: '20px',
                  fontWeight: '600'
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* FORM FIELDS - Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', marginBottom: '24px' }}>
              {/* Column 1: Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Full Name <span style={{ color: '#00A198' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'author_name' ? '#00A198' : '#64748B' }} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    style={getInputStyle('author_name')}
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    onFocus={() => setFocusedField('author_name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>What is your full name?</span>
              </div>

              {/* Column 2: Email */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Email <span style={{ color: '#00A198' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'email' ? '#00A198' : '#64748B' }} />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    style={getInputStyle('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>What is your email address?</span>
              </div>

              {/* Column 3: Company Name */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Company Name
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'company_name' ? '#00A198' : '#64748B' }} />
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    style={getInputStyle('company_name')}
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    onFocus={() => setFocusedField('company_name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>What is your company name?</span>
              </div>

              {/* Column 4: Company Website */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Company Website
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'website' ? '#00A198' : '#64748B' }} />
                  <input
                    type="url"
                    placeholder="https://www.company.com"
                    style={getInputStyle('website')}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    onFocus={() => setFocusedField('website')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Does your company have a website?</span>
              </div>

              {/* Column 5: Review Heading */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Review Heading
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'title' ? '#00A198' : '#64748B' }} />
                  <input
                    type="text"
                    placeholder="Excellent Work / High Quality Support"
                    style={getInputStyle('title')}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>A short title for your testimonial.</span>
              </div>

              {/* Column 6: Captcha */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Captcha <span style={{ color: '#00A198' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: focusedField === 'captcha' ? '#00A198' : '#64748B' }} />
                    <input
                      type="text"
                      required
                      placeholder="Enter Captcha"
                      style={getInputStyle('captcha')}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      onFocus={() => setFocusedField('captcha')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {/* Captcha Preview */}
                  <div 
                    onClick={generateCaptcha}
                    style={{
                      background: 'rgba(0, 161, 152, 0.08)',
                      border: '1px dashed rgba(0, 161, 152, 0.40)',
                      borderRadius: '14px',
                      padding: '0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '800',
                      letterSpacing: '5px',
                      color: '#00A198',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      height: '58px',
                      userSelect: 'none',
                      minWidth: '100px',
                      boxSizing: 'border-box'
                    }}
                    title="Click to refresh Captcha code"
                  >
                    {captchaCode}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Verify you are human. Click box to refresh.</span>
              </div>

              {/* Full Width: Testimonial Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Testimonial <span style={{ color: '#00A198' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{ position: 'absolute', left: '16px', top: '18px', color: focusedField === 'content' ? '#00A198' : '#64748B' }} />
                  <textarea
                    required
                    placeholder="Describe your experience with Blue Crescent Engineering services..."
                    style={{
                      width: '100%',
                      height: '170px',
                      background: '#FFFFFF',
                      backgroundColor: '#FFFFFF',
                      border: focusedField === 'content' ? '1px solid #00A198' : '1px solid #CBD5E1',
                      borderRadius: '14px',
                      padding: '18px 18px 18px 46px',
                      fontSize: '15px',
                      color: '#0B1F3A',
                      outline: 'none',
                      boxShadow: focusedField === 'content' ? '0 0 18px rgba(0, 161, 152, 0.20)' : 'none',
                      transition: 'all 0.3s ease',
                      resize: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    onFocus={() => setFocusedField('content')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>What do you think about our services?</span>
              </div>

              {/* Full Width: Upload Photo */}
              <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '600', color: '#0B2B59', fontSize: '14px', marginBottom: '6px' }}>
                  Upload Photo
                </label>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px',
                    height: '58px',
                    background: 'rgba(0, 0, 0, 0.02)',
                    border: '1px dashed rgba(0, 0, 0, 0.12)',
                    borderRadius: '14px',
                    padding: '0 18px',
                    boxSizing: 'border-box'
                  }}
                >
                  <label 
                    style={{
                      background: 'rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(0, 0, 0, 0.10)',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      color: '#0B1F3A',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)'}
                  >
                    <ImageIcon size={16} />
                    <span>Upload Button</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </label>
                  <span style={{ fontSize: '13px', color: photoName ? '#00A198' : '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {photoName || 'Supported formats: jpg, jpeg, png, webp'}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Would you like to include a photo?</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
              <button 
                type="button" 
                style={{
                  height: '56px',
                  padding: '0 28px',
                  background: 'transparent',
                  border: '1px solid rgba(11, 31, 58, 0.30)',
                  borderRadius: '14px',
                  color: '#0B1F3A',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(11, 31, 58, 0.05)';
                  e.currentTarget.style.border = '1px solid #0B1F3A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.border = '1px solid rgba(11, 31, 58, 0.30)';
                }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                style={{
                  height: '56px',
                  padding: '0 32px',
                  background: 'linear-gradient(135deg, #008B83 0%, #00A198 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 15px 35px rgba(0, 161, 152, 0.30)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxSizing: 'border-box',
                  transform: submitting ? 'none' : 'translateY(0px)'
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 161, 152, 0.40)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 161, 152, 0.30)';
                  }
                }}
              >
                <span>{submitting ? 'Submitting...' : 'Submit Testimonial'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Keyframe style injection & custom input placeholder style */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(11, 31, 58, 0.45) !important;
        }
      `}</style>
    </div>
  );
}
