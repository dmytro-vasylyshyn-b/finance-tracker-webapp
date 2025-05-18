import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Calc.css';
import { useTranslation } from 'react-i18next';

const FinancialCalculator = () => {
  const [pdfRef, setPdfRef] = useState(null);
  const [theme, setTheme] = useState('light');
  const { t } = useTranslation();

  const handlePrint = () => {
    if (pdfRef) {
      html2pdf().from(pdfRef).save();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div ref={setPdfRef} className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="text-center">{t('calculatorTitle')}</h1>
      </div>

      <SimpleInterest t={t} />
      <CompoundInterest t={t} />
      <LoanCalculator t={t} />
      <MortgageCalculator t={t} />
      <ROICalculator t={t} />
      <InflationCalculator t={t} />
      <CurrencyConverter t={t} />

      <div className="text-center mt-6">
        <button onClick={handlePrint} className="btn btn-primary">
          {t('savePdf')}
        </button>
      </div>
    </div>
  );
};

const SimpleInterest = ({ t }) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interest, setInterest] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const tVal = parseFloat(time);
    if (!isNaN(P) && !isNaN(r) && !isNaN(tVal)) {
      setInterest(P * r * tVal);
    }
  };

  return (
    <Section title={t('simpleInterest')}>
      <Input label={t('initialAmount')} value={principal} setValue={setPrincipal} />
      <Input label={t('annualRate')} value={rate} setValue={setRate} />
      <Input label={t('periodYears')} value={time} setValue={setTime} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {interest !== null && (
        <p>{t('roi')}: {interest.toFixed(2)}</p>
      )}
    </Section>
  );
};

const CompoundInterest = ({ t }) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundings, setCompoundings] = useState('1');
  const [amount, setAmount] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const tVal = parseFloat(time);
    const n = parseInt(compoundings);
    if (!isNaN(P) && !isNaN(r) && !isNaN(tVal) && !isNaN(n)) {
      const A = P * Math.pow(1 + r / n, n * tVal);
      setAmount(A);
    }
  };

  return (
    <Section title={t('compoundInterest')}>
      <Input label={t('initialAmount')} value={principal} setValue={setPrincipal} />
      <Input label={t('annualRate')} value={rate} setValue={setRate} />
      <Input label={t('periodYears')} value={time} setValue={setTime} />
      <Input label={t('compoundPerYear')} value={compoundings} setValue={setCompoundings} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {amount !== null && <p>{t('futureValue')}: {amount.toFixed(2)}</p>}
    </Section>
  );
};

const LoanCalculator = ({ t }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [payment, setPayment] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (!isNaN(P) && !isNaN(r) && !isNaN(n)) {
      const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
      setPayment(monthly);
    }
  };

  return (
    <Section title={t('loanCalculator')}>
      <Input label={t('loanAmount')} value={amount} setValue={setAmount} />
      <Input label={t('annualRate')} value={rate} setValue={setRate} />
      <Input label={t('termYears')} value={years} setValue={setYears} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {payment !== null && <p>{t('monthlyPayment')}: {payment.toFixed(2)}</p>}
    </Section>
  );
};

const MortgageCalculator = ({ t }) => {
  const [loan, setLoan] = useState('');
  const [down, setDown] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [monthly, setMonthly] = useState(null);
  const [overpay, setOverpay] = useState(null);

  const calculate = () => {
    const loanAmount = parseFloat(loan) - parseFloat(down);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (!isNaN(loanAmount) && !isNaN(r) && !isNaN(n)) {
      const m = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthly(m);
      setOverpay(m * n - loanAmount);
    }
  };

  return (
    <Section title={t('mortgageCalculator')}>
      <Input label={t('homePrice')} value={loan} setValue={setLoan} />
      <Input label={t('downPayment')} value={down} setValue={setDown} />
      <Input label={t('annualRate')} value={rate} setValue={setRate} />
      <Input label={t('termYears')} value={years} setValue={setYears} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {monthly !== null && (
        <>
          <p>{t('monthlyPayment')}: {monthly.toFixed(2)}</p>
          <p>{t('totalOverpay')}: {overpay.toFixed(2)}</p>
        </>
      )}
    </Section>
  );
};

const ROICalculator = ({ t }) => {
  const [initial, setInitial] = useState('');
  const [final, setFinal] = useState('');
  const [roi, setRoi] = useState(null);

  const calculate = () => {
    const i = parseFloat(initial);
    const f = parseFloat(final);
    if (!isNaN(i) && !isNaN(f) && i !== 0) {
      setRoi(((f - i) / i) * 100);
    }
  };

  return (
    <Section title={t('roiCalculator')}>
      <Input label={t('initialInvestment')} value={initial} setValue={setInitial} />
      <Input label={t('finalValue')} value={final} setValue={setFinal} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {roi !== null && <p>{t('roi')}: {roi.toFixed(2)}%</p>}
    </Section>
  );
};

const InflationCalculator = ({ t }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [future, setFuture] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const i = parseFloat(rate) / 100;
    const tVal = parseFloat(years);
    if (!isNaN(P) && !isNaN(i) && !isNaN(tVal)) {
      setFuture(P * Math.pow(1 + i, tVal));
    }
  };

  return (
    <Section title={t('inflationCalculator')}>
      <Input label={t('currentAmount')} value={amount} setValue={setAmount} />
      <Input label={t('inflation')} value={rate} setValue={setRate} />
      <Input label={t('periodYears')} value={years} setValue={setYears} />
      <Button onClick={calculate}>{t('calculate')}</Button>
      {future !== null && <p>{t('futureValue')}: {future.toFixed(2)}</p>}
    </Section>
  );
};

const CurrencyConverter = ({ t }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [converted, setConverted] = useState(null);

  const convert = () => {
    const A = parseFloat(amount);
    const R = parseFloat(rate);
    if (!isNaN(A) && !isNaN(R)) {
      setConverted(A * R);
    }
  };

  return (
    <Section title={t('currencyConverter')}>
      <Input label={t('amount')} value={amount} setValue={setAmount} />
      <Input label={t('exchangeRate')} value={rate} setValue={setRate} />
      <Button onClick={convert}>{t('convert')}</Button>
      {converted !== null && <p>{t('convertedAmount')}: {converted.toFixed(2)}</p>}
    </Section>
  );
};

const Section = ({ title, children }) => (
  <div className="border rounded p-4 shadow-md mb-4">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Input = ({ label, value, setValue }) => (
  <div>
    <label className="form-label">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="form-control"
    />
  </div>
);

const Button = ({ onClick, children }) => (
  <button onClick={onClick} className="btn btn-success">
    {children}
  </button>
);

export default FinancialCalculator;
