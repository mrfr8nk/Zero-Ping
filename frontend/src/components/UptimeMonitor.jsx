
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Activity, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const API_URL = '/api';

const UptimeMonitor = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    url: '',
    pingInterval: 5
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [siteUptime, setSiteUptime] = useState(0);
  const [uptimeStartTime, setUptimeStartTime] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    loadServices();
    loadSiteUptime();
    
    const servicesInterval = setInterval(loadServices, 30000);
    const uptimeInterval = setInterval(updateUptime, 1000);
    
    return () => {
      clearInterval(servicesInterval);
      clearInterval(uptimeInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadSiteUptime = async () => {
    try {
      const response = await axios.get(`${API_URL}/site-uptime`);
      setUptimeStartTime(new Date(response.data.startTime));
      setSiteUptime(response.data.uptimeSeconds);
    } catch (error) {
      console.error('Failed to load site uptime:', error);
    }
  };

  const updateUptime = () => {
    if (uptimeStartTime) {
      const uptime = Math.floor((Date.now() - uptimeStartTime.getTime()) / 1000);
      setSiteUptime(uptime);
    }
  };

  const loadServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.url) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/services`, newService);
      setNewService({ name: '', url: '', pingInterval: 5 });
      await loadServices();
    } catch (error) {
      console.error('Failed to add service:', error);
      alert('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    const password = prompt('Enter admin password to delete:');
    
    if (password !== 'darex123') {
      alert('Incorrect password!');
      return;
    }

    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API_URL}/services/${id}`);
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      await axios.patch(`${API_URL}/services/${service._id}/toggle`);
      await loadServices();
    } catch (error) {
      console.error('Failed to toggle service:', error);
      alert('Failed to toggle service. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'offline':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
    }
  };

  const formatUptime = (service) => {
    if (!service.totalPings || service.totalPings === 0) return 'N/A';
    const uptimePercentage = ((service.uptime / service.totalPings) * 100).toFixed(2);
    return `${uptimePercentage}%`;
  };

  const formatSiteUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Site Uptime Banner */}
        <div className={`mb-6 rounded-2xl p-4 backdrop-blur-sm ${
          isDarkMode
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20'
            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className={`font-semibold text-sm md:text-base ${
              isDarkMode ? 'text-green-400' : 'text-green-700'
            }`}>
              Server Active: {formatSiteUptime(siteUptime)}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/50">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-blue-400 via-cyan-400 to-blue-500' 
                  : 'from-blue-600 via-cyan-600 to-blue-700'
              } bg-clip-text text-transparent`} style={{ fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                Zero Ping Uptime Monitor
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monitoring Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40'
                  : 'bg-slate-200 border border-slate-300 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleRefresh}
              className={`p-3 rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40'
                  : 'bg-blue-100 border border-blue-200 text-blue-600 hover:bg-blue-200'
              } ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`backdrop-blur-xl rounded-2xl p-6 mb-8 shadow-xl ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/20'
            : 'bg-white/80 border border-blue-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            <Plus className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            Add New Service
          </h2>
          <form onSubmit={handleAddService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Service Name (e.g., My API)"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className={`px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
                required
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={newService.url}
                onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                className={`px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isDarkMode
                    ? 'bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                    : 'bg-white border border-gray-300 text-slate-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
                required
              />
              <div className="flex gap-2">
                <select
                  value={newService.pingInterval}
                  onChange={(e) => setNewService({ ...newService, pingInterval: parseInt(e.target.value) })}
                  className={`flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode
                      ? 'bg-slate-900/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-white border border-gray-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                >
                  <option value="1">Every 1 min</option>
                  <option value="5">Every 5 min</option>
                  <option value="10">Every 10 min</option>
                  <option value="15">Every 15 min</option>
                  <option value="30">Every 30 min</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Activity className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`} />
              <p className={`text-lg ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>No services yet. Add one to get started!</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className={`backdrop-blur-xl rounded-2xl p-6 transition-all shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-slate-900/80 to-blue-900/40 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-blue-500/10'
                    : 'bg-white/90 border border-gray-200 hover:border-blue-400 hover:shadow-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{service.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className={`p-2 rounded-lg transition-colors group ${
                      isDarkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                    }`}
                  >
                    <Trash2 className={`w-5 h-5 ${isDarkMode ? 'text-red-400 group-hover:text-red-300' : 'text-red-500 group-hover:text-red-600'}`} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                      service.status === 'online'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : service.status === 'offline'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {service.status || 'Pending'}
                    </span>
                    <button
                      onClick={() => toggleServiceStatus(service)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        service.isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                          : isDarkMode
                          ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30'
                          : 'bg-gray-200 text-gray-600 border border-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className={`text-sm truncate px-3 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'text-slate-400 bg-slate-900/50' 
                      : 'text-slate-600 bg-gray-100'
                  }`}>{service.url}</p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className={`rounded-lg p-3 ${
                      isDarkMode 
                        ? 'bg-slate-900/50 border border-slate-700/50' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`text-xs mb-1 uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Response Time</div>
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 ${
                      isDarkMode 
                        ? 'bg-slate-900/50 border border-slate-700/50' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`text-xs mb-1 uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Uptime</div>
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {formatUptime(service)}
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 ${
                      isDarkMode 
                        ? 'bg-slate-900/50 border border-slate-700/50' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`text-xs mb-1 uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Ping Interval</div>
                      <div className={`font-bold text-sm flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Clock className="w-3 h-3" />
                        {service.interval || service.pingInterval} min
                      </div>
                    </div>

                    <div className={`rounded-lg p-3 ${
                      isDarkMode 
                        ? 'bg-slate-900/50 border border-slate-700/50' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`text-xs mb-1 uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Last Ping</div>
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {service.lastPing
                          ? new Date(service.lastPing).toLocaleTimeString()
                          : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="mt-12 text-center pb-6">
          <div className={`backdrop-blur-xl rounded-2xl p-6 ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900/50 to-blue-900/30 border border-blue-500/20'
              : 'bg-white/80 border border-blue-200'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Built with ❤️ by{' '}
              <span className={`text-transparent bg-gradient-to-r font-bold bg-clip-text ${
                isDarkMode 
                  ? 'from-blue-400 to-cyan-400' 
                  : 'from-blue-600 to-cyan-600'
              }`}>Mr Frank</span>
            </p>
            <div className="flex items-center justify-center gap-6 mt-3">
              <a
                href="https://github.com/mrfr8nk"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm flex items-center gap-2 group transition-colors ${
                  isDarkMode 
                    ? 'text-slate-500 hover:text-blue-400' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://mrfrankofc.gleeze.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm group transition-colors ${
                  isDarkMode 
                    ? 'text-slate-500 hover:text-blue-400' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <span className="group-hover:underline">Portfolio</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UptimeMonitor;
