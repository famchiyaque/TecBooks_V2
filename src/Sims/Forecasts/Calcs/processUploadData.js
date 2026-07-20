// ./lib/uploadData.js
import { parseISO, parse, differenceInDays, format, isValid } from 'date-fns';

// import { INTERVAL_OPTIONS } from '../configs/options-configs';

const INTERVALS = ['daily', 'weekly', 'monthly', 'yearly'];

/**
 * Normalize uploaded sales data and detect its granularity.
 *
 * @param {Array} rawData - Array of objects with at least a date and sales field.
 *   Example: [{ date: '2024-01-01', sales: 120 }, ...]
 *   The keys can be any case or order.
 *
 * @returns {Object} - { normalizedData, detectedInterval, allowedIntervals }
 */
export function processUploadedData(rawData) {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('No data provided or data is not an array.');
  }

  // Normalize keys and values
  let normalizedData = rawData
    .map((item) => {
      // Find the date and sales keys (case-insensitive)
      const keys = Object.keys(item).reduce((acc, key) => {
        acc[key.toLowerCase()] = item[key];
        return acc;
      }, {});

      const rawDate = keys.date || keys['order_date'] || keys['timestamp'];
      const rawSales = keys.sales || keys['amount'] || keys['value'] || keys['revenue'];

      if (!rawDate || rawSales === undefined) {
        throw new Error('Each record must have a date and sales/amount/value/revenue field.');
      }

      let parsedDate;
      try {
        const dateStr = String(rawDate).trim();

        // Spanish abbreviated month: "ene-2023" or "ene-23"
        const ES_MONTHS = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
        const esMatch = dateStr.match(/^([a-z]{3})-(\d{2,4})$/i);
        if (esMatch && ES_MONTHS[esMatch[1].toLowerCase()] !== undefined) {
          const yr = esMatch[2].length === 2 ? 2000 + Number(esMatch[2]) : Number(esMatch[2]);
          parsedDate = new Date(yr, ES_MONTHS[esMatch[1].toLowerCase()], 1);
        }

        if (!parsedDate || !isValid(parsedDate)) {
          parsedDate = parseISO(dateStr);
        }
        if (!isValid(parsedDate)) {
          const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'M/d/yyyy', 'MM-dd-yyyy', 'MMM-yy', 'MMM-yyyy', 'MMM yyyy'];
          for (const fmt of formats) {
            parsedDate = parse(dateStr, fmt, new Date());
            if (isValid(parsedDate)) break;
          }
        }
        if (!isValid(parsedDate)) throw new Error();
      } catch {
        throw new Error(`Invalid date format: ${rawDate}`);
      }

      return {
        date: format(parsedDate, 'yyyy-MM-dd'),
        value: Number(rawSales),
      };
    })
    .filter((item) => !isNaN(item.value));

  // Sort by date
  normalizedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log("normalizedData: ", normalizedData);

  // Detect interval granularity
  const dayDiffs = [];
  for (let i = 1; i < normalizedData.length; i++) {
    const diff = differenceInDays(
      parseISO(normalizedData[i].date),
      parseISO(normalizedData[i - 1].date)
    );
    if (diff > 0) dayDiffs.push(diff);
  }

  if (dayDiffs.length === 0) {
    throw new Error('Not enough data points to detect interval.');
  }

  const modeDiff = mode(dayDiffs);
  let detectedInterval = 'daily';
  if (modeDiff >= 365) detectedInterval = 'yearly';
  else if (modeDiff >= 28) detectedInterval = 'monthly';
  else if (modeDiff >= 7) detectedInterval = 'weekly';

  // Limit allowed intervals
//   const startIndex = INTERVALS.indexOf(detectedInterval);
//   const allowedIntervals = INTERVALS.slice(startIndex);

  const startDate = new Date(normalizedData[0].date).toISOString();

  return {
    normalizedData,
    detectedInterval,
    startDate
    // allowedIntervals,
  };
}

/**
 * Find the mode (most frequent number) in an array.
 */
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
