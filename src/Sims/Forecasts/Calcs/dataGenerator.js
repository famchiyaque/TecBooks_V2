import { parseISO, differenceInDays, format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { DATA_PATTERNS } from '../configs/options-configs'; // adjust import

/**
 * Generate synthetic past sales data based on defaults for a given behavior case,
 * or based on manual parameters if provided.
 */
export function generatePastSalesData({ startDate, defaults, behaviorCase }) {
  console.log("-----INSIDE GENERATEPASTSALESDATA FUNC------");
  console.log("passed startDate: ", startDate);
  console.log("passed defaults: ", defaults);
  console.log("passed behaviorCase: ", behaviorCase);

  const thisDefaults = defaults ? defaults : DATA_PATTERNS[behaviorCase];

  if (!thisDefaults) throw new Error("No defaults passed and behaviorCase does not match to any"); 

  // const pattern = DATA_PATTERNS[patternName];
  // if (!pattern) throw new Error(`Unknown pattern: ${patternName}`);

  const start = new Date(startDate);
  const end = new Date();
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  // Determine interval
  let stepDays;
  if (totalDays <= 4 * 365) stepDays = 1; // daily
  else if (totalDays <= 10 * 365) stepDays = 7; // weekly
  else stepDays = 30; // monthly approx

  const {
    base,
    trend,
    amplitude,
    frequency,
    noise,
    volatility,
    eventChance,
    spikeFactor
  } = thisDefaults;

  const data = [];
  let currentValue = base;

  // For boom-and-bust special handling
  const isBoomBust = behaviorCase === 'boom-and-bust';
  const boomLength = isBoomBust ? Math.floor(totalDays / (2 * stepDays)) : 0;

  for (let day = 0; day <= totalDays; day += stepDays) {
    const date = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);

    // Seasonal component
    const season =
      amplitude *
      Math.sin((2 * Math.PI * frequency * day) / 365);

    // Trend handling
    let appliedTrend = trend;
    if (isBoomBust) {
      if (day / stepDays < boomLength) {
        appliedTrend = thisDefaults.trend.growth;
      } else {
        appliedTrend = thisDefaults.trend.decline;
      }
    }

    // Random noise
    const randomNoise = noise * (Math.random() - 0.5) * 2;

    // Volatility effect
    const volatilityEffect =
      currentValue * volatility * (Math.random() - 0.5) * 2;

    // Event spikes/drops
    let eventEffect = 0;
    if (eventChance > 0 && Math.random() < eventChance) {
      if (Array.isArray(spikeFactor)) {
        const min = spikeFactor[0] ?? 1;
        const max = spikeFactor[1] ?? 1;
        const factor = min + Math.random() * (max - min);
        eventEffect = currentValue * (factor - 1);
      } else if (typeof spikeFactor === 'number') {
        eventEffect = currentValue * (spikeFactor - 1);
      }
    }

    // Calculate value
    currentValue =
      currentValue * (1 + appliedTrend) +
      season +
      randomNoise +
      volatilityEffect +
      eventEffect;

    // Avoid NaN or negatives
    if (!Number.isFinite(currentValue)) currentValue = base;
    if (currentValue < 0) currentValue = 0;

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });
  }

  console.log("generated the date, now time to return it");
  const detectedInterval = detectInterval(data);

  return { 
    data,
    detectedInterval
  }
}


/**
 * Detects the data interval from date differences.
 */
function detectInterval(normalizedData) {
  const dayDiffs = [];
  for (let i = 1; i < normalizedData.length; i++) {
    const diff = differenceInDays(
      parseISO(normalizedData[i].date),
      parseISO(normalizedData[i - 1].date)
    );
    if (diff > 0) dayDiffs.push(diff);
  }

  if (dayDiffs.length === 0) return 'daily';

  const modeDiff = mode(dayDiffs);
  if (modeDiff >= 365) return 'yearly';
  if (modeDiff >= 28) return 'monthly';
  if (modeDiff >= 7) return 'weekly';
  return 'daily';
}

function mode(arr) {
  const frequency = {};
  let maxFreq = 0;
  let modeValue = arr[0];

  for (const num of arr) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      modeValue = num;
    }
  }
  return modeValue;
}
