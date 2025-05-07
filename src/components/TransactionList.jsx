// src/components/TransactionList.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card } from 'react-bootstrap';

const TransactionList = ({ transactions, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-3">
      {transactions.length === 0 ? (
        <p className="text-center">{t('no_transactions')}</p>
      ) : (
        transactions.map((tx) => (
          <Card
            key={tx.id}
            className="mb-2 shadow-sm"
            bg={tx.type === 'expense' ? 'danger' : tx.type === 'income' ? 'success' : 'info'}
            text="white"
            onClick={() => onEdit(tx)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>{tx.category}</Card.Title>
                <Card.Subtitle className="text-white-50">{new Date(tx.date).toLocaleString()}</Card.Subtitle>
              </div>
              <h5>
                {tx.type === 'expense' ? '-' : '+'}
                {tx.amount} ₴
              </h5>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default TransactionList;
