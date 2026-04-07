import React, { useState } from 'react';
import { Package, Clock, TrendingUp } from 'lucide-react';
import './Pages.css';

const ProductsPage = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'AI Copywriting Masterclass',
      niche: 'AI Tools',
      status: 'published',
      type: 'Course',
      revenue: '$2,145',
      sales: 43,
      created: '2026-04-02',
      completeness: 100
    },
    {
      id: 2,
      name: 'E-commerce SEO Templates Bundle',
      niche: 'E-commerce',
      status: 'publishing',
      type: 'Templates',
      revenue: '$890',
      sales: 18,
      created: '2026-04-04',
      completeness: 85
    },
    {
      id: 3,
      name: 'Personal Finance 30-Day Challenge',
      niche: 'Finance',
      status: 'optimizing',
      type: 'Course',
      revenue: '$3,421',
      sales: 67,
      created: '2026-03-28',
      completeness: 100
    },
    {
      id: 4,
      name: 'Social Media Growth Toolkit',
      niche: 'Marketing',
      status: 'draft',
      type: 'Toolkit',
      revenue: '$0',
      sales: 0,
      created: '2026-04-05',
      completeness: 45
    }
  ]);

  const productTypes = [
    { name: 'Courses', icon: '📚', desc: 'Video courses with modules and lessons' },
    { name: 'Templates', icon: '📋', desc: 'Ready-to-use templates and frameworks' },
    { name: 'Tools', icon: '🛠️', desc: 'Software tools and utilities' },
    { name: 'Guides', icon: '📖', desc: 'Digital guides and ebooks' },
    { name: 'Bundles', icon: '📦', desc: 'Multiple products bundled together' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Product Factory</h1>
        <p>Generate, track, and manage your complete product portfolio</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Create New Product</h2>
          <p className="text-secondary">Select a product type to auto-generate content</p>
        </div>

        <div className="grid-5">
          {productTypes.map((type, idx) => (
            <div key={idx} className="product-type-card">
              <div className="type-icon">{type.icon}</div>
              <h4>{type.name}</h4>
              <p>{type.desc}</p>
              <button className="btn btn-secondary btn-small">Generate</button>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>All Products ({products.length})</h2>
          <div className="filter-controls">
            <select>
              <option>All Status</option>
              <option>Published</option>
              <option>Drafts</option>
              <option>Optimizing</option>
            </select>
            <input type="text" placeholder="Search products..." className="search-input" />
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className={`status-badge status-${product.status}`}>
                  {product.status}
                </span>
              </div>

              <div className="product-meta">
                <span className="badge">{product.type}</span>
                <span className="badge badge-secondary">{product.niche}</span>
              </div>

              <div className="product-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${product.completeness}%` }}
                  ></div>
                </div>
                <span className="text-xs">{product.completeness}% Complete</span>
              </div>

              <div className="product-stats">
                <div className="stat">
                  <span className="stat-label">Revenue</span>
                  <span className="stat-value">{product.revenue}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sales</span>
                  <span className="stat-value">{product.sales}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created</span>
                  <span className="stat-value text-xs">{product.created}</span>
                </div>
              </div>

              <div className="product-actions">
                <button className="btn btn-small">View</button>
                <button className="btn btn-secondary btn-small">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <h3>Generation Settings</h3>
        <div className="settings-grid">
          <div className="setting">
            <label>Auto-publish enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting">
            <label>Target price point ($)</label>
            <input type="number" defaultValue="47" />
          </div>
          <div className="setting">
            <label>Content depth</label>
            <select>
              <option>Comprehensive (2-4 hours)</option>
              <option>Standard (1-2 hours)</option>
              <option>Quick (30 mins)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
