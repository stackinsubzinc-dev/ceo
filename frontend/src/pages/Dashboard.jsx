import React, { useState } from 'react';
import { TrendingUp, BarChart3, Zap, AlertCircle } from 'lucide-react';
import './Pages.css';

const Dashboard = () => {
  const [factoryStatus] = useState({
    status: 'idle',
    totalCycles: 42,
    avgProductsPerCycle: 3.2,
    totalProducts: 134,
    totalRevenue: '$48,234',
    activeAutomations: 12
  });

  const stats = [
    { label: 'Total Products', value: factoryStatus.totalProducts, change: '+8 this week' },
    { label: 'Revenue Generated', value: factoryStatus.totalRevenue, change: '+32% MoM' },
    { label: 'Active Cycles', value: factoryStatus.totalCycles, change: 'Optimizing' },
    { label: 'Automations Running', value: factoryStatus.activeAutomations, change: 'Stable' }
  ];

  const recentActivity = [
    { time: '2 hours ago', action: 'AI Copywriting Masterclass published to Gumroad', status: 'success' },
    { time: '4 hours ago', action: 'SEO Template pack finished branding optimization', status: 'success' },
    { time: '6 hours ago', action: 'Personal Finance Course sales funnel A/B testing', status: 'in-progress' },
    { time: '8 hours ago', action: 'Market analysis: 5 new trending niches detected', status: 'info' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Factory Dashboard</h1>
        <p>Real-time overview of your autonomous product development system</p>
      </div>

      {/* Key Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h3>{stat.label}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-change">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Factory Status */}
      <div className="content-section">
        <h2>System Status</h2>
        <div className="status-box">
          <div className="status-content">
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span>All systems operational</span>
            </div>
            <p>44 completed cycles | 3.2 avg products per cycle | Next cycle in 12 mins</p>
          </div>
          <button className="btn btn-primary">Start Cycle</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="content-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((item, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-time">{item.time}</div>
              <div className="activity-content">
                <p>{item.action}</p>
                <span className={`activity-badge ${item.status}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
