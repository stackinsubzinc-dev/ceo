import React, { useState } from 'react';
import { ShoppingCart, Mail, Share2, TrendingUp } from 'lucide-react';
import './Pages.css';

const SalesPage = () => {
  const [funnels] = useState([
    {
      id: 1,
      name: 'AI Copywriting Main Funnel',
      product: 'AI Copywriting Masterclass',
      pages: 5,
      emailSequence: 8,
      conversions: '3.2%',
      avgOrderValue: '$67',
      revenue: '$2,145'
    },
    {
      id: 2,
      name: 'SEO Templates Upsell Funnel',
      product: 'E-commerce SEO Templates',
      pages: 4,
      emailSequence: 6,
      conversions: '2.8%',
      avgOrderValue: '$49',
      revenue: '$890'
    },
    {
      id: 3,
      name: 'Finance Course Launch Funnel',
      product: 'Personal Finance Course',
      pages: 7,
      emailSequence: 15,
      conversions: '4.1%',
      avgOrderValue: '$97',
      revenue: '$3,421'
    }
  ]);

  const funnelPages = [
    { name: 'Landing Page', type: 'Hook & CTA', completion: 100 },
    { name: 'Sales Page', type: 'Full Pitch', completion: 100 },
    { name: 'Objections Page', type: 'FAQ + Social Proof', completion: 100 },
    { name: 'Checkout', type: 'Frictionless Payment', completion: 100 },
    { name: 'Thank You Page', type: 'Upsell + Delivery', completion: 100 }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Sales Funnel Builder</h1>
        <p>Create high-converting sales funnels with automated email sequences</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Funnels</h3>
          <p className="stat-value">{funnels.length}</p>
          <p className="stat-change">Generating revenue</p>
        </div>
        <div className="stat-card">
          <h3>Avg Conversion</h3>
          <p className="stat-value">3.4%</p>
          <p className="stat-change">Industry avg: 2.1%</p>
        </div>
        <div className="stat-card">
          <h3>Email Sequences</h3>
          <p className="stat-value">29</p>
          <p className="stat-change">Automated flows</p>
        </div>
        <div className="stat-card">
          <h3>Funnel Pages</h3>
          <p className="stat-value">16</p>
          <p className="stat-change">All optimized</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>All Sales Funnels</h2>
          <button className="btn btn-primary">Create New Funnel</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Funnel Name</th>
                <th>Product</th>
                <th>Pages</th>
                <th>Email Sequence</th>
                <th>Conversion Rate</th>
                <th>AOV</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {funnels.map((funnel) => (
                <tr key={funnel.id}>
                  <td className="font-semibold">{funnel.name}</td>
                  <td>{funnel.product}</td>
                  <td>
                    <span className="badge">{funnel.pages} pages</span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{funnel.emailSequence} emails</span>
                  </td>
                  <td className="text-success font-semibold">{funnel.conversions}</td>
                  <td>{funnel.avgOrderValue}</td>
                  <td className="text-success font-semibold">{funnel.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <h2>Funnel Architecture</h2>
        <div className="funnel-diagram">
          {funnelPages.map((page, idx) => (
            <div key={idx} className="funnel-page">
              <div className="page-name">{page.name}</div>
              <div className="page-type">{page.type}</div>
              <div className="page-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${page.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Email Automation Sequences</h3>
          <div className="sequence-list">
            <div className="sequence-item">
              <div className="seq-info">
                <h4>Welcome Series (5 emails)</h4>
                <p className="text-secondary">Onboarding + product education</p>
              </div>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="sequence-item">
              <div className="seq-info">
                <h4>Nurture Sequence (8 emails)</h4>
                <p className="text-secondary">Building trust + value delivery</p>
              </div>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="sequence-item">
              <div className="seq-info">
                <h4>Upsell Campaign (4 emails)</h4>
                <p className="text-secondary">Cross-sell + premium offers</p>
              </div>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="sequence-item">
              <div className="seq-info">
                <h4>Re-engagement (3 emails)</h4>
                <p className="text-secondary">Win back inactive subscribers</p>
              </div>
              <span className="badge badge-warning">Paused</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Referral & Bonuses</h3>
          <div className="referral-box">
            <h4>Referral Program</h4>
            <p className="text-secondary mb-3">Earn 30% commission on referrals</p>
            <div className="referral-stat">
              <span>Active Referrals:</span>
              <span className="font-semibold">142</span>
            </div>
            <div className="referral-stat">
              <span>Referral Revenue:</span>
              <span className="font-semibold text-success">$8,540</span>
            </div>
          </div>

          <div className="incentive-box mt-4">
            <h4>Bonus Vault</h4>
            <p className="text-secondary mb-3">5 bonus products included</p>
            <ul className="bonus-list">
              <li>✓ Bonus 1: Video Training</li>
              <li>✓ Bonus 2: Templates Pack</li>
              <li>✓ Bonus 3: Swipe Files</li>
              <li>✓ Bonus 4: Checklist</li>
              <li>✓ Bonus 5: Private Community</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3>Funnel Optimization Settings</h3>
        <div className="settings-grid">
          <div className="setting">
            <label>A/B Testing</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>Auto-optimize enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>Lead Scoring</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>SMS Follow-up</label>
            <input type="checkbox" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
