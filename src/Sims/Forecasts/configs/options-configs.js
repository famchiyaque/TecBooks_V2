export const MODEL_OPTIONS = [
  'Simple Linear Regression', 'Double Linear Regression',
  'Simple Moving Average', 'Double Moving Average', 'Simple Exponential Smoothing',
  'Double Exponential Smoothing', "Winter's"
]

export const INTERVAL_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
];

export const TIMELINE_OPTIONS = [
  '10 years', '5 years', '2 years', '1 year', '6 months', '3 months'
]

export const BEHAVIOR_OPTIONS = [
  { name: 'stable', options: ['steady', 'gradual growth', 'gradual decline'] },
  { name: 'seasonal', options: ['single peak', 'multiple peaks', 'seasonal + growth', 'seasonal + decline'] },
  { name: 'irregular', options: ['occasional spikes', 'sudden drop & recovery', 'boom-and-bust', 'random walk'] }
]

export const DATA_PATTERNS = {
    "steady": {
      defaults: {
        base: 200,
        trend: 0,
        amplitude: 10,
        frequency: 0,
        noise: 3,
        volatility: 0.02,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.02, 0.02],
        amplitude: [0, 20],
        frequency: [0, 1],
        noise: [0, 10],
        volatility: [0, 0.1],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "gradual growth": {
      defaults: {
        base: 150,
        trend: 0.05,
        amplitude: 15,
        frequency: 0,
        noise: 4,
        volatility: 0.03,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [0, 0.15],
        amplitude: [0, 30],
        frequency: [0, 1],
        noise: [0, 15],
        volatility: [0, 0.15],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "gradual decline": {
      defaults: {
        base: 300,
        trend: -0.04,
        amplitude: 15,
        frequency: 0,
        noise: 4,
        volatility: 0.03,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.15, 0],
        amplitude: [0, 30],
        frequency: [0, 1],
        noise: [0, 15],
        volatility: [0, 0.15],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "single peak": {
      defaults: {
        base: 180,
        trend: 0,
        amplitude: 60,
        frequency: 1,
        noise: 6,
        volatility: 0.05,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.05, 0.05],
        amplitude: [20, 100],
        frequency: [1, 1],
        noise: [0, 15],
        volatility: [0, 0.2],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "multiple peaks": {
      defaults: {
        base: 160,
        trend: 0,
        amplitude: 40,
        frequency: 4,
        noise: 6,
        volatility: 0.05,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.05, 0.05],
        amplitude: [10, 80],
        frequency: [2, 6],
        noise: [0, 15],
        volatility: [0, 0.2],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "seasonal + growth": {
      defaults: {
        base: 150,
        trend: 0.04,
        amplitude: 50,
        frequency: 1,
        noise: 5,
        volatility: 0.05,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [0, 0.15],
        amplitude: [20, 80],
        frequency: [1, 4],
        noise: [0, 15],
        volatility: [0, 0.2],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "seasonal + decline": {
      defaults: {
        base: 220,
        trend: -0.03,
        amplitude: 50,
        frequency: 1,
        noise: 5,
        volatility: 0.05,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.15, 0],
        amplitude: [20, 80],
        frequency: [1, 4],
        noise: [0, 15],
        volatility: [0, 0.2],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "occasional spikes": {
      defaults: {
        base: 200,
        trend: 0.01,
        amplitude: 20,
        frequency: 0,
        noise: 6,
        volatility: 0.05,
        eventChance: 0.005,
        spikeFactor: [1.5, 3]
      },
      ranges: {
        base: [50, 500],
        trend: [-0.05, 0.05],
        amplitude: [0, 50],
        frequency: [0, 1],
        noise: [0, 20],
        volatility: [0, 0.3],
        eventChance: [0, 0.02],
        spikeFactor: [1.1, 5]
      }
    },
  
    "sudden drop & recovery": {
      defaults: {
        base: 200,
        trend: 0,
        amplitude: 20,
        frequency: 0,
        noise: 5,
        volatility: 0.05,
        eventChance: 0.0005,
        spikeFactor: 0.3
      },
      ranges: {
        base: [50, 500],
        trend: [-0.05, 0.05],
        amplitude: [0, 40],
        frequency: [0, 1],
        noise: [0, 20],
        volatility: [0, 0.3],
        eventChance: [0, 0.005],
        spikeFactor: [0.1, 0.9]
      }
    },
  
    "boom-and-bust": {
      defaults: {
        base: 100,
        trend: { growth: 0.2, decline: -0.4 }, // special handling
        amplitude: 30,
        frequency: 0,
        noise: 8,
        volatility: 0.08,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: { growth: [0.05, 0.4], decline: [-0.8, -0.1] },
        amplitude: [0, 50],
        frequency: [0, 1],
        noise: [0, 20],
        volatility: [0, 0.3],
        eventChance: [0, 0.01],
        spikeFactor: [null, null]
      }
    },
  
    "random walk": {
      defaults: {
        base: 200,
        trend: 0,
        amplitude: 0,
        frequency: 0,
        noise: 10,
        volatility: 0.2,
        eventChance: 0,
        spikeFactor: null
      },
      ranges: {
        base: [50, 500],
        trend: [-0.1, 0.1],
        amplitude: [0, 10],
        frequency: [0, 1],
        noise: [5, 30],
        volatility: [0, 0.5],
        eventChance: [0, 0.02],
        spikeFactor: [null, null]
      }
    }
  };
  