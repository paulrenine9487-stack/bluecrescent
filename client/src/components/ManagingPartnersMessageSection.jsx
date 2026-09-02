import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake, 
  Target 
} from 'lucide-react';
import './ManagingPartnersMessageSection.css';

const DEFAULT_MESSAGE = {
  sectionTitle: "MANAGING PARTNER'S MESSAGE",
  mainQuote: "We don't build business on price. We build it on trust, quality and relationships.",
  introText: "At Blue Crescent, our principles are simple and non-negotiable: do what we commit to, deliver what we promise, and never compromise on quality.",
  messageParagraph1: "We do not take projects simply to increase our numbers, nor do we accept work at an unrealistic price and allow quality or deliverables to suffer later. We believe every project must begin with a fair commitment, the right resources and a clear responsibility to deliver it successfully.",
  messageParagraph2: "Once we commit to a project, we stand by it until completion. We will not step away midway because circumstances become difficult. Our client's project should never suffer because of our internal challenges. Their responsibility becomes our responsibility.",
  messageParagraph3: "Our greatest strength is our people. We believe in having the right people in the right roles—qualified professionals with genuine domain knowledge and practical experience. We treat our employees as family, because strong projects are delivered by strong teams, not by individuals.",
  messageParagraph4: "We see our clients not simply as customers, but as long-term partners. We value transparency, teamwork, professional integrity and relationships that continue well beyond the completion of a single project.",
  fairCommitmentTitle: "FAIR COMMITMENT",
  fairCommitmentContent: "We do not take projects simply to increase our numbers, nor do we accept work at an unrealistic price and allow quality or deliverables to suffer later.",
  completeCommitmentTitle: "COMPLETE COMMITMENT",
  completeCommitmentContent: "Once we commit to a project, we stand by it until completion. We will not step away midway because circumstances become difficult.",
  responsibilityTitle: "OUR RESPONSIBILITY",
  responsibilityContent: "Our client's project should never suffer because of our internal challenges. Their responsibility becomes our responsibility.",
  peopleStrengthTitle: "OUR PEOPLE, OUR STRENGTH",
  peopleStrengthContent: "Our greatest strength is our people. We believe in having the right people in the right roles—qualified professionals with genuine domain knowledge and practical experience.",
  longTermPartnersTitle: "LONG-TERM PARTNERS",
  longTermPartnersContent: "We see our clients not simply as customers, but as long-term partners. We value transparency, teamwork, professional integrity and relationships that continue well beyond the completion of a single project.",
  visionTitle: "OUR VISION",
  visionContent: "Right People.\nFair Price.\nNo Compromise on Quality.\nComplete Commitment.\nLong-Term Partnership.",
  finalStatement: "That is how we work.\nThat is how we build trust.\nThat is Blue Crescent.",
  partnerName: "Chandrasekar Nallusamy",
  partnerDesignation: "Managing Partner",
  partnerImage: null,
  status: "Active"
};

