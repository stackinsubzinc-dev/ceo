import React, { useState } from 'react';
import { Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './Pages.css';

const AutomationPage = () => {
  const [automations] = useState([
    {
      id: 1,
      name: 'Daily Content Publishing',
      status: 'active',
      platforms: 'TikTok, Instagram, Twitter',
      frequency: 'Daily',
      nextRun: 'In 2 hours',
      successRate: '99.2%'
    },
    {
      id: 2,
      name: 'Email Drip Campaign',
      status: 'active',
      platforms: 'SendGrid',
      frequency: 'Triggered',
      nextRun: 'Continuous',
      successRate: '98.8%'
    },
    {
      id: 3,
      name: 'Product Publishing Pipeline',
      status: 'active',
      platforms: 'Gumroad, Shopify, Website',
      frequency: 'On-demand',
      nextRun: 'Ready',
      successRate: '100%'
    },
    {
      id: 4,
      name: 'Analytics Collection',
      status: 'active',
      platforms: 'All Platforms',
      frequency: 'Hourly',
      nextRun: 'In 12 mins',
      successRate: '99.8%'
    }
  ]);

  const integrations = [
    { name: 'Gumroad', status: 'connected', lastSync: '2 mins ago' },
    { name: 'Shopify', status: 'connected', lastSync: '5 mins ago' },
    { name: 'SendGrid', status: 'connected', lastSync: '1 min ago' },
    { name: 'TikTok', status: 'connected', lastSync: '8 mins ago' },
    { name: 'Instagram Business', status: 'connected', lastSync: '3 mins ago' },
    { name: 'Twitter', status: 'connected', lastSync: '6 mins ago' },
    { name: 'Google Analytics', status: 'connected', lastSync: '12 mins ago' },
    { name: 'MongoDB', status: 'connected', lastSync: 'Live' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Automation Control</h1>
        <p>Manage automations, integrations, and workflows</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Automations</h3>
          <p className="stat-value">{automations.length}</p>
          <p className="stat-change">Running 24/7</p>
        </div>
        <div className="stat-card">
          <h3>Integrations</h3>
          <p className="stat-value">{integrations.length}</p>
          <p className="stat-change">All connected</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">99.4%</p>
          <p className="stat-change">Highly reliable</p>
        </div>
        <div className="stat-card">
          <h3>Tasks Running</h3>
          <p className="stat-value">1,247</p>
          <p className="stat-change">This cycle</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Active Automations</h2>
          <button className="btn btn-primary">Create Automation</button>
        </div>

        <div className="automations-list">
          {automations.map((auto, idx) => (
            <div key={idx} className="automation-card">
              <div className="auto-header">
                <div className="auto-info">
                  <h3>{auto.name}</h3>
                  <p className="text-secondary">{auto.platforms}</p>
                </div>
                <span className={`status-badge status-${auto.status}`}>
                  {auto.status}
                </span>
              </div>

              <div className="auto-details">
                <div className="detail-item">
                  <span className="label">Frequency</span>
                  <span className="value">{auto.frequency}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Next Run</span>
                  <span className="value">{auto.nextRun}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Success Rate</span>
                  <span className="value text-success">{auto.successRate}</span>
                </div>
              </div>

              <div className="auto-actions">
                <button className="btn btn-secondary btn-small">Edit</button>
                <button className="btn btn-secondary btn-small">Pause</button>
                <button className="btn btn-secondary btn-small">Logs</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Integrations Status</h2>
        </div>

        <div className="integrations-grid">
          {integrations.map((integration, idx) => (
            <div key={idx} className="integration-card">
              <div className="integration-header">
                <h4>{integration.name}</h4>
                {integration.status === 'connected' && (
                  <CheckCircle size={20} className="text-success" />
                )}
              </div>
              <p className="text-secondary">Last sync: {integration.lastSync}</p>
              <button className="btn btn-secondary btn-small mt-3">Configure</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>System Alerts</h3>
          <div className="alert-list">
            <div className="alert-item alert-info">
              <AlertCircle size={18} />
              <div>
                <p className="font-semibold">Scheduled Maintenance</p>
                <p className="text-secondary">Sunday 2-3 AM UTC</p>
              </div>
            </div>
            <div className="alert-item alert-success">
              <CheckCircle size={18} />
              <div>
                <p className="font-semibold">All Systems Optimal</p>
                <p className="text-secondary">No issues detected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Recent Activity</h3>
          <div className="activity-log">
            <div className="log-entry">
              <span className="time">2 mins ago</span>
              <p>Published 12 content pieces across social media</p>
            </div>
            <div className="log-entry">
              <span className="time">8 mins ago</span>
              <p>Sent 342 emails from nurture sequence</p>
            </div>
            <div className="log-entry">
              <span className="time">15 mins ago</span>
              <p>Analytics synced from Gumroad</p>
            </div>
            <div className="log-entry">
              <span className="time">1 hour ago</span>
              <p>Generated branding package for new product</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3>Automation Rules & Workflows</h3>
        <div className="rules-grid">
          <div className="rule-card">
            <h4>Post-Purchase Automation</h4>
            <p className="text-secondary">Trigger: Customer purchases product</p>
            <p className="text-secondary">Action: Send welcome email + deliver content</p>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="rule-card">
            <h4>Low-Stock Alert</h4>
            <p className="text-secondary">Trigger: Product inventory drops</p>
            <p className="text-secondary">Action: Notify admin + generate new batch</p>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="rule-card">
            <h4>Abandoned Cart Recovery</h4>
            <p className="text-secondary">Trigger: User abandons cart</p>
            <p className="text-secondary">Action: Send reminder emails (3x)</p>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="rule-card">
            <h4>Customer Re-engagement</h4>
            <p className="text-secondary">Trigger: 30 days of inactivity</p>
            <p className="text-secondary">Action: Send special offer + reactivation email</p>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;
