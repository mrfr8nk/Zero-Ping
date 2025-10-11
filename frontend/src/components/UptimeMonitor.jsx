import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Activity, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const UptimeMonitor = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [pingInterval, setPingInterval] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
    const interval = setInterval(loadServices, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Failed to load services. Please check if the backend is running.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addService = async () => {
    if (!serviceName.trim() || !serviceUrl.trim()) {
      setError('Please enter both service name and URL');
      return;
    }

    if (!serviceUrl.startsWith('http://') && !serviceUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/services`, {
        name: serviceName,
        url: serviceUrl,
        interval: pingInterval
      });

      setServiceName('');
      setServiceUrl('');
      setError('');
      await loadServices();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add service');
    }
  };

  const deleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API_URL}/api/services/${id}`);
      await loadServices();
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      await axios.put(`${API_URL}/api/services/${service._id}`, {
        isActive: !service.isActive
      });
      await loadServices();
    } catch (err) {
      setError('Failed to update service status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const calculateUptime = (service) => {
    if (service.totalPings === 0) return '0%';
    return ((service.uptime / service.totalPings) * 100).toFixed(1) + '%';
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServices();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Zero Ping Monitor</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-purple-300">Keep your services alive with automated pinging</p>
        </div>

        {/* Add Service Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Service
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="url"
              placeholder="https://your-service.com"
              value={serviceUrl}
              onChange={(e) => setServiceUrl(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
            />
            <div className="flex gap-2">
              <select
                value={pingInterval}
                onChange={(e) => setPingInterval(Number(e.target.value))}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
              >
                <option value={1}>1 min</option>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
              </select>
              <button
                onClick={addService}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 gap-4">
          {services.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <Activity className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-white/70 text-lg">No services added yet. Add your first service above!</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all ${
                  service.isActive ? 'border-white/20 hover:border-purple-500/50' : 'border-gray-500/20 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(service.status)}
                      <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        service.status === 'online' 
                          ? 'bg-green-500/20 text-green-300' 
                          : service.status === 'offline'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {service.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => toggleServiceStatus(service)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive 
                            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                            : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                        }`}
                      >
                        {service.isActive ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>

                    <p className="text-purple-200 mb-3 break-all">{service.url}</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Ping Interval</div>
                        <div className="text-white font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.interval} min
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Response Time</div>
                        <div className="text-white font-semibold">
                          {service.responseTime}ms
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Uptime</div>
                        <div className="text-white font-semibold">
                          {calculateUptime(service)}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-xs mb-1">Total Pings</div>
                        <div className="text-white font-semibold">
                          {service.totalPings}
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

                  <button
                    onClick={() => deleteService(service._id)}
                    className="ml-4 p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {services.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Overall Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Total Services</div>
                <div className="text-3xl font-bold text-white">{services.length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Active Services</div>
                <div className="text-3xl font-bold text-blue-400">
                  {services.filter(s => s.isActive).length}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Online</div>
                <div className="text-3xl font-bold text-green-400">
                  {services.filter(s => s.status === 'online').length}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-1">Offline</div>
                <div className="text-3xl font-bold text-red-400">
                  {services.filter(s => s.status === 'offline').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UptimeMonitor;