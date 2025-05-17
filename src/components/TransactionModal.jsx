import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from '../api/axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



const TransactionModal = ({ show, onClose, onSuccess, transaction }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    type: 'EXPENSE',
    amount: '',
    categoryId: '',
    categoryName: '',
    date: new Date().toISOString().slice(0, 16),
  });
  const [categories, setCategories] = useState([]);
  const [isCustom, setIsCustom] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    if (show) {
      const type = transaction?.type || 'EXPENSE';
      loadCategories(type);
      loadAllTransactions();
    }
  }, [show]);

  const loadCategories = async (type) => {
    try {
      const res = await axios.get(`/api/categories?type=${type}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error('Помилка при завантаженні категорій:', err);
    }
  };

  const loadAllTransactions = async () => {
    try {
      const res = await axios.get('/api/expenses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAllTransactions(res.data || []);
    } catch (err) {
      console.error('Помилка при завантаженні транзакцій:', err);
    }
  };

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || '',
        categoryId: transaction.categoryId || '',
        categoryName: transaction.categoryName || '',
        date: new Date(transaction.date).toISOString().slice(0, 16),
      });
      setIsCustom(transaction.categoryName === 'custom');
    } else {
      setForm({
        type: 'EXPENSE',
        amount: '',
        description: '',
        categoryId: '',
        categoryName: '',
        date: new Date().toISOString().slice(0, 16),
      });
      setIsCustom(false);
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      loadCategories(value);
      setForm(f => ({ ...f, [name]: value, categoryId: '', categoryName: '' }));
      setIsCustom(false);
    } else if (name === 'categoryId' && value === 'custom') {
      setIsCustom(true);
      setForm(f => ({ ...f, categoryId: '', categoryName: '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      let categoryId = form.categoryId;
      let categoryName = form.categoryName;

      if (isCustom && categoryName) {
        const response = await axios.post(
          '/api/categories',
          {
            name: categoryName,
            type: form.type,
            custom: true,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        categoryId = response.data.id;
      }

      const payload = {
        type: form.type,
        amount: form.amount,
        description: form.description,
        date: form.date,
        categoryId: categoryId,
      };

      if (transaction) {
        await axios.put(`/api/expenses/${transaction.id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('/api/expenses', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Помилка при збереженні транзакції:', err);
      alert(t('error_saving_transaction'));
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Roboto');
  
    const tableData = allTransactions.map(tr => [
      tr.date.slice(0, 10),
      tr.amount,
      tr.description || '',
      tr.categoryName || '',
      tr.type,
    ]);
  
    autoTable(doc, {
      head: [[t('date'), t('amount'), t('description'), t('category'), t('type')]],
      body: tableData,
      styles: { font: 'Roboto' },
    });
  
    doc.save('transactions.pdf');
  };
  
  
  
  const exportExcel = () => {
    const headers = [t('date'), t('amount'), t('description'), t('category')];
    const allHeaders = [...headers, t('type')];

    const byType = (type) => allTransactions
      .filter(tr => tr.type === type)
      .map(tr => [tr.date.slice(0, 10), tr.amount, tr.description || '', tr.categoryName || '']);

    const allData = allTransactions.map(tr => [
      tr.date.slice(0, 10),
      tr.amount,
      tr.description || '',
      tr.categoryName || '',
      tr.type,
    ]);

    const wb = XLSX.utils.book_new();
    const sheetNames = {
      INCOME: 'доходи',
      EXPENSE: 'витрати',
      INVESTMENTS: 'інвестиції',
      ALL: 'всі записи'
    };

    const addSheet = (data, headers, name) => {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    addSheet(byType('INCOME'), headers, sheetNames.INCOME);
    addSheet(byType('EXPENSE'), headers, sheetNames.EXPENSE);
    addSheet(byType('INVESTMENTS'), headers, sheetNames.INVESTMENTS);
    addSheet(allData, allHeaders, sheetNames.ALL);

    // Застосовуємо фільтри (тільки на аркуші "всі записи")
    const allSheet = wb.Sheets[sheetNames.ALL];
    allSheet['!autofilter'] = { ref: `A1:E${allData.length + 1}` };

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transactions.xlsx');
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {transaction ? t('edit_transaction') : t('new_transaction')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{t('type')}</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="EXPENSE">{t('expense')}</option>
              <option value="INCOME">{t('income')}</option>
              <option value="INVESTMENTS">{t('investment')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>{t('amount')}</Form.Label>
            <Form.Control type="number" name="amount" value={form.amount} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>{t('category')}</Form.Label>
            <Form.Select name="categoryId" value={isCustom ? 'custom' : form.categoryId} onChange={handleChange}>
              <option value="">{t('choose')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="custom">{t('custom_category')}</option>
            </Form.Select>
          </Form.Group>

          {isCustom && (
            <Form.Group className="mt-2">
              <Form.Label>{t('custom_category')}</Form.Label>
              <Form.Control type="text" name="categoryName" value={form.categoryName} onChange={handleChange} />
            </Form.Group>
          )}
          <Form.Group className="mt-2">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>{t('date')}</Form.Label>
            <Form.Control type="datetime-local" name="date" value={form.date} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex flex-wrap justify-content-between">
        <div className="mb-2">
          <Button variant="success" onClick={exportPDF} className="me-2">{t('download_pdf')}</Button>
          <Button variant="info" onClick={exportExcel}>{t('download_excel')}</Button>
        </div>
        <div>
          <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
          <Button variant="primary" onClick={handleSubmit}>{t('save')}</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
