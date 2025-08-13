import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import getSeriesData from '../Calcs/dataForecaster';
import { setSeriesData } from '../store';


export default function useSeriesData() {
    // let salesData = sessionStorage.getItem('salesData');
    // if (typeof salesData === 'string') {
    //     salesData = JSON.parse(salesData);
    // }
    const salesData = useSelector((state) => state.forecaster.salesData);
    const effectivePastDate = useSelector((state) => state.forecaster.effectivePastDate);
    const effectiveFutureDate = useSelector((state) => state.forecaster.effectiveFutureDate);
    const effectiveInterval  = useSelector((state) => state.forecaster.effectiveInterval);
    const activeMethods  = useSelector((state) => state.forecaster.activeMethods);
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log("In useSeriesData hook with salesData: ", salesData, " past date: ", effectivePastDate, " future date: ", effectiveFutureDate, " interval: ", effectiveInterval);
        if (!salesData || !effectivePastDate || !effectiveFutureDate || !effectiveInterval) return;
        dispatch(setSeriesData(null));
        // console.log("calling getSeriesData with: ", salesData);
        const seriesData = getSeriesData(salesData, effectivePastDate, effectiveFutureDate, effectiveInterval, activeMethods);
        if (seriesData) {
            dispatch(setSeriesData(seriesData));
        }
    }, [salesData, effectivePastDate, effectiveFutureDate, effectiveInterval, activeMethods])
}