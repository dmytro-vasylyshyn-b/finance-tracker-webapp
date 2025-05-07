// src/pages/IncomePage.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { Plus } from 'lucide-react';

const IncomePage = () => {
  const { t } = useTranslation(); 
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setTransactions([
      { id: 1, type: 'expense', category: 'groceries', amount: 500, date: '2025-05-07T14:00' },
      { id: 2, type: 'income', category: 'salary', amount: 3000, date: '2025-05-06T09:00' },
    ]);
  }, []);

  const handleAdd = () => {
    setEditTransaction(null);
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setShowModal(true);
  };

  const handleSave = (newTx) => {
    setTransactions((prev) => {
      const exists = prev.find((tx) => tx.id === newTx.id);
      return exists
        ? prev.map((tx) => (tx.id === newTx.id ? newTx : tx))
        : [...prev, { ...newTx, id: Date.now() }];
    });
    setShowModal(false);
  };

  return (
    <div className="p-3">
      <div className="mb-4">
        <Carousel>
          <Carousel.Item>
            <Card className="text-center p-4">
              <h4>{t('Expenses')}</h4>
              <p>₴{transactions.filter(tx => tx.type === 'expense').reduce((a, b) => a + b.amount, 0)}</p>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card className="text-center p-4">
              <h4>{t('Income')}</h4>
              <p>₴{transactions.filter(tx => tx.type === 'income').reduce((a, b) => a + b.amount, 0)}</p>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card className="text-center p-4">
              <h4>{t('Savings')}</h4>
              <p>₴{transactions.filter(tx => tx.type === 'investment').reduce((a, b) => a + b.amount, 0)}</p>
            </Card>
          </Carousel.Item>
        </Carousel>
      </div>

      <TransactionList transactions={transactions} onEdit={handleEdit} />

      <Button
        onClick={handleAdd}
        className="btn btn-primary position-fixed bottom-0 end-0 m-4 rounded-circle"
        style={{ width: '60px', height: '60px' }}
      >
        <Plus size={32} />
      </Button>

      <TransactionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        transaction={editTransaction}
      />
    </div>
  );
};

export default IncomePage;
