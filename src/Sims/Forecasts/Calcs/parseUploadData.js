// function to parse upload data and make it take the form of a json array of objects with date/value fields
import * as XLSX from 'xlsx';
/**
 * takes in raw csv data or json data
 * 
 * @param {Unstructured Data} - [10-10-15, 20, 10-12-15, 30]
 * 
 * 
 * @returns {Array} - [{ date: '', sales: 1000 }]  (or amount, value)
 */

export function parseUploadedCSVData(text) {
    const lines = text.trim().split('\n');
    const result = lines.map(line => {
        const [date, value] = line.split(',');
        return {
            date: date.trim(),
            value: Number(value.trim())
        };
    });
    return result;
}

export function parseUploadedJSONData(text) {
    try {
        const parsed = JSON.parse(text); // converts string -> array of objects
        // Optionally, normalize keys to `date` / `value` if needed
        const normalized = parsed.map(item => ({
            date: item.date,
            value: item.revenue ?? item.sales ?? item.amount ?? 0
        }));
        return normalized;
    } catch (err) {
        console.error('Error parsing JSON upload:', err);
        return null;
    }
}

export function parseUploadedXLSXData(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    // Normalize keys:
    return jsonData.map(item => ({
        date: item.date,
        value: item.revenue ?? item.sales ?? item.amount ?? 0
    }));
}