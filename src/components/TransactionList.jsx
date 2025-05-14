// src/components/TransactionList.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './css/TransactionList.css';

const TransactionList = ({ transactions, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="transaction-list">
      {transactions.length === 0 ? (
        <p className="text-center w-100">{t('no_transactions')}</p>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            className={`tx-card ${tx.type.toLowerCase()}`}
            onClick={() => onEdit(tx)}
          >
            <div className="tx-header">
              <span>{tx.category}</span>
              <span>
                {tx.type === 'EXPENSE' ? '-' : '+'}
                {tx.amount} ₴
              </span>
            </div>
            <div className="tx-footer">
              <span>{tx.description}</span>
              <span className="tx-date">
                {new Date(tx.date).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;