export default function ManagingPartnersMessageSection() {
  const [data, setData] = useState(DEFAULT_MESSAGE);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch('/api/managing-partner-message')
      .then(res => res.ok ? res.json() : null)
      .then(result => {
        if (result && typeof result === 'object' && Object.keys(result).length > 0) {
          setData(prev => ({ ...prev, ...result }));
        }
      })
      .catch(err => {
        console.warn('Managing partner message fetch warning:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchData();
    };

    window.addEventListener('managingPartnerMessageUpdated', handleUpdate);
    window.addEventListener('companySettingsUpdated', handleUpdate);
    window.addEventListener('dataUpdated', handleUpdate);

    return () => {
      window.removeEventListener('managingPartnerMessageUpdated', handleUpdate);
      window.removeEventListener('companySettingsUpdated', handleUpdate);
      window.removeEventListener('dataUpdated', handleUpdate);
    };
  }, []);

  if (data.status === 'Inactive' || data.status === 'OFF') {
    return null;
  }

  // Highlight key terms in main quote
  const renderFormattedQuote = (quoteText) => {
    if (!quoteText) return null;
    const parts = quoteText.split(/(trust|quality|relationships)/gi);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (lower === 'trust' || lower === 'quality' || lower === 'relationships') {
        return <span key={i} className="mp-highlight">{part}</span>;
      }
      return part;
    });
  };

  // Format final statement
  const renderFinalStatement = (statement) => {
    if (!statement) return null;
    const lines = statement.split('\n').map(s => s.trim()).filter(Boolean);
    const lastLine = lines.length > 0 ? lines[lines.length - 1] : '';
    const precedingLines = lines.slice(0, lines.length - 1);

    return (
      <div className="mp-final-statement-panel">
        <p className="mp-final-statement-text">
          {precedingLines.map((line, idx) => (
            <React.Fragment key={idx}>
              “{line}”<br />
            </React.Fragment>
          ))}
          {lastLine && (
            <span className="mp-final-statement-highlight">
              “{lastLine}”
            </span>
          )}
        </p>
      </div>
    );
  };

  // Render vision bullet lines
  const renderVisionContent = (content) => {
    if (!content) return null;
    const items = content.split('\n').map(i => i.trim()).filter(Boolean);
    if (items.length <= 1) {
      return <p className="mp-card-content">{content}</p>;
    }
    return (
      <ul className="mp-card-vision-list">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <section className="mp-message-section" id="managing-partner-message">
      <div className="mp-container">

        {/* ── Section Header: Title -> Subtitle -> Accent Bar -> Message Text ── */}
        <div className="mp-header">
          <h2 className="mp-section-title">
            {data.sectionTitle || "MANAGING PARTNER'S MESSAGE"}
          </h2>

          <p className="mp-section-subtitle">
            {renderFormattedQuote(data.mainQuote || "We don't build business on price. We build it on trust, quality and relationships.")}
          </p>

          <div className="mp-accent-line" />

          {data.introText && (
            <p className="mp-intro-text">
              {data.introText}
            </p>
          )}
        </div>

        {/* ── Six Core Principle Cards (Horizontal Icon + Vertical Divider + Content) ── */}
        <div className="mp-cards-grid">
          {/* Card 1: Fair Commitment */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <Handshake size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.fairCommitmentTitle || 'FAIR COMMITMENT'}</h4>
              <p className="mp-card-content">{data.fairCommitmentContent || 'We do not take projects simply to increase our numbers, nor do we accept work at an unrealistic price and allow quality or deliverables to suffer later.'}</p>
            </div>
          </div>

          {/* Card 2: Complete Commitment */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <Users size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.completeCommitmentTitle || 'COMPLETE COMMITMENT'}</h4>
              <p className="mp-card-content">{data.completeCommitmentContent || 'Once we commit to a project, we stand by it until completion. We will not step away midway because circumstances become difficult.'}</p>
            </div>
          </div>

          {/* Card 3: Our Responsibility */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.responsibilityTitle || 'OUR RESPONSIBILITY'}</h4>
              <p className="mp-card-content">{data.responsibilityContent || "Our client's project should never suffer because of our internal challenges. Their responsibility becomes our responsibility."}</p>
            </div>
          </div>

          {/* Card 4: Our People, Our Strength */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <UserCheck size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.peopleStrengthTitle || 'OUR PEOPLE, OUR STRENGTH'}</h4>
              <p className="mp-card-content">{data.peopleStrengthContent || 'Our greatest strength is our people. We believe in having the right people in the right roles—qualified professionals with genuine domain knowledge and practical experience.'}</p>
            </div>
          </div>

          {/* Card 5: Long-Term Partners */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <HeartHandshake size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.longTermPartnersTitle || 'LONG-TERM PARTNERS'}</h4>
              <p className="mp-card-content">{data.longTermPartnersContent || 'We see our clients not simply as customers, but as long-term partners. We value transparency, teamwork, professional integrity and relationships that continue well beyond the completion of a single project.'}</p>
            </div>
          </div>

          {/* Card 6: Our Vision */}
          <div className="mp-card">
            <div className="mp-card-left">
              <div className="mp-card-icon-wrap">
                <Target size={22} strokeWidth={2.2} />
              </div>
            </div>
            <div className="mp-card-right">
              <h4 className="mp-card-title">{data.visionTitle || 'OUR VISION'}</h4>
              {renderVisionContent(data.visionContent || "Right People.\nFair Price.\nNo Compromise on Quality.\nComplete Commitment.\nLong-Term Partnership.")}
            </div>
          </div>
        </div>

        {/* ── Bottom Quote & Signature Banner (Exact Design from Reference Image) ── */}
        <div className="mp-bottom-banner">
          {/* Left Vertical Accent Line */}
          <div className="mp-bottom-accent-bar" />

          {/* Soft Blue Quotation Mark Icon */}
          <div className="mp-bottom-quote-icon">
            <svg width="32" height="26" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.77778 0C3.48333 0 0 3.58333 0 8C0 12.4167 3.48333 16 7.77778 16C8.08889 16 8.38889 15.9722 8.68889 15.9167C7.62222 19.3333 4.43333 22.1111 0.544444 23.3333L1.55556 24C7.07778 22.25 11.1111 17.5 11.1111 11.6667V8C11.1111 3.58333 7.62778 0 7.77778 0ZM24.4444 0C20.15 0 16.6667 3.58333 16.6667 8C16.6667 12.4167 20.15 16 24.4444 16C24.7556 16 25.0556 15.9722 25.3556 15.9167C24.2889 19.3333 21.1 22.1111 17.2111 23.3333L18.2222 24C23.7444 22.25 27.7778 17.5 27.7778 11.6667V8C27.7778 3.58333 24.2944 0 24.4444 0Z" fill="#BAE6FD" fillOpacity="0.85"/>
            </svg>
          </div>

          {/* Left Text: That is how we work... */}
          <div className="mp-bottom-quote-text">
            <p className="mp-bottom-line1">That is how we work.</p>
            <p className="mp-bottom-line2">That is how we build trust.</p>
            <h3 className="mp-bottom-line3">That is Blue Crescent.</h3>
          </div>

          {/* Middle Vertical Divider Line */}
          <div className="mp-bottom-divider" />

          {/* Right Text: Chandrasekar Nallusamy | MANAGING PARTNER */}
          <div className="mp-bottom-signature">
            <h4 className="mp-bottom-partner-name">{data.partnerName || 'Chandrasekar Nallusamy'}</h4>
            <p className="mp-bottom-partner-role">{data.partnerDesignation || 'MANAGING PARTNER'}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
