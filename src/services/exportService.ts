import * as XLSX from 'xlsx';

export type ExportValue = string | number | null | undefined;

const downloadBlob = (content: BlobPart, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const csvValue = (value: ExportValue) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const exportCsv = (filename: string, rows: ExportValue[][]) => {
  const csv = rows.map(row => row.map(csvValue).join(',')).join('\r\n');
  downloadBlob(`\uFEFF${csv}`, filename.endsWith('.csv') ? filename : `${filename}.csv`, 'text/csv;charset=utf-8');
};

export const exportXlsx = (filename: string, rows: ExportValue[][], sheetName = 'Rekap Tagihan') => {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
};
