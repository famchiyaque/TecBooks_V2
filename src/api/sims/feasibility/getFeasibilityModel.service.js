import workerApi from '@/utils/worker.util'
import { applyDerivedBase } from '@/sims/project-feasibility/model/applyDerivedBase'
import feasibilityProjectCurrencyChange from '@/sims/project-feasibility/utils/feasibilityProjectCurrencyChange';
import convertCurrency from '@/sims/project-feasibility/utils/currencyExchange';

export default async function getFeasibilityModel(gameId, currencyIn, currencyOut) {
  const { data } = await workerApi.get(`/api/feasibility/${gameId}`)
  if(currencyIn === currencyOut) {
    console.log("DATOS DESPUÉS DEL applyDerivedBase(data): ", applyDerivedBase(data));
    return applyDerivedBase(data);
  } else {
    const rate = await convertCurrency(currencyIn, currencyOut);
    const dataCurrencyFixed = feasibilityProjectCurrencyChange(data, rate);
    return applyDerivedBase(dataCurrencyFixed);
  }
}
