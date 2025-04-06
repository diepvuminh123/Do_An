//models/Calculation.js
const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  inputs: {
    force: {
      type: Number,
      required: true
    },
    velocity: {
      type: Number,
      required: true
    },
    diameter: {
      type: Number,
      required: true
    },
    serviceYears: {
      type: Number,
      required: true
    },
    loadMode: {
      T1: Number,
      t1: Number,
      T2: Number,
      t2: Number
    },
    workingConditions: {
      rotationDirection: {
        type: String,
        enum: ['one-way', 'two-way'],
        default: 'one-way'
      },
      impactType: {
        type: String,
        enum: ['light', 'medium', 'heavy'],
        default: 'light'
      },
      shiftsPerDay: {
        type: Number,
        default: 2
      },
      daysPerYear: {
        type: Number,
        default: 300
      },
      hoursPerShift: {
        type: Number,
        default: 8
      }
    }
  },
  results: {
    requiredPower: Number,
    motorSpeed: Number,
    transmissionRatio: Number,
    shaftDimensions: [
      {
        name: String,
        diameter: Number,
        length: Number
      }
    ],
    selectedMotor: {
      model: String,
      power: Number,
      speed: Number
    },
    gearbox: {
      stageRatios: [Number],
      dimensions: mongoose.Schema.Types.Mixed
    },
    chain: {
      type: String,
      specifications: mongoose.Schema.Types.Mixed
    }
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calculation', CalculationSchema);