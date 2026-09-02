import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Tag, Share2, Clock, ChevronRight } from 'lucide-react';
import { getCachedCompanySettings } from '../utils/bannerCache';
import DynamicBanner from './DynamicBanner';

export default function BlogDetailPage({ slug, onNavigate }) {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(`/api/blogs/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setArticle(data);
          // Set document SEO title
          if (data.seo_title || data.title) {
            document.title = `${data.seo_title || data.title} | Blue Crescent Engineering`;
          }
        } else {
          setError('Article not found');
        }
      })
      .catch(err => {
        console.warn('Error fetching blog detail:', err);
        setError('Failed to load article');
      })
      .finally(() => setLoading(false));

    // Fetch related articles
    fetch('/api/blogs')
      .then(res => res.ok ? res.json() : [])
      .then(blogs => {
        if (Array.isArray(blogs)) {
          const filtered = blogs.filter(b => b.slug !== slug && String(b.id) !== String(slug));
          setRelatedArticles(filtered.slice(0, 3));
        }
      })
      .catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '80vh', padding: '100px 24px 60px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #E2E8F0', borderTopColor: '#0057B8', margin: '0 auto 20px auto', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '16px', color: '#64748B', fontWeight: '600' }}>Loading article...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '80vh', padding: '100px 24px 60px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: '#FFFFFF', padding: '48px 32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '800', color: '#063B73', margin: '0 0 12px 0' }}>Article Not Found</h2>
          <p style={{ fontSize: '15px', color: '#64748B', margin: '0 0 24px 0', lineHeight: 1.6 }}>
            The requested engineering article may have been moved, unpublished, or does not exist.
          </p>
          <button
            onClick={() => onNavigate ? onNavigate('Media', 'Blogs') : window.location.href = '/insights'}
            style={{ background: '#0057B8', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} /> Back to Insights
          </button>
        </div>
      </div>
    );
  }

  const cacheBust = article.updated_at ? `?v=${new Date(article.updated_at).getTime()}` : '';
  const featuredImg = article.image ? (article.image.startsWith('data:') || article.image.startsWith('http') ? article.image : `${article.image}${cacheBust}`) : '/servicepage1.png';

  return (
    <div className="blog-detail-wrapper" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Dynamic Live Banner / Breadcrumb Bar */}
      <DynamicBanner
        pageKey="blog-detail"
        defaultImage={featuredImg}
        defaultImages={[featuredImg, '/servicepage1.png', '/why.png']}
        minHeight="320px"
      >
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'left' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span 
              style={{ cursor: 'pointer', color: '#CBD5E1' }} 
              onClick={() => onNavigate ? onNavigate('Home') : null}
            >
              Home
            </span>
            <ChevronRight size={14} />
            <span 
              style={{ cursor: 'pointer', color: '#CBD5E1' }} 
              onClick={() => onNavigate ? onNavigate('Media', 'Blogs') : null}
            >
              Blogs
            </span>
            <ChevronRight size={14} />
            <span style={{ color: '#38BDF8', fontWeight: '600' }}>
              {article.category || 'Blogs'}
            </span>
          </div>

          {/* Category Badge */}
          <span 
            style={{ 
              display: 'inline-block', 
              background: '#0057B8', 
              color: '#FFFFFF', 
              fontSize: '12px', 
              fontWeight: '800', 
              padding: '5px 14px', 
              borderRadius: '20px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              marginBottom: '16px' 
            }}
          >
            {article.category || 'Company News'}
          </span>

          {/* Article Title */}
          <h1 
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontSize: '34px', 
              fontWeight: '800', 
              color: '#FFFFFF', 
              margin: '0 0 20px 0', 
              lineHeight: 1.25,
              letterSpacing: '-0.5px' 
            }}
          >
            {article.title}
          </h1>

          {/* Meta Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13.5px', color: '#CBD5E1', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} style={{ color: '#38BDF8' }} />
              <span>{article.author || 'Blue Crescent Engineering'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} style={{ color: '#38BDF8' }} />
              <span>{article.date || 'Recent Article'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} style={{ color: '#38BDF8' }} />
              <span>{article.read_time || '4 min read'}</span>
            </div>
          </div>

        </div>
      </DynamicBanner>

      {/* Main Container */}
      <div style={{ maxWidth: '960px', margin: '-30px auto 0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Card Frame */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '36px 40px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(6, 59, 115, 0.06)' }}>
          
          {/* Back Button */}
          <button
            onClick={() => onNavigate ? onNavigate('Media', 'Blogs') : window.location.href = '/insights'}
            style={{
              background: '#EFF6FF',
              color: '#0057B8',
              border: '1px solid #DBEAFE',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '28px'
            }}
          >
            <ArrowLeft size={15} /> Back to Insights
          </button>

          {/* Featured Image */}
          <div style={{ width: '100%', maxHeight: '440px', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            <img
              src={featuredImg}
              alt={article.title}
              style={{ width: '100%', height: '100%', maxHeight: '440px', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/servicepage1.png'; }}
            />
          </div>

          {/* Short Description Lead */}
          {(article.short_description || article.summary) && (
            <div 
              style={{ 
                fontSize: '17px', 
                fontWeight: '600', 
                color: '#063B73', 
                lineHeight: 1.6, 
                padding: '20px 24px', 
                background: '#F0F7FF', 
                borderLeft: '4px solid #0057B8', 
                borderRadius: '8px',
                marginBottom: '32px' 
              }}
            >
              {article.short_description || article.summary}
            </div>
          )}

          {/* Full Article Content */}
          <div 
            className="article-body-content"
            style={{ 
              fontSize: '16px', 
              color: '#334155', 
              lineHeight: 1.8, 
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>{article.summary || article.short_description}</p>
            )}
          </div>

        </div>

        {/* Related Insights Section */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '4px', height: '22px', background: '#0057B8', borderRadius: '4px' }}></div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: '800', color: '#063B73', margin: 0 }}>
                RELATED ARTICLES
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {relatedArticles.map((rel) => {
                const relImg = rel.image ? (rel.image.startsWith('data:') || rel.image.startsWith('http') ? rel.image : `${rel.image}?v=${new Date(rel.updated_at || Date.now()).getTime()}`) : '/servicepage1.png';

                return (
                  <div
                    key={rel.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(6, 59, 115, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.25s ease, boxShadow 0.25s ease'
                    }}
                    onClick={() => onNavigate ? onNavigate('BlogDetail', rel.slug || rel.id) : null}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(8, 124, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 59, 115, 0.04)';
                    }}
                  >
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={relImg} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/servicepage1.png'; }} />
                    </div>
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#0057B8', textTransform: 'uppercase', marginBottom: '6px' }}>{rel.category || 'News'}</span>
                      <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: '800', color: '#063B73', margin: '0 0 10px 0', lineHeight: 1.3 }}>{rel.title}</h4>
                      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px 0', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {rel.short_description || rel.summary}
                      </p>
                      <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0057B8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Read Article →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
