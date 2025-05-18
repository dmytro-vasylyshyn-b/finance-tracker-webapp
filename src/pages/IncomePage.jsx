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
import { exportToPDF, exportToExcel } from '../components/exportUtils';
import './css/IncomePage/income.css';

const IncomePage = () => {
  const { t, i18n } = useTranslation(); 
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
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [showAll, setShowAll] = useState(false);

  // Визначаємо, чи темна тема — припускаємо, що тема зберігається в localStorage або через клас body
  // Тут приклад з localStorage (налаштуй під свій проект)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    setPage(0);
  }, [filters, showAll]);

  useEffect(() => {
    fetchTransactions();
  }, [filters, page, showAll]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type.toUpperCase());
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

      const size = showAll ? 1000 : pageSize;

      const res = await axios.get(
        `/api/expenses/filtered?page=${page}&size=${size}&sort=date,desc&${params.toString()}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (page === 0) {
        setTransactions(res.data.content || []);
      } else {
        setTransactions(prev => [...prev, ...(res.data.content || [])]);
      }
    } catch (err) {
      console.error('Не вдалося завантажити транзакції', err);
      if (page === 0) setTransactions([]);
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

      await axios.post('/api/expenses', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setPage(0);
      fetchTransactions();
      setShowModal(false);
    } catch (error) {
      console.error('Помилка при додаванні транзакції:', error);
      alert('Не вдалося додати транзакцію.');
    }
  };

  const cardClassName = "text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center bg-dark text-light shadow-sm border-0 rounded-4";

  const investmentsCardStyle = {
    backgroundColor: '#003366',
    color: '#aad4ff',
  };

  const carouselContainerStyle = {
    borderRadius: '1rem',
    overflow: 'hidden',
    height: '100%',
    backgroundColor: isDarkTheme ? '#111111' : '#ffffff'
  };

  return (
    <div className="p-3">
      <div className="mb-4" style={{ height: '20vh', maxHeight: '200px', position: 'relative' }}>
        <Carousel
          indicators={true}
          controls={true}
          interval={null}
          className="h-100"
          style={carouselContainerStyle}
          nextIcon={<span className="carousel-control-next-icon" style={{ filter: 'invert(0.3)', opacity: 0.5 }} />}
          prevIcon={<span className="carousel-control-prev-icon" style={{ filter: 'invert(0.3)', opacity: 0.5 }} />}
        >
          <Carousel.Item className="h-100">
            <Card className={cardClassName}>
              <h4 className="text-dark">{t('expense')}</h4>
              <p className="fs-4 text-danger">
                ₴{(transactions || []).filter(tx => tx.type === 'EXPENSE').reduce((a, b) => a + (b.amount || 0), 0)}
              </p>
            </Card>
          </Carousel.Item>
          <Carousel.Item className="h-100">
            <Card className={cardClassName}>
              <h4 className="text-dark">{t('income')}</h4>
              <p className="fs-4 text-success">
                ₴{(transactions || []).filter(tx => tx.type === 'INCOME').reduce((a, b) => a + (b.amount || 0), 0)}
              </p>
            </Card>
          </Carousel.Item>
          <Carousel.Item className="h-100">
            <Card className={cardClassName} style={investmentsCardStyle}>
              <h4 className="text-dark">{t('investment')}</h4>
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

      <div className="mb-3 d-flex gap-2 align-items-center">
        <button 
          className="btn btn-outline-primary"
          onClick={() => {
            setPage(prev => prev + 1);
          }}
          disabled={showAll}
        >
          {t('load_more')}
        </button>

        <div className="form-check ms-3">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="showAll" 
            checked={showAll} 
            onChange={(e) => {
              setShowAll(e.target.checked);
              setPage(0);
            }}
          />
          <label className="form-check-label" htmlFor="showAll">
            {t('show_all')}
          </label>
        </div>
      </div>

      <Button
        onClick={handleAdd}
        className="btn btn-primary position-fixed bottom-0 end-0 m-4 p-0 d-flex justify-content-center align-items-center"
        style={{ width: '60px', height: '60px', borderRadius: '50%' }}
      >
        <Plus size={32} />
      </Button>

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-outline-danger" onClick={() => exportToPDF(transactions, t)}>
          {t('download_pdf')}
        </button>
        <button className="btn btn-outline-success" onClick={() => exportToExcel(transactions, t)}>
          {t('download_excel')}
        </button>
      </div>

      <TransactionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setPage(0);
          fetchTransactions();
        }}
        transaction={editTransaction}
      />
    </div>
  );
};

export default IncomePage;
