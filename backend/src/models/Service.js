
import mongoose from 'mongoose';

const pingHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['online', 'offline'], required: true },
  responseTime: { type: Number, required: true },
  statusCode: Number,
  error: String
});

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  interval: {
    type: Number,
    required: true,
    default: 5,
    min: 1
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'pending'],
    default: 'pending'
  },
  lastPing: {
    type: Date
  },
  responseTime: {
    type: Number,
    default: 0
  },
  uptime: {
    type: Number,
    default: 0
  },
  totalPings: {
    type: Number,
    default: 0
  },
  nextPingAt: {
    type: Date
  },
  pingHistory: {
    type: [pingHistorySchema],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Keep only last 100 pings in history
serviceSchema.pre('save', function(next) {
  if (this.pingHistory.length > 100) {
    this.pingHistory = this.pingHistory.slice(-100);
  }
  next();
});

export default mongoose.model('Service', serviceSchema);


