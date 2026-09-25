import workerApi from '@/utils/worker.util'
import { applyDerivedBase } from '@/sims/project-feasibility/model/applyDerivedBase'
import feasibilityProjectCurrencyChange from '@/sims/project-feasibility/utils/feasibilityProjectCurrencyChange';
import convertCurrency from '@/sims/project-feasibility/utils/currencyExchange';

export default async function getFeasibilityModel(gameId, currencyIn, currencyOut) {
  const { data } = await workerApi.get(`/api/feasibility/${gameId}`)
  if(currencyIn === currencyOut) {
    return applyDerivedBase(data);
  } else {
    console.log("CAMBIO DE MONEDA");
    const rate = await convertCurrency(currencyIn, currencyOut);
    console.log("TASA DE CAMBIO: ", rate);
    const dataCurrencyFixed = feasibilityProjectCurrencyChange(data, rate);
    return applyDerivedBase(dataCurrencyFixed);
  }
}
