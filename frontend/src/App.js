import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Package, AlertCircle, 
  CheckCircle, Clock, ExternalLink, Sparkles, Activity,
  Key, Target, Settings, Search
} from 'lucide-react';
import KeyVault from './components/KeyVault';
import OpportunityHunter from './components/OpportunityHunter';
import ProjectFiles from './components/ProjectFiles';
import AIAssistant from './components/AIAssistant';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [revenueMetrics, setRevenueMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [revenueRecs, setRevenueRecs] = useState(null);
  const [socialPosts, setSocialPosts] = useState([]);
  const [affiliateProgram, setAffiliateProgram] = useState(null);
  const [insights, setInsights] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [marketplaceStats, setMarketplaceStats] = useState(null);
  const [automationSchedule, setAutomationSchedule] = useState(null);
  const [launchResult, setLaunchResult] = useState(null);
  const [gumroadData, setGumroadData] = useState(null);
  const [realtimeAnalytics, setRealtimeAnalytics] = useState(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [launchNiche, setLaunchNiche] = useState('');
  const [launchType, setLaunchType] = useState('ebook');
  const [showKeyVault, setShowKeyVault] = useState(false);
  const [showOpportunityHunter, setShowOpportunityHunter] = useState(false);
  const [showProjectFiles, setShowProjectFiles] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes, opportunitiesRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/products?limit=10`),
        axios.get(`${API}/opportunities?limit=5`)
      ]);

      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOpportunities(opportunitiesRes.data);
      
      // Generate mock revenue data for chart
      const mockRevenue = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        conversions: Math.floor(Math.random() * 50) + 10
      }));
      setRevenueMetrics(mockRevenue);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handlePublish = async (productId) => {
    try {
      await axios.put(`${API}/products/${productId}/status`, null, {
        params: { status: 'published' }
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error publishing product:", error);
    }
  };

  const runAutonomousCycle = async () => {
    setAiRunning(true);
    setAiMessage('🤖 Starting autonomous AI cycle...');
    
    try {
      const response = await axios.post(`${API}/ai/run-autonomous-cycle`);
      const results = response.data.results;
      
      setAiMessage(`✅ Cycle complete! Found ${results.opportunities_found} opportunities, created ${results.products_created} products`);
      
      setTimeout(() => {
        fetchDashboardData();
        setAiRunning(false);
        setAiMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error running autonomous cycle:", error);
      setAiMessage('❌ Error running autonomous cycle');
      setAiRunning(false);
    }
  };

  const scoutOpportunities = async () => {
    setAiRunning(true);
    setAiMessage('🔍 Scouting new opportunities...');
    
    try {
      const response = await axios.post(`${API}/ai/scout-opportunities`);
      setAiMessage(`✅ Found ${response.data.opportunities_found} new opportunities!`);
      
      setTimeout(() => {
        fetchDashboardData();
        setAiRunning(false);
        setAiMessage('');
      }, 2000);
    } catch (error) {
      console.error("Error scouting opportunities:", error);
      setAiMessage('❌ Error scouting opportunities');
      setAiRunning(false);
    }
  };

  const generateProduct = async (opportunity) => {
    setAiRunning(true);
    setAiMessage(`📚 Generating product for: ${opportunity.niche}...`);
    
    try {
      const response = await axios.post(`${API}/ai/generate-book`, {
        niche: opportunity.niche,
        keywords: opportunity.keywords,
        book_length: "medium",
        target_audience: "general"
      });
      
      setAiMessage(`✅ Created: ${response.data.product.title}!`);
      
      setTimeout(() => {
        fetchDashboardData();
        setAiRunning(false);
        setAiMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error generating product:", error);
      setAiMessage('❌ Error generating product');
      setAiRunning(false);
    }
  };

  const optimizeRevenue = async () => {
    setAiRunning(true);
    setAiMessage('💰 Optimizing pricing and creating bundles...');
    
    try {
      const response = await axios.post(`${API}/ai/optimize-revenue`);
      setRevenueRecs(response.data.recommendations);
      setAiMessage('✅ Revenue optimization complete!');
      
      setTimeout(() => {
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('marketing');
      }, 2000);
    } catch (error) {
      console.error("Error optimizing revenue:", error);
      setAiMessage('❌ Error optimizing revenue');
      setAiRunning(false);
    }
  };

  const generateAffiliateProgram = async () => {
    setAiRunning(true);
    setAiMessage('🤝 Creating affiliate program...');
    
    try {
      const response = await axios.post(`${API}/ai/generate-affiliate-program`);
      setAffiliateProgram(response.data.program);
      setAiMessage('✅ Affiliate program created!');
      
      setTimeout(() => {
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('marketing');
      }, 2000);
    } catch (error) {
      console.error("Error creating affiliate program:", error);
      setAiMessage('❌ Error creating affiliate program');
      setAiRunning(false);
    }
  };

  const generateSocialPosts = async (productId) => {
    setAiRunning(true);
    setAiMessage('📱 Generating social media posts...');
    
    try {
      const response = await axios.post(`${API}/ai/generate-social-posts`, {
        product_id: productId,
        num_posts: 5
      });
      setSocialPosts(response.data.posts);
      setAiMessage(`✅ Generated ${response.data.posts_generated} social posts!`);
      
      setTimeout(() => {
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('marketing');
      }, 2000);
    } catch (error) {
      console.error("Error generating social posts:", error);
      setAiMessage('❌ Error generating social posts');
      setAiRunning(false);
    }
  };

  const getAnalytics = async () => {
    setAiRunning(true);
    setAiMessage('📊 Generating AI-powered insights...');
    
    try {
      const response = await axios.get(`${API}/analytics/insights`);
      setInsights(response.data.insights);
      setAiMessage('✅ Analytics complete!');
      
      setTimeout(() => {
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('automation');
      }, 2000);
    } catch (error) {
      console.error("Error getting analytics:", error);
      setAiMessage('❌ Error getting analytics');
      setAiRunning(false);
    }
  };

  // 🚀 LAUNCH PRODUCT ONE-CLICK
  const launchProductOneClick = async () => {
    setAiRunning(true);
    setShowLaunchModal(false);
    setAiMessage('🚀 LAUNCHING PRODUCT... Scout → Generate → Publish → Market');
    
    try {
      const response = await axios.post(`${API}/launch-product`, {
        niche: launchNiche || null,
        product_type: launchType,
        auto_publish: true,
        generate_social: true
      });
      
      const result = response.data;
      setLaunchResult(result);
      
      if (result.success) {
        const gumroadUrl = result.gumroad?.url || 'pending';
        setAiMessage(`🎉 PRODUCT LAUNCHED!\n📚 ${result.product?.title || 'New Product'}\n🛒 Gumroad: ${result.gumroad?.success ? 'LIVE' : 'Pending'}\n📱 ${result.social_posts?.length || 0} social posts ready`);
        
        setTimeout(() => {
          fetchDashboardData();
          setAiRunning(false);
          setActiveTab('overview');
        }, 5000);
      } else {
        setAiMessage(`⚠️ Launch incomplete: ${result.error || 'Check stages for details'}`);
        setAiRunning(false);
      }
    } catch (error) {
      console.error("Error launching product:", error);
      setAiMessage('❌ Error launching product: ' + (error.response?.data?.detail || error.message));
      setAiRunning(false);
    }
  };

  // 📊 Get Real-time Analytics
  const getRealtimeAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/analytics/realtime`);
      setRealtimeAnalytics(response.data);
    } catch (error) {
      console.error("Error getting realtime analytics:", error);
    }
  };

  // 🛒 Get Gumroad Data
  const fetchGumroadData = async () => {
    try {
      const [productsRes, salesRes] = await Promise.all([
        axios.get(`${API}/gumroad/products`),
        axios.get(`${API}/gumroad/sales`)
      ]);
      setGumroadData({
        products: productsRes.data,
        sales: salesRes.data
      });
    } catch (error) {
      console.error("Error fetching Gumroad data:", error);
    }
  };

  // 📱 Generate YouTube Shorts
  const generateYouTubeShorts = async (productId) => {
    setAiRunning(true);
    setAiMessage('🎬 Generating YouTube Shorts scripts...');
    
    try {
      const response = await axios.post(`${API}/social/youtube-shorts`, {
        product_id: productId,
        num_scripts: 5
      });
      
      setAiMessage(`✅ Generated ${response.data.shorts_generated} YouTube Shorts scripts!`);
      
      setTimeout(() => {
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('marketing');
      }, 2000);
    } catch (error) {
      console.error("Error generating YouTube shorts:", error);
      setAiMessage('❌ Error generating shorts');
      setAiRunning(false);
    }
  };

  // 📱 Create Social Campaign
  const createSocialCampaign = async (productId) => {
    setAiRunning(true);
    setAiMessage('📱 Creating full social media campaign...');
    
    try {
      const response = await axios.post(`${API}/social/campaign`, {
        product_id: productId,
        platforms: ["twitter", "instagram", "tiktok", "linkedin"],
        posts_per_platform: 3
      });
      
      setAiMessage(`✅ Campaign created! ${response.data.campaign.total_posts} posts across ${Object.keys(response.data.campaign.platforms).length} platforms`);
      
      setTimeout(() => {
        fetchDashboardData();
        setAiRunning(false);
        setAiMessage('');
        setActiveTab('marketing');
      }, 2000);
    } catch (error) {
      console.error("Error creating campaign:", error);
      setAiMessage('❌ Error creating campaign');
      setAiRunning(false);
    }
  };

  // Publish to Gumroad
  const publishToGumroad = async (productId) => {
    setAiRunning(true);
    setAiMessage('🛒 Publishing to Gumroad...');
    
    try {
      const response = await axios.post(`${API}/gumroad/publish?product_id=${productId}`);
      
      if (response.data.success) {
        setAiMessage(`✅ Published to Gumroad! URL: ${response.data.url}`);
      } else {
        setAiMessage(`⚠️ Gumroad: ${response.data.error || 'Check configuration'}`);
      }
      
      setTimeout(() => {
        fetchDashboardData();
        setAiRunning(false);
        setAiMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error publishing to Gumroad:", error);
      setAiMessage('❌ Error publishing: ' + (error.response?.data?.detail || error.message));
      setAiRunning(false);
    }
  };

  const getSystemHealth = async () => {
    try {
      const response = await axios.get(`${API}/system/health`);
      setSystemHealth(response.data);
    } catch (error) {
      console.error("Error getting system health:", error);
    }
  };

  const getMarketplaceStats = async () => {
    try {
      const response = await axios.get(`${API}/marketplace/stats`);
      setMarketplaceStats(response.data);
    } catch (error) {
      console.error("Error getting marketplace stats:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'automation') {
      getSystemHealth();
      getMarketplaceStats();
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      ready: 'bg-blue-500',
      published: 'bg-green-500',
      retired: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProductTypeIcon = (type) => {
    const icons = {
      ebook: '📚',
      course: '🎓',
      template: '📄',
      planner: '📅',
      mini_app: '⚡'
    };
    return icons[type] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <Activity className="animate-spin" size={32} />
          Loading CEO Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6" data-testid="ceo-dashboard">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3" data-testid="dashboard-title">
              <Sparkles className="text-purple-400" size={40} />
              AI Empire CEO Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Fully Autonomous Product Generation System</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            System Autonomous
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="stat-total-products">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_products || 0}</p>
                <p className="text-purple-400 text-sm mt-2">+{stats?.products_today || 0} today</p>
              </div>
              <Package className="text-purple-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="stat-total-revenue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">${stats?.total_revenue?.toFixed(2) || '0.00'}</p>
                <p className="text-green-400 text-sm mt-2">+${stats?.revenue_today?.toFixed(2) || '0.00'} today</p>
              </div>
              <DollarSign className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="stat-pending-tasks">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending AI Tasks</p>
                <p className="text-3xl font-bold mt-1">{stats?.pending_tasks || 0}</p>
                <p className="text-yellow-400 text-sm mt-2">In queue</p>
              </div>
              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="stat-opportunities">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Opportunities</p>
                <p className="text-3xl font-bold mt-1">{stats?.active_opportunities || 0}</p>
                <p className="text-blue-400 text-sm mt-2">Trending niches</p>
              </div>
              <TrendingUp className="text-blue-400" size={40} />
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button
            onClick={() => setShowAIAssistant(true)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl p-4 flex items-center gap-3 transition-all"
            data-testid="open-assistant-btn"
          >
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <p className="font-bold">Atlas AI</p>
              <p className="text-white/70 text-xs">Your assistant</p>
            </div>
          </button>
          <button
            onClick={() => setShowProjectFiles(true)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl p-4 flex items-center gap-3 transition-all"
            data-testid="open-files-btn"
          >
            <span className="text-2xl">📁</span>
            <div className="text-left">
              <p className="font-bold">Project Files</p>
              <p className="text-white/70 text-xs">Download & manage</p>
            </div>
          </button>
          <button
            onClick={() => setShowKeyVault(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl p-4 flex items-center gap-3 transition-all"
            data-testid="open-key-vault-btn"
          >
            <span className="text-2xl">🔐</span>
            <div className="text-left">
              <p className="font-bold">Key Vault</p>
              <p className="text-white/70 text-xs">112+ platforms</p>
            </div>
          </button>
          <button
            onClick={() => setShowOpportunityHunter(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl p-4 flex items-center gap-3 transition-all"
            data-testid="open-hunter-btn"
          >
            <span className="text-2xl">🎯</span>
            <div className="text-left">
              <p className="font-bold">Opportunity Hunter</p>
              <p className="text-white/70 text-xs">Find income streams</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showKeyVault && <KeyVault onClose={() => setShowKeyVault(false)} />}
      {showOpportunityHunter && <OpportunityHunter onClose={() => setShowOpportunityHunter(false)} />}
      {showProjectFiles && <ProjectFiles onClose={() => setShowProjectFiles(false)} />}
      {showAIAssistant && (
        <AIAssistant 
          onClose={() => setShowAIAssistant(false)} 
          onAction={(action) => {
            if (action === 'open_vault') setShowKeyVault(true);
            if (action === 'open_hunter') setShowOpportunityHunter(true);
            if (action === 'view_products') setActiveTab('overview');
          }}
        />
      )}

      {/* AI Control Panel */}
      {aiMessage && (
        <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
          <p className="text-white text-center font-medium">{aiMessage}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'overview' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
            data-testid="tab-overview"
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'marketing' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
            data-testid="tab-marketing"
          >
            📈 Marketing & Revenue
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`flex-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'automation' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
            data-testid="tab-automation"
          >
            🤖 Automation & Analytics
          </button>
        </div>
      </div>

      <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="ai-control-panel">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles size={24} className="text-purple-400" />
          AI Team Controls
        </h2>
        
        {/* 🚀 LAUNCH PRODUCT - THE MONEY MAKER */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
                🚀 LAUNCH PRODUCT (One-Click)
              </h3>
              <p className="text-sm text-gray-300">Scout → Generate → Publish to Gumroad → Create Marketing</p>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Niche (optional)</label>
              <input
                type="text"
                placeholder="e.g., productivity, fitness, investing..."
                value={launchNiche}
                onChange={(e) => setLaunchNiche(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500"
                data-testid="launch-niche-input"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Type</label>
              <select
                value={launchType}
                onChange={(e) => setLaunchType(e.target.value)}
                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white"
                data-testid="launch-type-select"
              >
                <option value="ebook">📚 eBook ($29.99)</option>
                <option value="course">🎓 Course ($49.99)</option>
              </select>
            </div>
            <button
              onClick={launchProductOneClick}
              disabled={aiRunning}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 px-8 py-2.5 rounded-lg transition-all flex items-center gap-2 font-bold text-lg shadow-lg shadow-green-500/30"
              data-testid="launch-product-btn"
            >
              {aiRunning ? <Activity className="animate-spin" size={20} /> : '🚀'}
              {aiRunning ? 'LAUNCHING...' : 'LAUNCH NOW'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Master Control */}
          <button
            onClick={runAutonomousCycle}
            disabled={aiRunning}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="run-autonomous-cycle-btn"
          >
            <Activity className={aiRunning ? "animate-spin" : ""} size={20} />
            {aiRunning ? 'Running...' : 'Auto Cycle'}
          </button>

          {/* Scout Opportunities */}
          <button
            onClick={scoutOpportunities}
            disabled={aiRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="scout-opportunities-btn"
          >
            <TrendingUp size={20} />
            Scout
          </button>

          {/* Generate Product (Quick) */}
          <button
            onClick={() => opportunities.length > 0 && generateProduct(opportunities[0])}
            disabled={aiRunning || opportunities.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="quick-generate-btn"
          >
            <Package size={20} />
            Generate
          </button>

          {/* Revenue Optimizer */}
          <button
            onClick={optimizeRevenue}
            disabled={aiRunning}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="optimize-revenue-btn"
          >
            <DollarSign size={20} />
            Optimize
          </button>

          {/* Social Media Posts */}
          <button
            onClick={() => products.length > 0 && generateSocialPosts(products[0].id)}
            disabled={aiRunning || products.length === 0}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="generate-social-btn"
          >
            <Sparkles size={20} />
            Social Posts
          </button>

          {/* YouTube Shorts */}
          <button
            onClick={() => products.length > 0 && generateYouTubeShorts(products[0].id)}
            disabled={aiRunning || products.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="youtube-shorts-btn"
          >
            🎬
            YT Shorts
          </button>

          {/* Full Social Campaign */}
          <button
            onClick={() => products.length > 0 && createSocialCampaign(products[0].id)}
            disabled={aiRunning || products.length === 0}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="social-campaign-btn"
          >
            📱
            Campaign
          </button>

          {/* Analytics */}
          <button
            onClick={getAnalytics}
            disabled={aiRunning}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 px-6 py-4 rounded-lg transition-all flex items-center gap-3 justify-center font-semibold"
            data-testid="analytics-btn"
          >
            <Activity size={20} />
            Analytics
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>💡 <strong>Launch Product:</strong> Full cycle from idea → Gumroad listing → social media posts in ONE click!</p>
        </div>
      </div>

      {/* Launch Result Display */}
      {launchResult && launchResult.success && (
        <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4">🎉 Product Launched Successfully!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400">Product</p>
              <p className="font-bold">{launchResult.product?.title || 'New Product'}</p>
              <p className="text-xs text-gray-500">{launchResult.product?.product_type}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400">Gumroad Status</p>
              <p className={`font-bold ${launchResult.gumroad?.success ? 'text-green-400' : 'text-yellow-400'}`}>
                {launchResult.gumroad?.success ? '✅ LIVE' : '⏳ Pending'}
              </p>
              {launchResult.gumroad?.url && (
                <a href={launchResult.gumroad.url} target="_blank" rel="noopener noreferrer" 
                   className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                  View on Gumroad <ExternalLink size={12} />
                </a>
              )}
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <p className="text-sm text-gray-400">Marketing</p>
              <p className="font-bold">{launchResult.social_posts?.length || 0} Posts Ready</p>
              <p className="text-xs text-gray-500">Across all platforms</p>
            </div>
          </div>
          {launchResult.analytics && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-2">📊 Projections</p>
              <div className="flex gap-4 text-sm">
                <span>Est. Monthly Revenue: <span className="text-green-400 font-bold">${launchResult.analytics.estimated_monthly_revenue}</span></span>
                <span>Success Rate: <span className="text-blue-400 font-bold">{launchResult.analytics.success_probability}</span></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conditional Tab Content */}
      {activeTab === 'overview' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products & Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Product Feed */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="daily-product-feed">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package size={24} className="text-purple-400" />
              Daily Product Feed
            </h2>
            
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No products generated yet. The AI teams will start creating products automatically.</p>
                </div>
              ) : (
                products.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all"
                    data-testid={`product-card-${product.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl">{getProductTypeIcon(product.product_type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(product.status)} text-white`}>
                              {product.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span className="text-green-400">${product.revenue.toFixed(2)} revenue</span>
                            <span className="text-blue-400">{product.conversions} conversions</span>
                            <span className="text-purple-400">${product.price} price</span>
                          </div>

                          {/* Marketplace Links */}
                          <div className="flex gap-2 mt-3">
                            {product.marketplace_links?.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-500/30 transition-all flex items-center gap-1"
                                data-testid={`marketplace-link-${link.platform.toLowerCase().replace(' ', '-')}`}
                              >
                                {link.platform}
                                <ExternalLink size={12} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Publish Controls */}
                      <div className="flex flex-col gap-2">
                        {product.status === 'ready' && (
                          <>
                            <button
                              onClick={() => publishToGumroad(product.id)}
                              disabled={aiRunning}
                              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-semibold"
                              data-testid={`gumroad-btn-${product.id}`}
                            >
                              🛒 Gumroad
                            </button>
                            <button
                              onClick={() => handlePublish(product.id)}
                              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
                              data-testid={`publish-btn-${product.id}`}
                            >
                              <CheckCircle size={16} />
                              Publish
                            </button>
                          </>
                        )}
                        {product.status === 'published' && !product.gumroad_data && (
                          <button
                            onClick={() => publishToGumroad(product.id)}
                            disabled={aiRunning}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-semibold"
                            data-testid={`gumroad-btn-${product.id}`}
                          >
                            🛒 Sell on Gumroad
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revenue Metrics Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="revenue-chart">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <DollarSign size={24} className="text-green-400" />
              Revenue Metrics (7 Days)
            </h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #ffffff30', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="conversions" stroke="#8b5cf6" strokeWidth={2} name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Opportunities & Alerts */}
        <div className="space-y-6">
          {/* Trending Opportunities */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="opportunities-panel">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              Trending Opportunities
            </h2>
            
            <div className="space-y-3">
              {opportunities.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  Opportunity Scout AI will identify trending niches automatically.
                </p>
              ) : (
                opportunities.map((opp) => (
                  <div 
                    key={opp.id} 
                    className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-purple-400/50 transition-all"
                    data-testid={`opportunity-${opp.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{opp.niche}</h3>
                      <span className="text-yellow-400 text-sm font-bold">
                        {(opp.trend_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {opp.keywords?.slice(0, 3).map((keyword, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => generateProduct(opp)}
                      disabled={aiRunning}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-1.5 rounded text-xs transition-all mt-2"
                      data-testid={`generate-from-opp-${opp.id}`}
                    >
                      Generate Product
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Optimization Alerts */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="optimization-alerts">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-400" />
              Optimization Alerts
            </h2>
            
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-400">All Systems Operational</p>
                    <p className="text-xs text-gray-400 mt-1">All AI teams running autonomously</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-400">Revenue Optimizer Active</p>
                    <p className="text-xs text-gray-400 mt-1">Analyzing pricing and campaigns</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-purple-400">AI Teams Coordinating</p>
                    <p className="text-xs text-gray-400 mt-1">Micro-taskforce orchestrating workflows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Type Distribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20" data-testid="product-distribution">
            <h2 className="text-xl font-bold mb-4">Product Distribution</h2>
            
            <div className="space-y-2">
              {['ebook', 'course', 'template', 'planner', 'mini_app'].map((type, idx) => {
                const count = products.filter(p => p.product_type === type).length;
                const percentage = products.length > 0 ? (count / products.length * 100).toFixed(0) : 0;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Marketing & Revenue Tab */}
      {activeTab === 'marketing' && (
        <div className="space-y-6">
          {/* Revenue Optimization */}
          {revenueRecs && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DollarSign size={24} className="text-green-400" />
                Revenue Optimization Recommendations
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {revenueRecs.pricing_recommendations?.slice(0, 6).map((rec, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="font-semibold mb-2">{rec.product_title}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-gray-400">${rec.current_price}</span>
                      <span className="text-green-400">→ ${rec.recommended_price}</span>
                      <span className="text-yellow-400 text-sm">{rec.estimated_revenue_increase}</span>
                    </div>
                    <p className="text-sm text-gray-400">{rec.reasoning}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3">Recommended Bundles</h3>
              <div className="space-y-3">
                {revenueRecs.bundles?.slice(0, 3).map((bundle, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{bundle.bundle_name}</h4>
                      <span className="text-green-400 font-bold">${bundle.bundle_price}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{bundle.appeal}</p>
                    <div className="flex flex-wrap gap-2">
                      {bundle.products.map((product, pidx) => (
                        <span key={pidx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          {product}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-yellow-400 mt-2">Savings: {bundle.savings}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Posts */}
          {socialPosts.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles size={24} className="text-pink-400" />
                Social Media Posts ({socialPosts.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialPosts.map((post) => (
                  <div key={post.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{post.platform}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">{post.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.hashtags?.map((tag, idx) => (
                        <span key={idx} className="text-xs text-blue-400">{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.post_time} • {post.cta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Program */}
          {affiliateProgram && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-indigo-400" />
                Affiliate Program
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Active Affiliates</h3>
                  <p className="text-3xl font-bold text-indigo-400">{affiliateProgram.active_affiliates}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Total Sales</h3>
                  <p className="text-3xl font-bold text-green-400">{affiliateProgram.total_sales}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-sm text-gray-400">Total Revenue</h3>
                  <p className="text-3xl font-bold text-yellow-400">${affiliateProgram.total_revenue?.toFixed(2)}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">Top Affiliates</h3>
              <div className="space-y-2">
                {affiliateProgram.top_affiliates?.map((affiliate, idx) => (
                  <div key={affiliate.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{affiliate.name}</p>
                      <p className="text-sm text-gray-400">{affiliate.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        <span className="text-yellow-400 font-bold">{affiliate.tier}</span>
                        {' • '}
                        {affiliate.sales} sales
                      </p>
                      <p className="text-green-400 font-semibold">${affiliate.commission_earned.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Commission Structure</h4>
                <div className="flex gap-4">
                  {affiliateProgram.commission_structure?.tiers?.map((tier, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <p className="text-sm text-gray-400">{tier.level}</p>
                      <p className="font-bold text-lg">{tier.rate}%</p>
                      <p className="text-xs text-gray-500">{tier.sales_required}+ sales</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!revenueRecs && !socialPosts.length && !affiliateProgram && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
              <DollarSign size={64} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Marketing & Revenue Optimization</h2>
              <p className="text-gray-400 mb-6">
                Use the AI Team Controls to generate marketing materials and optimize revenue
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={optimizeRevenue}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg"
                >
                  Optimize Revenue
                </button>
                <button
                  onClick={generateAffiliateProgram}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg"
                >
                  Create Affiliate Program
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Automation & Analytics Tab */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          {/* System Health */}
          {systemHealth && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity size={24} className="text-green-400" />
                System Health
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-2xl font-bold text-green-400">{systemHealth.status}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Products</p>
                  <p className="text-2xl font-bold">{systemHealth.stats.total_products}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Opportunities</p>
                  <p className="text-2xl font-bold">{systemHealth.stats.total_opportunities}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Pending Tasks</p>
                  <p className="text-2xl font-bold text-yellow-400">{systemHealth.stats.pending_tasks}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Insights */}
          {insights && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-blue-400" />
                Business Insights & Predictions
              </h2>
              
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Conversion Rate</p>
                  <p className="text-xl font-bold text-green-400">{insights.kpis.conversion_rate}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Avg Order Value</p>
                  <p className="text-xl font-bold text-purple-400">${insights.kpis.average_order_value}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Published</p>
                  <p className="text-xl font-bold text-blue-400">{insights.kpis.products_published}/{insights.kpis.total_products}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Total Conversions</p>
                  <p className="text-xl font-bold text-yellow-400">{insights.kpis.total_conversions}</p>
                </div>
              </div>

              {/* Revenue Forecast */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-lg mb-3">📈 Revenue Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Current Month</p>
                    <p className="text-lg font-bold">${insights.revenue_forecast.current_month.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Next Month</p>
                    <p className="text-lg font-bold text-green-400">${insights.revenue_forecast.next_month.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Next Quarter</p>
                    <p className="text-lg font-bold text-blue-400">${insights.revenue_forecast.next_quarter.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Next Year</p>
                    <p className="text-lg font-bold text-purple-400">${insights.revenue_forecast.next_year.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">Growth Rate: {insights.revenue_forecast.growth_rate}% monthly</p>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-bold mb-2">🎯 AI Recommendations</h3>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-300">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Marketplace Stats */}
          {marketplaceStats && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package size={24} className="text-orange-400" />
                Marketplace Integrations
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Total Listings</p>
                  <p className="text-2xl font-bold">{marketplaceStats.total_listings}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold text-green-400">{marketplaceStats.total_sales}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-purple-400">${marketplaceStats.total_revenue.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Marketplaces</p>
                  <p className="text-2xl font-bold text-blue-400">{Object.keys(marketplaceStats.by_marketplace || {}).length}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">🛒 Supported Marketplaces:</p>
                <div className="flex flex-wrap gap-2">
                  {['Gumroad', 'Shopify', 'Amazon KDP', 'Etsy', 'Udemy'].map((marketplace, idx) => (
                    <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                      {marketplace}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">Mock integrations ready - upgrade with real API credentials</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!insights && !systemHealth && !marketplaceStats && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
              <Activity size={64} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Automation & Analytics</h2>
              <p className="text-gray-400 mb-6">
                Get AI-powered insights, system health, and marketplace analytics
              </p>
              <button
                onClick={getAnalytics}
                className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg"
              >
                Generate Analytics
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
