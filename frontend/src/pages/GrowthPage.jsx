import React, { useState } from 'react';
import { Zap, TrendingUp, Lightbulb } from 'lucide-react';
import './Pages.css';

const GrowthPage = () => {
  const [experiments] = useState([
    {
      id: 1,
      name: 'Price Point A/B Test',
      status: 'running',
      duration: '7 days',
      daysLeft: '3 days',
      control: '$47',
      variant: '$67',
      improvement: '+23%'
    },
    {
      id: 2,
      name: 'Email Subject Line Test',
      status: 'running',
      duration: '14 days',
      daysLeft: '8 days',
      control: '45% open rate',
      variant: '52% open rate',
      improvement: '+15%'
    },
    {
      id: 3,
      name: 'Landing Page Copy Test',
      status: 'completed',
      duration: '10 days',
      daysLeft: 'Complete',
      control: '2.1% conversion',
      variant: '3.4% conversion',
      improvement: '+62%'
    },
    {
      id: 4,
      name: 'Bonus Offer Test',
      status: 'running',
      duration: '5 days',
      daysLeft: '2 days',
      control: 'No bonus',
      variant: '5 bonuses',
      improvement: '+41%'
    }
  ]);

  const growthStrategies = [
    {
      title: 'Upsell Ladder',
      description: 'Create 3-tier product offerings with increasing value',
      status: 'implemented',
      roi: '+35%'
    },
    {
      title: 'Referral Program',
      description: 'Set up 30% commission affiliate system',
      status: 'implemented',
      roi: '+28%'
    },
    {
      title: 'Email List Building',
      description: 'Grow list with lead magnets and opt-in sequences',
      status: 'active',
      roi: '+45%'
    },
    {
      title: 'Product Bundling',
      description: 'Create bundle offers that increase average order value',
      status: 'active',
      roi: '+32%'
    },
    {
      title: 'Content Distribution',
      description: 'Multi-channel publishing to maximize reach',
      status: 'implemented',
      roi: '+52%'
    },
    {
      title: 'Customer Re-targeting',
      description: 'Automated sequences for repeat purchases',
      status: 'implemented',
      roi: '+29%'
    }
  ];

  const optimizationOpportunities = [
    {
      opportunity: 'Checkout Page Optimization',
      impact: 'Could increase conversion by 12-15%',
      effort: 'Low',
      priority: 'High'
    },
    {
      opportunity: 'Video Sales Page',
      impact: 'Could increase AOV by 18-22%',
      effort: 'Medium',
      priority: 'High'
    },
    {
      opportunity: 'SMS Integration',
      impact: 'Could recover 8-12% abandoned carts',
      effort: 'Medium',
      priority: 'Medium'
    },
    {
      opportunity: 'Premium Tier Product',
      impact: 'Could add $50K+ annual revenue',
      effort: 'High',
      priority: 'Medium'
    }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI Growth Lab</h1>
        <p>Run experiments, test variations, and optimize for growth</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Experiments</h3>
          <p className="stat-value">3</p>
          <p className="stat-change">Running in parallel</p>
        </div>
        <div className="stat-card">
          <h3>Avg Improvement</h3>
          <p className="stat-value">+26%</p>
          <p className="stat-change">From optimizations</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tests</h3>
          <p className="stat-value">12</p>
          <p className="stat-change">All statistically significant</p>
        </div>
        <div className="stat-card">
          <h3>Growth ROI</h3>
          <p className="stat-value">+187%</p>
          <p className="stat-change">Revenue increase</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Active Experiments</h2>
          <button className="btn btn-primary">Create Experiment</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Experiment</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Control vs Variant</th>
                <th>Improvement</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((exp) => (
                <tr key={exp.id}>
                  <td className="font-semibold">{exp.name}</td>
                  <td>
                    <span className={`badge badge-${exp.status === 'running' ? 'info' : 'success'}`}>
                      {exp.status}
                    </span>
                  </td>
                  <td>
                    <div className="duration-info">
                      <small>{exp.daysLeft}</small>
                      <div className="progress-bar" style={{ width: '100px' }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${100 - (exp.daysLeft === 'Complete' ? 100 : parseInt(exp.daysLeft))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{exp.control} vs {exp.variant}</td>
                  <td className="text-success font-semibold">{exp.improvement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-section">
        <h2>Growth Strategies Implemented</h2>
        <div className="strategies-grid">
          {growthStrategies.map((strategy, idx) => (
            <div key={idx} className="strategy-card">
              <div className="strategy-header">
                <h4>{strategy.title}</h4>
                <span className={`badge badge-${strategy.status}`}>{strategy.status}</span>
              </div>
              <p className="text-secondary">{strategy.description}</p>
              <div className="strategy-roi">
                <span className="roi-value">{strategy.roi}</span>
                <span>avg ROI</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h2>Optimization Opportunities</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Potential Impact</th>
                <th>Effort Level</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {optimizationOpportunities.map((opp, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{opp.opportunity}</td>
                  <td className="text-success">{opp.impact}</td>
                  <td>
                    <span className={`badge badge-${opp.effort.toLowerCase()}`}>
                      {opp.effort}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${opp.priority.toLowerCase()}`}>
                      {opp.priority}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-small">Test</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Quick Wins</h3>
          <div className="quick-wins-list">
            <div className="quick-win">
              <Zap size={20} className="text-warning" />
              <div>
                <p className="font-semibold">Duplicate Top Performer</p>
                <p className="text-secondary">Create variations of best-selling product</p>
                <button className="btn btn-secondary btn-small mt-2">Start</button>
              </div>
            </div>
            <div className="quick-win">
              <TrendingUp size={20} className="text-success" />
              <div>
                <p className="font-semibold">Scale Winners Fast</p>
                <p className="text-secondary">Increase ad spend for high ROI products</p>
                <button className="btn btn-secondary btn-small mt-2">Configure</button>
              </div>
            </div>
            <div className="quick-win">
              <Lightbulb size={20} className="text-info" />
              <div>
                <p className="font-semibold">New Market Test</p>
                <p className="text-secondary">Test products in emerging niches</p>
                <button className="btn btn-secondary btn-small mt-2">Launch</button>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Predictive Analytics</h3>
          <div className="prediction-box">
            <div className="prediction-item">
              <span className="label">Est. Revenue (Next 30 days)</span>
              <span className="value">$76,234</span>
              <span className="forecast">↑ 58% vs previous month</span>
            </div>
            <div className="prediction-item">
              <span className="label">Recommended Price Point</span>
              <span className="value">$87</span>
              <span className="forecast">+$15 from current</span>
            </div>
            <div className="prediction-item">
              <span className="label">Best Time to Launch</span>
              <span className="value">Tuesday 9 AM</span>
              <span className="forecast">+34% traffic vs avg</span>
            </div>
            <div className="prediction-item">
              <span className="label">Churn Risk</span>
              <span className="value">4.2%</span>
              <span className="forecast">Below industry avg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3>Growth Settings & Configuration</h3>
        <div className="settings-grid">
          <div className="setting">
            <label>Automatic Duplicate Winners</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>A/B Testing Enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>Minimum Sample Size</label>
            <input type="number" defaultValue="100" />
          </div>
          <div className="setting">
            <label>Significance Level</label>
            <select>
              <option>95% (Recommended)</option>
              <option>90%</option>
              <option>99%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthPage;
