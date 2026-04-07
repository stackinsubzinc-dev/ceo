import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Search } from 'lucide-react';
import './Pages.css';

const OpportunitiesPage = () => {
  const [opportunities] = useState([
    {
      id: 1,
      niche: 'AI Content Writing',
      demandScore: 95,
      competition: 'High',
      marketSize: '$2.4M',
      trending: true,
      searchVolume: 12400,
      profitMargin: '65%'
    },
    {
      id: 2,
      niche: 'E-commerce Automation',
      demandScore: 87,
      competition: 'Medium',
      marketSize: '$1.8M',
      trending: true,
      searchVolume: 8900,
      profitMargin: '72%'
    },
    {
      id: 3,
      niche: 'Personal Finance Courses',
      demandScore: 78,
      competition: 'High',
      marketSize: '$3.2M',
      trending: false,
      searchVolume: 5600,
      profitMargin: '58%'
    },
    {
      id: 4,
      niche: 'Social Media Growth Hacks',
      demandScore: 92,
      competition: 'Medium',
      marketSize: '$1.5M',
      trending: true,
      searchVolume: 11200,
      profitMargin: '70%'
    }
  ]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Opportunity Scanner</h1>
        <p>Discover and analyze viral product opportunities across trending niches</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Active Opportunities</h2>
          <button className="btn btn-secondary">Scan Now</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Niche</th>
                <th>Demand Score</th>
                <th>Competition</th>
                <th>Market Size</th>
                <th>Search Volume</th>
                <th>Profit Margin</th>
                <th>Trending</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id}>
                  <td className="font-semibold">{opp.niche}</td>
                  <td>
                    <div className="score-badge">{opp.demandScore}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${opp.competition.toLowerCase()}`}>
                      {opp.competition}
                    </span>
                  </td>
                  <td>{opp.marketSize}</td>
                  <td>{opp.searchVolume.toLocaleString()}</td>
                  <td className="text-success">{opp.profitMargin}</td>
                  <td>
                    {opp.trending && <span className="badge badge-trending">Trending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Scanner Settings</h3>
          <div className="form-group">
            <label>Minimum Demand Score</label>
            <input type="range" min="0" max="100" defaultValue="70" className="slider" />
            <span>70+</span>
          </div>
          <div className="form-group">
            <label>Market Size (Min)</label>
            <select>
              <option>$500K - $1M</option>
              <option>$1M - $2M</option>
              <option>$2M+</option>
            </select>
          </div>
          <button className="btn btn-primary w-full">Apply Filters</button>
        </div>

        <div className="content-section">
          <h3>Insights</h3>
          <div className="insight-box">
            <AlertCircle size={20} />
            <div>
              <p className="font-semibold">High-Demand Emerging Trend</p>
              <p className="text-secondary">AI automation for small businesses showing 340% YoY growth</p>
            </div>
          </div>
          <div className="insight-box">
            <TrendingUp size={20} />
            <div>
              <p className="font-semibold">Seasonal Peak Detected</p>
              <p className="text-secondary">Q4 holiday content creator tools trending upward</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
