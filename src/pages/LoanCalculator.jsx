import React, { useState } from "react";

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateLoan = () => {
    const p = Number(principal);
    const annualRate = Number(rate) / 100;
    const y = Number(years);
    const n = y * 12;
    const r = annualRate / 12;

    if (isNaN(p) || isNaN(r) || isNaN(y)) {
      setMonthlyPayment("Invalid input");
      return;
    }

    const payment = (p * r) / (1 - Math.pow(1 + r, -n));
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div>
      <h2>Loan Calculator</h2>
      <input
        type="text"
        placeholder="Loan Amount"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
      />
      <input
        type="text"
        placeholder="Annual Interest Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Loan Term (years)"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />
      <button onClick={calculateLoan}>Calculate</button>
      {monthlyPayment !== null && <p>Monthly Payment: {monthlyPayment}</p>}
    </div>
  );
};

export default LoanCalculator;
