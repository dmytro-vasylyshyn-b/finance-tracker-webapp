import React, { useState } from "react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [compoundings, setCompoundings] = useState("");
  const [amount, setAmount] = useState(null);

  const calculateCompoundInterest = () => {
    const p = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);
    const n = Number(compoundings);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      setAmount("Invalid input");
      return;
    }

    const result = p * Math.pow(1 + r / n, n * t);
    setAmount(result.toFixed(2));
  };

  return (
    <div>
      <h2>Compound Interest Calculator</h2>
      <input
        type="text"
        placeholder="Principal"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
      />
      <input
        type="text"
        placeholder="Rate (%)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Time (years)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Compoundings per year"
        value={compoundings}
        onChange={(e) => setCompoundings(e.target.value)}
      />
      <button onClick={calculateCompoundInterest}>Calculate</button>
      {amount !== null && <p>Amount: {amount}</p>}
    </div>
  );
};

export default CompoundInterestCalculator;
