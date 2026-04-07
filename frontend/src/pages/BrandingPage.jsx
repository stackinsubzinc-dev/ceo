import React, { useState } from 'react';
import { Palette, Download, Eye } from 'lucide-react';
import './Pages.css';

const BrandingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(1);

  const brandingAssets = [
    { name: 'Logo Package', items: ['Main Logo', '7 Variations', 'Favicon', 'Guidelines'], status: 'ready' },
    { name: 'Color Palette', items: ['Primary Colors', 'Secondary Colors', 'Gradients', 'Accessibility'], status: 'ready' },
    { name: 'Typography', items: ['Font Pairing', 'Sizing Scale', 'Hierarchy Rules', 'Usage Guide'], status: 'ready' },
    { name: 'Design System', items: ['Components', 'Patterns', 'Icons', 'Documentation'], status: 'ready' },
    { name: 'Marketing Graphics', items: ['15 Ad Templates', 'Social Headers', 'Email Headers', 'Landing Page'], status: 'ready' },
    { name: 'Brand Guidelines', items: ['Voice & Tone', 'Visual Standards', 'Usage Rules', 'Do\'s & Don\'ts'], status: 'ready' }
  ];

  const products = [
    { id: 1, name: 'AI Copywriting Masterclass' },
    { id: 2, name: 'E-commerce SEO Templates' },
    { id: 3, name: 'Personal Finance Course' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Branding Studio</h1>
        <p>Generate complete professional branding packages for your products</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Select Product</h2>
        </div>
        <div className="button-group">
          {products.map((product) => (
            <button
              key={product.id}
              className={`btn ${selectedProduct === product.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedProduct(product.id)}
            >
              {product.name}
            </button>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Branding Assets</h2>
          <button className="btn btn-primary">Generate New Package</button>
        </div>

        <div className="assets-grid">
          {brandingAssets.map((asset, idx) => (
            <div key={idx} className="asset-card">
              <div className="asset-header">
                <h4>{asset.name}</h4>
                <span className={`badge badge-${asset.status}`}>{asset.status}</span>
              </div>

              <ul className="asset-list">
                {asset.items.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>

              <div className="asset-actions">
                <button className="btn btn-secondary btn-small">
                  <Eye size={16} /> Preview
                </button>
                <button className="btn btn-secondary btn-small">
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="content-section">
          <h3>Color Palette</h3>
          <div className="color-palette">
            <div className="color-swatch" style={{ backgroundColor: '#0ea5e9' }}>
              <span>#0EA5E9</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#06b6d4' }}>
              <span>#06B6D4</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#10b981' }}>
              <span>#10B981</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#f59e0b' }}>
              <span>#F59E0B</span>
            </div>
            <div className="color-swatch" style={{ backgroundColor: '#ef4444' }}>
              <span>#EF4444</span>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h3>Logo Variations</h3>
          <p className="text-secondary mb-4">6 professional logo variations ready to use</p>
          <div className="logo-preview">
            <div className="logo-item">Logo</div>
            <div className="logo-item">Horizontal</div>
            <div className="logo-item">Icon</div>
            <div className="logo-item">Dark</div>
            <div className="logo-item">White</div>
            <div className="logo-item">Mono</div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h3>Brand Voice & Messaging</h3>
        <div className="messaging-box">
          <div className="message-item">
            <span className="label">Brand Mission:</span>
            <p>Empower entrepreneurs with AI-powered business tools</p>
          </div>
          <div className="message-item">
            <span className="label">Tone of Voice:</span>
            <p>Professional, innovative, approachable, and results-focused</p>
          </div>
          <div className="message-item">
            <span className="label">Key Values:</span>
            <p>Automation, Efficiency, Innovation, Accessibility, Results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
