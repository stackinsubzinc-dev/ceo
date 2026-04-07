import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import './Pages.css';

const AnalyticsPage = () => {
  const [analyticsData] = useState({
    totalRevenue: '$48,234',
    totalSales: 342,
    avgOrderValue: '$141',
    conversionRate: '3.4%',
    customerAcquisitionCost: '$28',
    customerLifetimeValue: '$456',
    returnCustomers: '34%',
    netProfit: '$38,987'
  });

  const topProducts = [
    { name: 'AI Copywriting Masterclass', sales: 143, revenue: '$2,145', margin: '68%' },
    { name: 'Personal Finance Course', sales: 67, revenue: '$3,421', margin: '65%' },
    { name: 'E-commerce SEO Templates', sales: 89, revenue: '$2,310', margin: '72%' },
    { name: 'Social Media Growth Pack', sales: 43, revenue: '$1,548', margin: '70%' }
  ];

  const platformMetrics = [
    { platform: 'Gumroad', sales: 89, revenue: '$1,245', conversion: '2.8%' },
    { platform: 'Email List', sales: 156, revenue: '$2,340', conversion: '4.2%' },
    { platform: 'Website', sales: 67, revenue: '$1,890', conversion: '3.1%' },
    { platform: 'Social Media', sales: 30, revenue: '$890', conversion: '1.2%' }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 2840, conversion: '3.2%', revenue: '$2,145' },
    { source: 'Email List', visitors: 1240, conversion: '6.1%', revenue: '$3,421' },
    { source: 'Social Media', visitors: 890, conversion: '1.8%', revenue: '$890' },
    { source: 'Paid Ads', visitors: 456, conversion: '2.4%', revenue: '$1,234' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics & Revenue</h1>
        <p>Real-time performance metrics and revenue tracking</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">{analyticsData.totalRevenue}</p>
          <p className="stat-change">↑ 32% MoM</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">{analyticsData.totalSales}</p>
          <p className="stat-change">↑ 18% WoW</p>
        </div>
        <div className="stat-card">
          <h3>Avg Order Value</h3>
          <p className="stat-value">{analyticsData.avgOrderValue}</p>
          <p className="stat-change">↑ 12% (upsells)</p>
        </div>
        <div className="stat-card">
          <h3>Net Profit</h3>
          <p className="stat-value">{analyticsData.netProfit}</p>
          <p className="stat-change">↑ 45% (automation)</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Key Performance Metrics</h3>
          <div className="metrics-list">
            <div className="metric-row">
              <span>Conversion Rate</span>
              <span className="metric-value">{analyticsData.conversionRate}</span>
            </div>
            <div className="metric-row">
              <span>Customer Acquisition Cost</span>
              <span className="metric-value">{analyticsData.customerAcquisitionCost}</span>
            </div>
            <div className="metric-row">
              <span>Customer Lifetime Value</span>
              <span className="metric-value">{analyticsData.customerLifetimeValue}</span>
            </div>
            <div className="metric-row">
              <span>Return Customer Rate</span>
              <span className="metric-value">{analyticsData.returnCustomers}</span>
            </div>
            <div className="metric-row">
              <span>CAC Payback Period</span>
              <span className="metric-value">18 days</span>
            </div>
            <div className="metric-row">
              <span>Profit Margin</span>
              <span className="metric-value">81%</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Revenue Distribution</h3>
          <div className="revenue-chart">
            <div className="chart-item">
              <div className="chart-bar" style={{ width: '45%', backgroundColor: '#0ea5e9' }}></div>
              <span>Products: 45%</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ width: '35%', backgroundColor: '#06b6d4' }}></div>
              <span>Upsells: 35%</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ width: '15%', backgroundColor: '#10b981' }}></div>
              <span>Affiliate: 15%</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ width: '5%', backgroundColor: '#f59e0b' }}></div>
              <span>Other: 5%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Top Performing Products</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{product.name}</td>
                  <td>{product.sales}</td>
                  <td className="text-success font-semibold">{product.revenue}</td>
                  <td>{product.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h2>Sales by Platform</h2>
          <div className="table-container">
            <table className="data-table small">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {platformMetrics.map((platform, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{platform.platform}</td>
                    <td>{platform.sales}</td>
                    <td className="text-success">{platform.revenue}</td>
                    <td>{platform.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
          <h2>Traffic Sources</h2>
          <div className="table-container">
            <table className="data-table small">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Visitors</th>
                  <th>Conv. %</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((source, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{source.source}</td>
                    <td>{source.visitors.toLocaleString()}</td>
                    <td className="text-success">{source.conversion}</td>
                    <td className="text-success font-semibold">{source.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Daily Revenue Trend</h2>
        <div className="trend-chart">
          <div className="trend-bar" style={{ height: '45%' }}></div>
          <div className="trend-bar" style={{ height: '62%' }}></div>
          <div className="trend-bar" style={{ height: '38%' }}></div>
          <div className="trend-bar" style={{ height: '71%' }}></div>
          <div className="trend-bar" style={{ height: '55%' }}></div>
          <div className="trend-bar" style={{ height: '68%' }}></div>
          <div className="trend-bar" style={{ height: '82%' }}></div>
        </div>
        <div className="trend-labels">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
