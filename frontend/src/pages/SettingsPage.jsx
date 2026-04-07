import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Trash2 } from 'lucide-react';
import './Pages.css';

const SettingsPage = () => {
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState(null);

  const apiKeys = [
    { name: 'OpenAI API Key', key: 'sk-***...***abc123', category: 'AI', status: 'connected' },
    { name: 'Gumroad API Token', key: '***...***token', category: 'Platform', status: 'connected' },
    { name: 'Shopify Access Token', key: '***...***shop', category: 'Platform', status: 'connected' },
    { name: 'SendGrid API Key', key: '***...***mail', category: 'Email', status: 'connected' },
    { name: 'TikTok Business Token', key: '***...***tiktok', category: 'Social', status: 'connected' },
    { name: 'Instagram Access Token', key: '***...***insta', category: 'Social', status: 'connected' },
    { name: 'Twitter API Key', key: '***...***twitter', category: 'Social', status: 'pending' },
    { name: 'YouTube API Key', key: '***...***youtube', category: 'Social', status: 'connected' },
    { name: 'LinkedIn Access Token', key: '***...***linkedin', category: 'Social', status: 'connected' },
    { name: 'Google Analytics', key: '***...***analytics', category: 'Analytics', status: 'connected' },
    { name: 'MongoDB Connection String', key: '***...***mongodb', category: 'Database', status: 'connected' }
  ];

  const categories = [
    { name: 'AI', count: 1 },
    { name: 'Platform', count: 2 },
    { name: 'Email', count: 1 },
    { name: 'Social', count: 5 },
    { name: 'Analytics', count: 1 },
    { name: 'Database', count: 1 }
  ];

  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKeyVisibility = (id) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings & API Keys</h1>
        <p>Manage all API credentials and integrations for the Factory system</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>API Keys Overview</h2>
          <button className="btn btn-primary">+ Add New Key</button>
        </div>

        <div className="keys-summary">
          <div className="summary-item">
            <span className="summary-label">Total Keys</span>
            <span className="summary-value">{apiKeys.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Connected</span>
            <span className="summary-value text-success">{apiKeys.filter(k => k.status === 'connected').length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending</span>
            <span className="summary-value text-warning">{apiKeys.filter(k => k.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Key Categories</h3>
          <div className="category-list">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-item">
                <span>{cat.name}</span>
                <span className="category-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h3>Key Management Tips</h3>
          <ul className="tips-list">
            <li><strong>Keep Secure:</strong> Never share API keys or commit to Git</li>
            <li><strong>Rotate Regularly:</strong> Update keys every 90 days</li>
            <li><strong>Use Permissions:</strong> Give each key only necessary permissions</li>
            <li><strong>Monitor Usage:</strong> Check logs for unusual activity</li>
            <li><strong>Environment Variables:</strong> Store keys in .env files</li>
            <li><strong>Backup Keys:</strong> Keep secure backup of critical keys</li>
          </ul>
        </div>
      </div>

      <div className="content-section">
        <h2>All API Keys</h2>
        <div className="keys-table">
          {apiKeys.map((key, idx) => (
            <div key={idx} className="key-row">
              <div className="key-info">
                <div className="key-name">
                  <h4>{key.name}</h4>
                  <span className={`badge badge-${key.category.toLowerCase()}`}>{key.category}</span>
                </div>
                <div className="key-display">
                  <code>
                    {showKeys[idx] ? key.key : key.key.replace(/./g, (char, pos) => pos < 4 || pos > key.key.length - 4 ? char : '*')}
                  </code>
                </div>
              </div>

              <div className="key-actions">
                <button
                  className="key-btn"
                  onClick={() => toggleKeyVisibility(idx)}
                  title={showKeys[idx] ? 'Hide' : 'Show'}
                >
                  {showKeys[idx] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  className="key-btn"
                  onClick={() => copyToClipboard(key.key, idx)}
                  title="Copy to clipboard"
                >
                  {copied === idx ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                </button>
                <span className={`status-dot status-${key.status}`}></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2>Add New API Key</h2>
        <form className="add-key-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Key Name</label>
              <input type="text" placeholder="e.g., Production OpenAI Key" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select>
                <option>Select category...</option>
                <option>AI</option>
                <option>Platform</option>
                <option>Email</option>
                <option>Social</option>
                <option>Analytics</option>
                <option>Database</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>API Key / Token</label>
            <input type="password" placeholder="Paste your API key here" />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea placeholder="What is this key used for?" rows="3"></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Key</button>
            <button type="button" className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <div className="content-section">
        <h2>System Configuration</h2>
        <div className="settings-grid">
          <div className="setting">
            <label>Auto-encrypt keys</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>2FA Enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>Key rotation frequency</label>
            <select>
              <option>Every 30 days</option>
              <option>Every 60 days</option>
              <option>Every 90 days</option>
              <option>Manual only</option>
            </select>
          </div>
          <div className="setting">
            <label>Log all key access</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
