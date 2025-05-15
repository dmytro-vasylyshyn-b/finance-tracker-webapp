import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

const FinancialCalculator = () => {
  const [pdfRef, setPdfRef] = useState(null);

  const handlePrint = () => {
    if (pdfRef) {
      html2pdf().from(pdfRef).save();
    }
  };

  return (
    <div ref={setPdfRef} className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Фінансовий калькулятор</h1>

      <SimpleInterest />
      <CompoundInterest />
      <LoanCalculator />
      <MortgageCalculator />
      <ROICalculator />
      <InflationCalculator />
      <CurrencyConverter />

      <div className="text-center mt-6">
        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded">
          Зберегти у PDF
        </button>
      </div>
    </div>
  );
};

// --- Компоненти розрахунків ---

const SimpleInterest = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [interest, setInterest] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    if (!isNaN(P) && !isNaN(r) && !isNaN(t)) {
      setInterest(P * r * t);
    }
  };

  return (
    <Section title="Прості відсотки">
      <Input label="Початкова сума" value={principal} setValue={setPrincipal} />
      <Input label="Річна ставка (%)" value={rate} setValue={setRate} />
      <Input label="Період (роки)" value={time} setValue={setTime} />
      <Button onClick={calculate}>Розрахувати</Button>
      {interest !== null && (
        <p>Нараховані відсотки: {interest.toFixed(2)}</p>
      )}
    </Section>
  );
};

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundings, setCompoundings] = useState('1');
  const [amount, setAmount] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseInt(compoundings);
    if (!isNaN(P) && !isNaN(r) && !isNaN(t) && !isNaN(n)) {
      const A = P * Math.pow(1 + r / n, n * t);
      setAmount(A);
    }
  };

  return (
    <Section title="Складні відсотки">
      <Input label="Початкова сума" value={principal} setValue={setPrincipal} />
      <Input label="Річна ставка (%)" value={rate} setValue={setRate} />
      <Input label="Період (роки)" value={time} setValue={setTime} />
      <Input label="Нарахувань на рік" value={compoundings} setValue={setCompoundings} />
      <Button onClick={calculate}>Розрахувати</Button>
      {amount !== null && <p>Накопичена сума: {amount.toFixed(2)}</p>}
    </Section>
  );
};

const LoanCalculator = () => {
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
    <Section title="Кредитний калькулятор">
      <Input label="Сума кредиту" value={amount} setValue={setAmount} />
      <Input label="Річна ставка (%)" value={rate} setValue={setRate} />
      <Input label="Термін (роки)" value={years} setValue={setYears} />
      <Button onClick={calculate}>Розрахувати</Button>
      {payment !== null && <p>Щомісячний платіж: {payment.toFixed(2)}</p>}
    </Section>
  );
};

const MortgageCalculator = () => {
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
    <Section title="Іпотечний калькулятор">
      <Input label="Ціна житла" value={loan} setValue={setLoan} />
      <Input label="Початковий внесок" value={down} setValue={setDown} />
      <Input label="Річна ставка (%)" value={rate} setValue={setRate} />
      <Input label="Термін (роки)" value={years} setValue={setYears} />
      <Button onClick={calculate}>Розрахувати</Button>
      {monthly !== null && (
        <>
          <p>Щомісячний платіж: {monthly.toFixed(2)}</p>
          <p>Загальна переплата: {overpay.toFixed(2)}</p>
        </>
      )}
    </Section>
  );
};

const ROICalculator = () => {
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
    <Section title="ROI калькулятор">
      <Input label="Початкова інвестиція" value={initial} setValue={setInitial} />
      <Input label="Кінцева вартість" value={final} setValue={setFinal} />
      <Button onClick={calculate}>Розрахувати</Button>
      {roi !== null && <p>ROI: {roi.toFixed(2)}%</p>}
    </Section>
  );
};

const InflationCalculator = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [future, setFuture] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const i = parseFloat(rate) / 100;
    const t = parseFloat(years);
    if (!isNaN(P) && !isNaN(i) && !isNaN(t)) {
      setFuture(P * Math.pow(1 + i, t));
    }
  };

  return (
    <Section title="Калькулятор інфляції">
      <Input label="Сума зараз" value={amount} setValue={setAmount} />
      <Input label="Річна інфляція (%)" value={rate} setValue={setRate} />
      <Input label="Період (роки)" value={years} setValue={setYears} />
      <Button onClick={calculate}>Розрахувати</Button>
      {future !== null && <p>Майбутня вартість: {future.toFixed(2)}</p>}
    </Section>
  );
};

const CurrencyConverter = () => {
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
    <Section title="Конвертер валют">
      <Input label="Сума" value={amount} setValue={setAmount} />
      <Input label="Курс" value={rate} setValue={setRate} />
      <Button onClick={convert}>Конвертувати</Button>
      {converted !== null && <p>Результат: {converted.toFixed(2)}</p>}
    </Section>
  );
};

// --- Допоміжні компоненти ---

const Section = ({ title, children }) => (
  <div className="border rounded p-4 shadow-md">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Input = ({ label, value, setValue }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border px-2 py-1 w-full rounded"
    />
  </div>
);

const Button = ({ onClick, children }) => (
  <button onClick={onClick} className="bg-green-500 text-white px-4 py-2 rounded">
    {children}
  </button>
);

export default FinancialCalculator;
