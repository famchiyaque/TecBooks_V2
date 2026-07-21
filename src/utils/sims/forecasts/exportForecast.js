import ExcelJS from 'exceljs';

function addInterval(date, interval) {
    const d = new Date(date);
    switch (interval) {
        case 'daily':   d.setDate(d.getDate() + 1); break;
        case 'weekly':  d.setDate(d.getDate() + 7); break;
        case 'monthly': d.setMonth(d.getMonth() + 1); break;
        case 'yearly':  d.setFullYear(d.getFullYear() + 1); break;
    }
    return d;
}

function formatLabel(date, interval) {
    const d = new Date(date);
    switch (interval) {
        case 'daily':
        case 'weekly':  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        case 'monthly': return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        case 'yearly':  return d.getFullYear().toString();
        default:        return d.toDateString();
    }
}

function getCategories(pastDate, futureDate, interval) {
    const categories = [];
    let current = new Date(pastDate);
    const end = new Date(futureDate);
    while (current <= end) {
        categories.push(formatLabel(current, interval));
        current = addInterval(current, interval);
    }
    return categories;
}

async function getChartImageBase64() {
    const container = document.getElementById('forecast-chart-container');
    if (!container) return null;

    const svgEl = container.querySelector('.highcharts-root');
    if (!svgEl) return null;

    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 700;
            canvas.height = img.naturalHeight || 400;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            const base64 = canvas.toDataURL('image/png').split(',')[1];
            resolve({ base64, width: canvas.width, height: canvas.height });
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
    });
}

export async function exportForecastToExcel(seriesData, pastDate, futureDate, interval) {
    if (!seriesData || !pastDate || !futureDate || !interval) return;

    const categories = getCategories(pastDate, futureDate, interval);

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Forecast');

    // Header row
    const headers = ['Date', ...seriesData.map(s => s.name)];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
        cell.border = { bottom: { style: 'thin' } };
    });

    // Data rows
    categories.forEach((label, i) => {
        const row = [label, ...seriesData.map(s => {
            const val = s.data[i];
            return (val !== null && val !== undefined) ? Number(val.toFixed(2)) : '';
        })];
        ws.addRow(row);
    });

    // Column widths
    ws.getColumn(1).width = 18;
    for (let c = 2; c <= headers.length; c++) ws.getColumn(c).width = 24;

    // Chart image
    const chartImg = await getChartImageBase64();
    if (chartImg) {
        const imageId = workbook.addImage({ base64: chartImg.base64, extension: 'png' });
        const dataRowCount = categories.length + 1;
        ws.addImage(imageId, {
            tl: { col: 0, row: dataRowCount + 1 },
            ext: { width: Math.min(chartImg.width, 700), height: Math.min(chartImg.height, 400) },
        });
        // Make room for image
        for (let r = dataRowCount + 2; r < dataRowCount + 25; r++) {
            ws.getRow(r).height = 20;
        }
    }

    // Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forecast_results.xlsx';
    a.click();
    URL.revokeObjectURL(url);
}
