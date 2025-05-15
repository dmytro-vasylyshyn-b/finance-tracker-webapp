import React, { useState } from "react";

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [interest, setInterest] = useState(null);

  const calculateInterest = () => {
    const p = Number(principal);
    const r = Number(rate);
    const t = Number(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      setInterest("Invalid input");
      return;
    }

    const result = (p * r * t) / 100;
    setInterest(result.toFixed(2));
  };

  return (
    <div>
      <h2>Simple Interest Calculator</h2>
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
      <button onClick={calculateInterest}>Calculate</button>
      {interest !== null && <p>Interest: {interest}</p>}
    </div>
  );
};

export default SimpleInterestCalculator;
