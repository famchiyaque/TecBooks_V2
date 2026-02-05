# API Integration Guide for Excel Templates

## Quick Setup

Your Excel templates can now be dynamically generated with real-time data from government APIs!

## What Was Added

### 1. API Infrastructure (`src/modules/excel-templates/api/`)

```
api/
├── templateGenerator.js              # Generates templates with real-time data
├── dataFetchers/
│   ├── mexicoDataFetcher.js         # Fetches Mexico financial data
│   └── index.js
└── index.js
```

### 2. Dynamic Template Generation

When users click "Download Template", the system:
1. Loads your base Excel template
2. Fetches real-time data (inflation, PTU, minimum wage)
3. Updates specific cells with fresh data
4. Adds a metadata sheet with data sources
5. Downloads the updated template

### 3. Mexico Data Fetcher

Currently fetches (with mock data, ready for real APIs):
- **Inflation Rate** (INEGI)
- **PTU Rate** (SAT)
- **Minimum Wage** (CONASAMI)
- **Exchange Rate** (Banco de México)
- **ISR Tax Brackets**
- **IVA Rate**

## How to Use

### Step 1: Place Your Base Template

Put your Excel template here:
```
TecBooks_V2/public/templates/manufacturing-mexico-template.xlsx
```

### Step 2: Define Which Cells to Update

In `templateGenerator.js`, specify which cells should be updated with real-time data:

```javascript
// Update Overview sheet with real-time data
const overviewSheet = workbook.Sheets['Overview'];

// Cell H2 = Inflation Rate
updateCell(overviewSheet, 'H2', financialData.inflationRate);

// Cell H3 = PTU Rate  
updateCell(overviewSheet, 'H3', financialData.ptuRate);

// Cell H4 = Minimum Wage
updateCell(overviewSheet, 'H4', financialData.minimumWage);
```

### Step 3: Implement Real API Calls

Replace mock data with real API calls in `mexicoDataFetcher.js`:

#### Example: INEGI Inflation Rate

```javascript
async function fetchInflationRate() {
  try {
    const response = await fetch(
      `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/es/LATEST/N/BDIE/2.0/${import.meta.env.VITE_INEGI_API_KEY}`
    );
    const data = await response.json();
    return parseFloat(data.Series[0].OBSERVATIONS[0].OBS_VALUE);
  } catch (error) {
    console.error('Error fetching inflation:', error);
    return 4.5; // Fallback
  }
}
```

#### Example: Banco de México Exchange Rate

```javascript
async function fetchExchangeRate() {
  try {
    const response = await fetch(
      `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno`,
      {
        headers: {
          'Bmx-Token': import.meta.env.VITE_BANXICO_API_KEY
        }
      }
    );
    const data = await response.json();
    return parseFloat(data.bmx.series[0].datos[0].dato);
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 17.0; // Fallback
  }
}
```

### Step 4: Add Environment Variables

Create `.env` file:
```
VITE_INEGI_API_KEY=your_inegi_key_here
VITE_BANXICO_API_KEY=your_banxico_key_here
```

## API Keys & Registration

### INEGI (Inflation, Economic Indicators)
- **Website**: https://www.inegi.org.mx/servicios/api_indicadores.html
- **Registration**: Free, requires email verification
- **Rate Limits**: Check their documentation
- **Documentation**: https://www.inegi.org.mx/servicios/api_indicadores.html

### Banco de México (Exchange Rates)
- **Website**: https://www.banxico.org.mx/SieAPIRest/
- **Registration**: Free, requires email
- **Rate Limits**: Check their documentation
- **Documentation**: https://www.banxico.org.mx/SieAPIRest/service/v1/doc/

### CONASAMI (Minimum Wage)
- **Website**: https://www.gob.mx/conasami
- **Note**: Usually published as announcements, not real-time API
- **Alternative**: Scrape from official government portal or update manually

### SAT (Tax Information)
- **Website**: https://www.sat.gob.mx/
- **Note**: Tax rates are published annually, not real-time
- **Alternative**: Update manually each tax year

## Template Cell Mapping

Document which cells in your Excel template should be updated:

