import React, { useState, useEffect } from 'react';
import projectFallbackImg from '../assets/project1.png';
import DynamicBanner from './DynamicBanner';

// Helper to safely parse JSON strings or arrays
const parseArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    if (typeof input === 'string') {
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
};

export default function ProjectDetailPage({ projectSlug, projectData: initialData, onNavigate }) {
  const [project, setProject] = useState(initialData || null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (projectSlug) {
      setLoading(true);
      fetch(`/api/projects/${encodeURIComponent(projectSlug)}`)
        .then(res => {
          if (!res.ok) throw new Error('Project not found');
          return res.json();
        })
        .then(data => {
          if (data && data.project) {
            setProject(data.project);
            setRelatedProjects(data.relatedProjects || []);
          } else if (data && data.name) {
            setProject(data);
          } else {
            setError('Project not found');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load project details.');
          setLoading(false);
        });
    }
  }, [projectSlug]);

  if (loading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#063B73' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTopColor: '#087CFF', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: '600', fontSize: '15px' }}>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: '#063B73', marginBottom: '16px' }}>Project Not Found</h2>
        <p style={{ color: '#64748B', marginBottom: '32px' }}>The requested project details could not be located or may have been updated.</p>
        <button
          onClick={() => onNavigate('Projects')}
          style={{
            background: '#063B73',
            color: '#FFF',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back to Projects Listing
        </button>
      </div>
    );
  }

  // Parse JSON/Array fields safely
  const servicesList = parseArray(project.services);
  const disciplinesList = parseArray(project.disciplines);
  const deliverablesList = parseArray(project.deliverables);
  const technologiesList = parseArray(project.technologies);
  const galleryList = parseArray(project.gallery);
  const mainImageSrc = project.image || projectFallbackImg;

  // Metadata cards data
  const infoFields = [
    { label: 'PROJECT NAME', value: project.name },
    { label: 'CLIENT', value: project.client },
    { label: 'MAIN CONTRACTOR / CONSULTANT', value: [project.contractor, project.consultant].filter(Boolean).join(' / ') },
    { label: 'LOCATION', value: project.location },
    { label: 'SECTOR', value: project.sector },
    { label: 'STATUS', value: project.status },
    { label: 'YEAR', value: project.year },
    { label: 'PROJECT STAGE / BIM LEVEL', value: [project.project_stage, project.bim_level].filter(Boolean).join(' • ') }
  ].filter(f => f.value && f.value.trim() !== '');

  return (
    <div style={{ background: '#F8FAFC', color: '#1E293B', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Dynamic Live Projects Banner */}
      <DynamicBanner
        pageKey="project-detail"
        defaultImage={mainImageSrc}
        defaultImages={[mainImageSrc, '/servicepage1.png', '/why.png']}
        minHeight="280px"
        overlayOpacity="subtle"
      />

      {/* 1. BREADCRUMB NAVIGATION */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#64748B', flexWrap: 'wrap' }}>
          <span 
            onClick={() => onNavigate('Home')} 
            style={{ cursor: 'pointer', color: '#087CFF', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#063B73'}
            onMouseLeave={e => e.target.style.color = '#087CFF'}
          >
            HOME
          </span>
          <span>/</span>
          <span 
            onClick={() => onNavigate('Projects')} 
            style={{ cursor: 'pointer', color: '#087CFF', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#063B73'}
            onMouseLeave={e => e.target.style.color = '#087CFF'}
          >
            PROJECTS
          </span>
          <span>/</span>
          <span 
            onClick={() => onNavigate('Projects', project.division_type || project.category)} 
            style={{ cursor: 'pointer', color: '#087CFF', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#063B73'}
            onMouseLeave={e => e.target.style.color = '#087CFF'}
          >
            {(project.division_type || project.category || 'Projects').toUpperCase()}
          </span>
          <span>/</span>
          <span style={{ color: '#063B73', fontWeight: '700' }}>
            {project.name}
          </span>
        </div>
      </div>

      {/* 2. PROJECT HERO SECTION */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', paddingTop: '40px', paddingBottom: '48px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Side: Metadata & Information */}
            <div>
              <span style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: '800',
                color: '#087CFF',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                background: 'rgba(8,124,255,0.08)',
                padding: '6px 14px',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                {project.division_type || 'PROJECT'}
              </span>

              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#063B73',
                lineHeight: '1.25',
                margin: '0 0 16px 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {project.name}
              </h1>

              <p style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.7',
                margin: '0 0 24px 0',
                fontWeight: '400',
                whiteSpace: 'pre-line'
              }}>
                {project.short_description || project.description || 'Multidisciplinary engineering, BIM coordination, and digital construction solutions delivered to the highest technical standards.'}
              </p>

              {/* Quick Metadata Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {project.location && (
                  <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>LOCATION</span>
                    <strong style={{ color: '#063B73' }}>{project.location}</strong>
                  </div>
                )}
                {project.sector && (
                  <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>SECTOR</span>
                    <strong style={{ color: '#063B73' }}>{project.sector}</strong>
                  </div>
                )}
                {project.status && (
                  <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>STATUS</span>
                    <strong style={{ color: project.status.toLowerCase().includes('ongoing') ? '#D97706' : '#059669' }}>{project.status}</strong>
                  </div>
                )}
                {project.year && (
                  <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>YEAR</span>
                    <strong style={{ color: '#063B73' }}>{project.year}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Actual Project Image */}
            <div>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(6,59,115,0.12)',
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                maxHeight: '420px'
              }}>
                <img
                  src={mainImageSrc}
                  alt={project.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = projectFallbackImg; }}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '420px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '40px' }}>

        {/* 3. PREMIUM PROJECT INFORMATION GRID */}
        {infoFields.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#063B73', marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif' }}>
              Project Information
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              {infoFields.map((field, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #087CFF',
                    borderRadius: '12px',
                    padding: '20px 22px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>
                    {field.label}
                  </span>
                  <strong style={{ fontSize: '15px', color: '#063B73', fontWeight: '700', lineHeight: '1.4' }}>
                    {field.value}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. SCOPE OF WORK & KEY DELIVERABLES */}
        {(project.scope_of_work || deliverablesList.length > 0) && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {/* Scope of Work */}
              {project.scope_of_work && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Scope of Work
                  </h3>
                  <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.75', margin: 0, whiteSpace: 'pre-line' }}>
                    {project.scope_of_work}
                  </p>
                </div>
              )}

              {/* Key Deliverables */}
              {deliverablesList.length > 0 && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 32px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Key Deliverables
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {deliverablesList.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(8,124,255,0.07)',
                          color: '#087CFF',
                          border: '1px solid rgba(8,124,255,0.2)',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. SERVICES PROVIDED & DISCIPLINES */}
        {(servicesList.length > 0 || disciplinesList.length > 0) && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {/* Services Provided */}
              {servicesList.length > 0 && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Services Provided
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {servicesList.map((svc, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate('Services', svc)}
                        style={{
                          background: '#063B73',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={e => e.target.style.background = '#087CFF'}
                        onMouseLeave={e => e.target.style.background = '#063B73'}
                      >
                        {svc} →
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Disciplines */}
              {disciplinesList.length > 0 && (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Technical Disciplines
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {disciplinesList.map((disc, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#F1F5F9',
                          color: '#334155',
                          border: '1px solid #CBD5E1',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        {disc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. SOFTWARE & TECHNOLOGY */}
        {technologiesList.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px 32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#063B73', margin: '0 0 16px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
                Software & Technology
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {technologiesList.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#F8FAFC',
                      color: '#063B73',
                      border: '1px solid #CBD5E1',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '700',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    💻 {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. PROJECT HIGHLIGHTS */}
        {project.project_highlights && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #063B73 0%, #087CFF 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 40px',
              boxShadow: '0 8px 28px rgba(6,59,115,0.2)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#93C5FD', display: 'block', marginBottom: '8px' }}>
                PROJECT HIGHLIGHTS
              </span>
              <p style={{ fontSize: '18px', fontWeight: '600', lineHeight: '1.6', margin: 0 }}>
                "{project.project_highlights}"
              </p>
            </div>
          </section>
        )}

        {/* 8. PROJECT GALLERY (If > 1 images exist) */}
        {galleryList.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#063B73', marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif' }}>
              Project Gallery
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {galleryList.map((imgUrl, idx) => (
                <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid #E2E8F0' }}>
                  <img
                    src={imgUrl}
                    alt={`Gallery ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = projectFallbackImg; }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#063B73', marginBottom: '24px', fontFamily: 'Space Grotesk, sans-serif' }}>
              Related Projects
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {relatedProjects.map((rel, idx) => (
                <div
                  key={rel.id || idx}
                  onClick={() => onNavigate('ProjectDetail', rel.slug || rel.id)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(8,124,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'; }}
                >
                  <div style={{ height: '180px', overflow: 'hidden', background: '#F1F5F9' }}>
                    <img
                      src={rel.image || projectFallbackImg}
                      alt={rel.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = projectFallbackImg; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#087CFF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                      {rel.division_type || rel.category}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#063B73', margin: '0 0 8px 0', lineHeight: '1.35' }}>
                      {rel.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                      {[rel.location, rel.sector].filter(Boolean).join(' • ')}
                    </p>
                    <span style={{ marginTop: 'auto', fontSize: '14px', fontWeight: '700', color: '#087CFF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      VIEW PROJECT →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. CONTACT CTA */}
        <section>
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            borderRadius: '20px',
            padding: '40px 48px',
            textAlign: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#063B73', margin: '0 0 12px 0', fontFamily: 'Space Grotesk, sans-serif' }}>
              Interested in Engineering & BIM Solutions for Your Project?
            </h3>
            <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px', margin: '0 auto 28px', lineHeight: '1.6' }}>
              Contact Blue Crescent Engineering's technical consultants to discuss your BIM coordination, CAD drafting, digital twin, or GSAS sustainability requirements.
            </p>
            <button
              onClick={() => onNavigate('Contact Us')}
              style={{
                background: '#063B73',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                boxShadow: '0 4px 12px rgba(6,59,115,0.2)'
              }}
              onMouseEnter={e => e.target.style.background = '#087CFF'}
              onMouseLeave={e => e.target.style.background = '#063B73'}
            >
              Contact Our Consultants →
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
