// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const defaultCategories = {
  expense: ['Продукти', 'Комунальні послуги', 'Транспорт'],
  income: ['Зарплата', 'Фріланс'],
  investment: ['Депозит', 'Акції']
};

const TransactionModal = ({ show, handleClose, onSave, initialData }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 16),
    customCategory: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        date: new Date(initialData.date).toISOString().slice(0, 16),
        customCategory: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const category = form.category === 'custom' ? form.customCategory : form.category;
    onSave({ ...form, category });
    handleClose();
  };

  const categories = defaultCategories[form.type];

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? t('edit_transaction') : t('new_transaction')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{t('type')}</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">{t('expense')}</option>
              <option value="income">{t('income')}</option>
              <option value="investment">{t('investment')}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>{t('amount')}</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>{t('category')}</Form.Label>
            <Form.Select name="category" value={form.category} onChange={handleChange}>
              <option value="">{t('choose')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">{t('custom_category')}</option>
            </Form.Select>
          </Form.Group>

          {form.category === 'custom' && (
            <Form.Group className="mt-2">
              <Form.Label>{t('custom_category')}</Form.Label>
              <Form.Control
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Form.Group className="mt-2">
            <Form.Label>{t('date')}</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {t('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
