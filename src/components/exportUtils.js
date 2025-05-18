import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (transactions, t) => {
  const doc = new jsPDF();
  doc.text(t('Transactions'), 10, 10);
  autoTable(doc, {
    startY: 20,
    head: [[t('Date'), t('Type'), t('Category'), t('Amount'), t('Description')]],
    body: transactions.map(tx => [
      new Date(tx.date).toLocaleString(),
      t(tx.type),
      tx.category,
      tx.amount,
      tx.description
    ]),
  });
  doc.save('transactions.pdf');
};

export const exportToExcel = (transactions, t) => {
    const headers = [t('date'), t('amount'), t('description'), t('category')];
    const allHeaders = [...headers, t('type')];
  
    const byType = (type) => transactions
      .filter(tr => tr.type === type)
      .map(tr => [
        tr.date.slice(0, 10),
        tr.amount,
        tr.description || '',
        tr.categoryName || ''
      ]);
  
    const allData = transactions.map(tr => [
      tr.date.slice(0, 10),
      tr.amount,
      tr.description || '',
      tr.categoryName || '',
      tr.type,
    ]);
  
    const wb = XLSX.utils.book_new();
  
    const sheetNames = {
      INCOME: t('income'),
      EXPENSE: t('expense'),
      INVESTMENTS: t('investment'),
      ALL: t('all_records') // або як у тебе локалізація
    };
  
    const addSheet = (data, headers, name) => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
  
    addSheet(byType('INCOME'), headers, sheetNames.INCOME);
    addSheet(byType('EXPENSE'), headers, sheetNames.EXPENSE);
    addSheet(byType('INVESTMENTS'), headers, sheetNames.INVESTMENTS);
    addSheet(allData, allHeaders, sheetNames.ALL);
  
    // Додаємо autofilter для аркушу "Всі записи"
    const allSheet = wb.Sheets[sheetNames.ALL];
    allSheet['!autofilter'] = { ref: `A1:E${allData.length + 1}` };
  
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions.xlsx');
  };
  