| Cell | Data | Source | Update Frequency |
|------|------|--------|------------------|
| H2 | Inflation Rate | INEGI | Daily |
| H3 | PTU Rate | SAT | Annually |
| H4 | Minimum Wage | CONASAMI | Annually |
| H5 | USD/MXN Rate | Banxico | Daily |
| H6 | IVA Rate | SAT | Rarely |
| H7 | Last Updated | System | On generation |

## Caching Strategy

Data is cached for 24 hours to reduce API calls:

```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

To adjust cache duration:
```javascript
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
```

To disable caching (not recommended):
```javascript
// In mexicoDataFetcher.js, use fetchMexicoFinancialData() instead of fetchMexicoFinancialDataCached()
```

## Testing

### Test Without Real APIs

The current implementation uses mock data, so you can test immediately:

```bash
npm run dev
# Navigate to /templates
# Click "Download Template" on Manufacturing Mexico
# Template should download with mock data
```

### Test With Real APIs

1. Get API keys
2. Add to `.env`
3. Update fetcher functions with real API calls
4. Test download
5. Open Excel and verify cells are updated

### Verify Data in Template

After downloading:
1. Open the Excel file
2. Check cell H2 for inflation rate
3. Check cell H3 for PTU rate
4. Check the "Metadata" sheet for data sources and timestamp

## Error Handling

The system has multiple fallback layers:

1. **Try real-time API** → Success? Use fresh data
2. **API fails** → Use cached data (if available)
3. **No cache** → Use fallback values
4. **All fails** → Download static template

```javascript
try {
  const data = await fetchMexicoFinancialData();
  updateTemplate(data);
} catch (error) {
  console.error('Error:', error);
  // Fallback to static template
  return await loadStaticTemplate();
}
```

## Adding More Countries

### Example: USA Template

1. **Create data fetcher**:
```javascript
// src/modules/excel-templates/api/dataFetchers/usaDataFetcher.js
export async function fetchUSAFinancialData() {
  const inflationRate = await fetchUSInflation(); // BLS API
  const federalRate = await fetchFedRate(); // Federal Reserve API
  return { inflationRate, federalRate };
}
```

2. **Create template generator**:
```javascript
// In templateGenerator.js
export async function generateManufacturingUSATemplate() {
  const workbook = await loadBaseTemplate('/templates/manufacturing-usa-template.xlsx');
  const data = await fetchUSAFinancialData();
  updateCell(workbook.Sheets['Overview'], 'A1', data.inflationRate);
  return convertToBlob(workbook);
}
```

3. **Add to switch**:
```javascript
case 'manufacturing-usa':
  return await generateManufacturingUSATemplate();
```

## Monitoring & Analytics

Consider adding:

```javascript
// Track template downloads
analytics.track('template_downloaded', {
  templateId: template.id,
  timestamp: new Date(),
  dataSource: 'real-time', // or 'cached' or 'static'
});

// Track API failures
analytics.track('api_fetch_failed', {
  source: 'INEGI',
  error: error.message,
});
```

## Best Practices

1. **Always have fallback values** - Don't let API failures break downloads
2. **Cache aggressively** - Reduce API calls and improve performance
3. **Document cell mappings** - Keep track of which cells contain what data
4. **Version your templates** - Include version in metadata sheet
5. **Test with real data** - Verify calculations work with actual API responses
6. **Monitor API limits** - Track usage to avoid hitting rate limits
7. **Handle timezones** - Be aware of timezone differences in data

## Troubleshooting

### Template downloads but cells aren't updated
- Check cell addresses (A1, B2, etc.)
- Verify sheet names match exactly
- Check browser console for errors

### API calls failing
- Verify API keys in `.env`
- Check API rate limits
- Test API endpoints directly (Postman/curl)
- Check CORS settings

### Downloaded file is corrupted
- Verify XLSX library version
- Check workbook structure before conversion
- Test with simpler template first

## Next Steps

1. ✅ API infrastructure created
2. ✅ Mock data working
3. ⏳ Get API keys from INEGI, Banxico
4. ⏳ Implement real API calls
5. ⏳ Test with production data
6. ⏳ Add more countries (USA, Colombia)
7. ⏳ Add template versioning
8. ⏳ Add analytics

## Questions?

- See `src/modules/excel-templates/api/README.md` for detailed API documentation
- See `ARCHITECTURE.md` for overall system architecture
- Check browser console for detailed error messages
