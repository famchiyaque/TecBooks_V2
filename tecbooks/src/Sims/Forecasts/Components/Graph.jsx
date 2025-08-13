import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

function Graph() {
  const seriesData = useSelector((state) => state.forecaster.seriesData);
  console.log("series data in the graph component: ", seriesData);
  const pastDate = useSelector((state) => state.forecaster.effectivePastDate);
  const futureDate = useSelector((state) => state.forecaster.effectiveFutureDate);
  const interval = useSelector((state) => state.forecaster.effectiveInterval);

  // Helper to add intervals
  const addInterval = (date, interval) => {
    const newDate = new Date(date);
    switch (interval) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        throw new Error('Unsupported interval');
    }
    return newDate;
  };

  const formatLabel = (date, interval) => {
    const d = new Date(date);
    switch (interval) {
      case 'daily':
      case 'weekly':
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      case 'monthly':
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      case 'yearly':
        return d.getFullYear().toString();
      default:
        return d.toDateString();
    }
  };

  const getCategories = (past, future, interval) => {
    const categories = [];
    let current = new Date(past);
    const end = new Date(future);

    while (current <= end) {
      categories.push(formatLabel(current, interval));
      current = addInterval(current, interval);
    }

    return categories;
  };

  const options = useMemo(() => {
    if (!seriesData || !pastDate || !futureDate || !interval) return null; // guard
    console.log("inside useMemo")
  
    const categories = getCategories(pastDate, futureDate, interval);
    // console.log("categories returned: ", categories);
  
    return {
      chart: { type: 'line', borderRadius: 5 },
      title: { text: 'Sales Data' },
      xAxis: {
        title: { text: `From: ${formatLabel(pastDate, interval)} to ${formatLabel(futureDate, interval)}` },
        categories,
      },
      yAxis: { title: { text: 'Sales in Dollars' } },
      series: seriesData || [],
    };
  }, [seriesData, pastDate, futureDate, interval]);

  return (
    <div className='min-w-[600]'>
      <div style={{ maxHeight: '100%', width: '700px' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default Graph;
