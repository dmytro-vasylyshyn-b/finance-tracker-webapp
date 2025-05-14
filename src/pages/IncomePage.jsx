import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

const IncomePage = () => {
  const { t } = useTranslation(); 
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type.toUpperCase());
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

      const res = await axios.get(`/api/expenses/filtered?page=0&size=10&sort=date,desc&${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTransactions(res.data.content || []);
    } catch (err) {
      console.error('Не вдалося завантажити транзакції', err);
      setTransactions([]);
    }
  };

  const handleAdd = () => {
    setEditTransaction(null);
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setShowModal(true);
  };

  const handleSave = async (newTx) => {
    try {
      const payload = {
        amount: newTx.amount,
        description: newTx.description,
        date: newTx.date,
        type: newTx.type,
        category: newTx.category === 'custom' ? newTx.customCategory : newTx.category,
      };

      const res = await axios.post('/api/expenses', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error('Помилка при додаванні транзакції:', error);
      alert('Не вдалося додати транзакцію.');
    }
  };

  return (
    <div className="p-3">
      <div className="mb-4" style={{ height: '20vh', maxHeight: '200px', position: 'relative' }}>
        <Carousel
          indicators={true}
          controls={true}
          interval={null}
          className="h-100"
          style={{ borderRadius: '1rem', overflow: 'hidden' }}
          nextIcon={<span className="carousel-control-next-icon" style={{ filter: 'invert(0.3)', opacity: 0.5 }} />}
          prevIcon={<span className="carousel-control-prev-icon" style={{ filter: 'invert(0.3)', opacity: 0.5 }} />}
        >
          <Carousel.Item className="h-100">
            <Card className="text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center bg-light dark:bg-dark text-dark dark:text-light shadow-sm border-0 rounded-4">
              <h4>{t('Expenses')}</h4>
              <p className="fs-4 text-danger">
                ₴{(transactions || []).filter(tx => tx.type === 'EXPENSE').reduce((a, b) => a + (b.amount || 0), 0)}
              </p>
            </Card>
          </Carousel.Item>
          <Carousel.Item className="h-100">
            <Card className="text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center bg-light dark:bg-dark text-dark dark:text-light shadow-sm border-0 rounded-4">
              <h4>{t('Income')}</h4>
              <p className="fs-4 text-success">
                ₴{(transactions || []).filter(tx => tx.type === 'INCOME').reduce((a, b) => a + (b.amount || 0), 0)}
              </p>
            </Card>
          </Carousel.Item>
          <Carousel.Item className="h-100">
            <Card className="text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center bg-light dark:bg-dark text-dark dark:text-light shadow-sm border-0 rounded-4"
                style={{
                  backgroundColor: '#e5f0ff', // блакитний
                  color: '#0066cc'
                }}
                >
              <h4>{t('Investments')}</h4>
              <p className="fs-4 text-primary">
                ₴{(transactions || []).filter(tx => tx.type === 'INVESTMENTS').reduce((a, b) => a + (b.amount || 0), 0)}
              </p>
            </Card>
          </Carousel.Item>
        </Carousel>
        <style>
          {`
            .carousel-indicators [data-bs-target] {
              background-color: rgba(0, 0, 0, 0.4);
            }
            .carousel-control-prev-icon,
            .carousel-control-next-icon {
              filter: invert(0.3);
              opacity: 0.5;
            }
          `}
        </style>
      </div>

      <div className="mb-3 d-flex flex-wrap gap-2">
        <select className="form-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">{t('All Types')}</option>
          <option value="expense">{t('Expenses')}</option>
          <option value="income">{t('Income')}</option>
          <option value="investments">{t('Investments')}</option>
        </select>
        <input type="date" className="form-control" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
        <input type="date" className="form-control" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
        <input type="number" className="form-control" placeholder={t('Min')} value={filters.minAmount} onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })} />
        <input type="number" className="form-control" placeholder={t('Max')} value={filters.maxAmount} onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })} />
      </div>

      <TransactionList transactions={transactions || []} onEdit={handleEdit} />

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
        onSuccess={fetchTransactions}
        transaction={editTransaction}
      />
    </div>
  );
};

export default IncomePage;
