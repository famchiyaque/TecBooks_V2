// base-sales-data-hook.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generatePastSalesData } from '../Calcs/dataGenerator';
import { 
  getPastTimelineDates, 
  getFutureTimelineDates, 
  } from '../Calcs/timelines';
import { DATA_PATTERNS } from '../configs/options-configs';
import { 
  setDetectedInterval,
  setEffectiveInterval,
  setPastTimelineDates,
  setFutureTimelineDates,
  setSalesDataBatch,
  setEffectivePastDate,
  setEffectiveFutureDate,
  setSalesData,
  setUploadedFileType
} from '../store';

export default function useBaseSalesData() {
  const dispatch = useDispatch();

  const startDate = useSelector((state) => state.forecaster.startDate);
  const behavior = useSelector((state) => state.forecaster.behavior);
  const behaviorCase = useSelector((state) => state.forecaster.behaviorCase);
  const salesDataBatch = useSelector((state) => state.forecaster.salesDataBatch);

  useEffect(() => {
    console.log("in sales data hook");
    if (!salesDataBatch) return;
    console.log("salesDataBatch was not null, so actually executing");
    
    // 1. Generate sales data
    if (startDate && behavior && behaviorCase) {
      const defaults = DATA_PATTERNS[behaviorCase]?.defaults || {};
      const { data, detectedInterval} = generatePastSalesData({
        startDate,
        defaults,
        behaviorCase
      });


      if (data) {
        dispatch(setSalesData(null));
        dispatch(setDetectedInterval(null));
        dispatch(setEffectiveInterval(null));
        dispatch(setEffectivePastDate(null));
        dispatch(setEffectiveFutureDate(null));
        dispatch(setUploadedFileType(null));

        dispatch(setSalesData(data));
        dispatch(setDetectedInterval(detectedInterval));
        dispatch(setEffectiveInterval(detectedInterval));

        const pastTimelineDates = getPastTimelineDates(startDate);
        if (pastTimelineDates) {
          dispatch(setPastTimelineDates(pastTimelineDates));
          dispatch(setEffectivePastDate(pastTimelineDates[0].date));
        }

        const futureTimelineDates = getFutureTimelineDates(pastTimelineDates);
        if (futureTimelineDates) {
          dispatch(setFutureTimelineDates(futureTimelineDates));
          dispatch(setEffectiveFutureDate(futureTimelineDates[futureTimelineDates.length - 1].date));
        }
      } else {
        console.warn("No result from generatePastSalesData");
      }
    } else {
      console.warn("startDate, behavior, or behaviorCase was null");
    }

    dispatch(setSalesDataBatch(null));

  }, [salesDataBatch, startDate, behavior, behaviorCase, dispatch]);
}
