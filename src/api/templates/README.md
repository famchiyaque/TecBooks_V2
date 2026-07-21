# Excel Template API

This directory contains the infrastructure for dynamically generating Excel templates with real-time data.

## Architecture

```
api/
├── templateGenerator.js       # Main template generation logic
├── dataFetchers/              # Country-specific data fetchers
│   ├── mexicoDataFetcher.js   # Mexico financial data (INEGI, SAT, CONASAMI)
│   ├── usaDataFetcher.js      # USA financial data (coming soon)
│   └── index.js               # Exports all data fetchers
└── index.js                   # Main exports
```

## How It Works

### 1. Template Generation Flow

```javascript
User clicks "Download Template"
    ↓
generateTemplate(templateId) called
    ↓
Load base template from /public/templates/
    ↓
Fetch real-time data (inflation, PTU, minimum wage, etc.)
    ↓
Update specific cells in the template
    ↓
Add metadata sheet with data sources
    ↓
Convert to Blob and trigger download
```

### 2. Data Fetching

Each country has its own data fetcher module that retrieves:
- **Inflation rates** (e.g., INEGI for Mexico)
- **Tax rates** (e.g., SAT for Mexico)
- **Minimum wage** (e.g., CONASAMI for Mexico)
- **Exchange rates** (e.g., Banco de México)
- **Other country-specific data**

Data is cached for 24 hours to reduce API calls.

## Usage

### In TemplateSelector Component

```javascript
import { generateTemplate, downloadBlob } from './api/templateGenerator'

const handleDownload = async (template) => {
  const blob = await generateTemplate(template.id)
  downloadBlob(blob, `${template.id}-${Date.now()}.xlsx`)
}
```

### Adding a New Template

1. **Create base template** in `public/templates/your-template.xlsx`

2. **Add generator function** in `templateGenerator.js`:

```javascript
export async function generateYourTemplate() {
  const workbook = await loadBaseTemplate('/templates/your-template.xlsx')
  const data = await fetchYourCountryData()
  
  // Update cells
  const sheet = workbook.Sheets['Overview']
  updateCell(sheet, 'A1', data.someValue)
  
  return convertToBlob(workbook)
}
```

3. **Add to switch statement**:

```javascript
case 'your-template-id':
  return await generateYourTemplate()
```

### Adding a New Country Data Fetcher

1. **Create fetcher file** `dataFetchers/yourCountryDataFetcher.js`:

```javascript
export async function fetchYourCountryFinancialData() {
  const inflationRate = await fetchInflationRate()
  const taxRate = await fetchTaxRate()
  // ... more data
  
  return {
    inflationRate,
    taxRate,
    fetchedAt: new Date().toISOString(),
  }
}
```

2. **Export from index**:

```javascript
export { fetchYourCountryFinancialData } from './yourCountryDataFetcher.js'
```

3. **Use in template generator**:

```javascript
import { fetchYourCountryFinancialData } from './dataFetchers'
const data = await fetchYourCountryFinancialData()
```

## Mexico Data Sources

### Current Implementation

The Mexico data fetcher currently uses **mock data** with fallback values. To implement real API calls:

#### INEGI (Inflation Rate)
```javascript
// API Documentation: https://www.inegi.org.mx/servicios/api_indicadores.html
const response = await fetch(
  'https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/LOCALE/LATEST/N/BDIE/2.0/TOKEN'
)
```

#### SAT (PTU Rate)
PTU rate is typically set by law and doesn't change frequently. Can be hardcoded or fetched from government announcements.

#### CONASAMI (Minimum Wage)
```javascript
// Check official CONASAMI website or government data portal
// https://www.gob.mx/conasami
```

#### Banco de México (Exchange Rate)
```javascript
// API Documentation: https://www.banxico.org.mx/SieAPIRest/service/v1/doc/
const response = await fetch(
  'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=YOUR_TOKEN'
)
```

### Getting API Keys

1. **INEGI**: Register at https://www.inegi.org.mx/servicios/api_indicadores.html
2. **Banco de México**: Register at https://www.banxico.org.mx/SieAPIRest/

Store API keys in environment variables:
```
VITE_INEGI_API_KEY=your_key_here
VITE_BANXICO_API_KEY=your_key_here
```

## Cell Addressing

Excel cells are addressed using standard notation:
- `A1` - Column A, Row 1
- `B5` - Column B, Row 5
- `AA10` - Column AA, Row 10

Example:
```javascript
updateCell(worksheet, 'H2', financialData.inflationRate)
updateCell(worksheet, 'H3', financialData.ptuRate)
```

## Caching

Data is cached for 24 hours to reduce API calls:

```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
let cachedData = null
let cacheTimestamp = null
```

To clear cache:
```javascript
cachedData = null
cacheTimestamp = null
```

## Error Handling

If real-time data fetching fails, the system falls back to:
1. Cached data (if available)
2. Static template without updates
3. Default fallback values

```javascript
try {
  const data = await fetchRealTimeData()
  updateTemplate(data)
} catch (error) {
  console.error('Error fetching data:', error)
  // Fallback to static template
  return await loadStaticTemplate()
}
```

## Testing

### Test Template Generation
```javascript
import { generateManufacturingMexicoTemplate } from './templateGenerator'

const blob = await generateManufacturingMexicoTemplate()
console.log('Template size:', blob.size, 'bytes')
```

### Test Data Fetching
```javascript
import { fetchMexicoFinancialData } from './dataFetchers/mexicoDataFetcher'

const data = await fetchMexicoFinancialData()
console.log('Inflation rate:', data.inflationRate)
console.log('PTU rate:', data.ptuRate)
```

## Future Enhancements

- [ ] Implement actual API calls to INEGI, SAT, CONASAMI
- [ ] Add more countries (USA, Colombia, Argentina)
- [ ] Add template versioning
- [ ] Add template preview before download
- [ ] Add custom data input before generation
- [ ] Add scheduled updates for cached data
- [ ] Add analytics on template downloads
- [ ] Add A/B testing for different template formats

## Notes

- Templates are generated on-the-fly, not stored on the server
- Each download gets fresh data (subject to cache)
- Metadata sheet is automatically added to track data sources
- File naming includes timestamp for version tracking
