
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Activity, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    loadServices();
    const interval = setInterval(loadServices, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const formatUptime = (uptime) => {
    if (!uptime && uptime !== 0) return 'N/A';
    return `${uptime.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Zero Ping Uptime Monitor</h1>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Add New Service</h2>
          <form onSubmit={handleAddService} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Service Name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Service URL"
                value={newService.url}
                onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex gap-2">
                <select
                  value={newService.pingInterval}
                  onChange={(e) => setNewService({ ...newService, pingInterval: parseInt(e.target.value) })}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <Activity className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No services yet. Add one to get started!</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'online'
                        ? 'bg-green-500/20 text-green-300'
                        : service.status === 'offline'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {service.status || 'Pending'}
                    </span>
                    <button
                      onClick={() => toggleServiceStatus(service)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.isActive
                          ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                          : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className="text-white/70 text-sm truncate">{service.url}</p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs mb-1">Response Time</div>
                      <div className="text-white font-semibold text-xs">
                        {service.responseTime ? `${service.responseTime}ms` : 'N/A'}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs mb-1">Uptime</div>
                      <div className="text-white font-semibold text-xs">
                        {formatUptime(service.uptime)}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs mb-1">Ping Interval</div>
                      <div className="text-white font-semibold text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.pingInterval} min
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs mb-1">Last Ping</div>
                      <div className="text-white font-semibold text-xs">
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
      </div>
    </div>
  );
};

export default UptimeMonitor;
