import React, { useState } from 'react';
import { Share2, Eye, Calendar } from 'lucide-react';
import './Pages.css';

const ContentPage = () => {
  const [contentStats] = useState({
    totalPieces: 342,
    published: 289,
    scheduled: 53,
    platforms: 8,
    avgEngagement: '12.4%',
    totalReach: '1.2M'
  });

  const contentCalendar = [
    { date: 'Today', posts: 5, platforms: ['TikTok', 'Instagram', 'Twitter'] },
    { date: 'Tomorrow', posts: 4, platforms: ['YouTube', 'LinkedIn', 'Blog'] },
    { date: 'Apr 8', posts: 6, platforms: ['TikTok', 'Instagram', 'Twitter', 'LinkedIn'] }
  ];

  const contentTypes = [
    { type: 'Short-form Videos', count: 128, platform: 'TikTok, Instagram Reels, YouTube Shorts' },
    { type: 'Long-form Content', count: 64, platform: 'YouTube, Blog' },
    { type: 'Social Posts', count: 89, platform: 'Twitter, LinkedIn, Facebook' },
    { type: 'Email Sequences', count: 42, platform: 'SendGrid' },
    { type: 'Blog Articles', count: 19, platform: 'Website' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Viral Content Engine</h1>
        <p>Generate 100+ viral content pieces and manage distribution across platforms</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Content Pieces</h3>
          <p className="stat-value">{contentStats.totalPieces}</p>
          <p className="stat-change">Generated this cycle</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p className="stat-value">{contentStats.published}</p>
          <p className="stat-change">Across platforms</p>
        </div>
        <div className="stat-card">
          <h3>Total Reach</h3>
          <p className="stat-value">{contentStats.totalReach}</p>
          <p className="stat-change">Avg engagement {contentStats.avgEngagement}</p>
        </div>
        <div className="stat-card">
          <h3>Platforms</h3>
          <p className="stat-value">{contentStats.platforms}</p>
          <p className="stat-change">Simultaneous posting</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h2>Content Types Generated</h2>
          <div className="content-types-list">
            {contentTypes.map((item, idx) => (
              <div key={idx} className="content-type-item">
                <div className="type-info">
                  <h4>{item.type}</h4>
                  <p className="text-secondary">{item.platform}</p>
                </div>
                <div className="type-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Content Calendar</h2>
          <div className="calendar-preview">
            {contentCalendar.map((day, idx) => (
              <div key={idx} className="calendar-day">
                <div className="day-header">
                  <h4>{day.date}</h4>
                  <span className="day-count">{day.posts} posts</span>
                </div>
                <div className="platforms-list">
                  {day.platforms.map((p, i) => (
                    <span key={i} className="platform-tag">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Content Generation Settings</h2>
        <div className="settings-grid">
          <div className="setting">
            <label>Tone of Voice</label>
            <select>
              <option>Professional & Authoritative</option>
              <option>Casual & Friendly</option>
              <option>Inspirational</option>
              <option>Educational</option>
            </select>
          </div>
          <div className="setting">
            <label>Target Audience</label>
            <select>
              <option>Entrepreneurs</option>
              <option>Small Business Owners</option>
              <option>Marketers</option>
              <option>Developers</option>
            </select>
          </div>
          <div className="setting">
            <label>Content Focus</label>
            <select>
              <option>Education (70%)</option>
              <option>Entertainment (60%)</option>
              <option>Product Promotion (80%)</option>
              <option>Community (50%)</option>
            </select>
          </div>
          <div className="setting">
            <label>Auto-post enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <button className="btn btn-primary mt-4">Generate Content</button>
      </div>

      <div className="content-section">
        <h2>Recent Content Items</h2>
        <div className="content-list">
          <div className="content-item">
            <div className="content-meta">
              <h4>TikTok: "5 AI Tools That Save 10 Hours/Week"</h4>
              <p className="text-secondary">Generated 2 hours ago • Views: 2,341 • Likes: 156</p>
            </div>
            <div className="content-actions">
              <button className="btn btn-secondary btn-small"><Eye size={16} /></button>
              <button className="btn btn-secondary btn-small"><Share2 size={16} /></button>
            </div>
          </div>
          <div className="content-item">
            <div className="content-meta">
              <h4>Blog: "Complete Guide to Product Automation"</h4>
              <p className="text-secondary">Scheduled for tomorrow • 2,500 words • SEO optimized</p>
            </div>
            <div className="content-actions">
              <button className="btn btn-secondary btn-small"><Eye size={16} /></button>
              <button className="btn btn-secondary btn-small"><Calendar size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
