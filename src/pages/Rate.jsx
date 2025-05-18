import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PreferencesContext } from '../context/PreferencesContext';
import { useTranslation } from 'react-i18next';

const banks = ['NBU', 'PrivatBank', 'MonoBank'];
const defaultStocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NFLX', 'NVDA', 'BABA', 'INTC', 'AMD', 'DIS', 'V', 'MA', 'PYPL', 'KO', 'PEP', 'UBER', 'LYFT'];
const defaultCryptos = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'MATICUSDT', 'AVAXUSDT', 'TRXUSDT', 'LINKUSDT', 'LTCUSDT', 'SHIBUSDT'];

const currencyCodeMap = {
  840: 'USD', 978: 'EUR', 980: 'UAH', 826: 'GBP',
  985: 'PLN', 756: 'CHF', 392: 'JPY', 971: 'AFN',
  784: 'AED', 156: 'CNY', 8: 'ALL'
};

const allowedMonoCurrencies = [840, 978, 826, 392, 756, 156, 784, 971, 8];
const CACHE_DURATION = 30 * 1000;

export default function App() {
  const { theme, language } = useContext(PreferencesContext);
  const { t } = useTranslation();

  const [bank, setBank] = useState('NBU');
  const [currencyRates, setCurrencyRates] = useState([]);
  const [cryptoRates, setCryptoRates] = useState([]);
  const [stockRates, setStockRates] = useState([]);
  const [customCryptoSymbols, setCustomCryptoSymbols] = useState([]);
  const [customStockSymbols, setCustomStockSymbols] = useState([]);
  const [newCrypto, setNewCrypto] = useState('');
  const [newStock, setNewStock] = useState('');

  useEffect(() => { fetchCurrencyRates(); }, [bank]);
  useEffect(() => { fetchCryptoRates(); }, [customCryptoSymbols]);
  useEffect(() => { fetchStockRates(); }, [customStockSymbols]);

  const fetchCurrencyRates = async () => {
    try {
      let data = [];

      if (bank === 'NBU') {
        const res = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        data = res.data.filter(item => ['USD', 'EUR', 'PLN', 'GBP', 'CHF', 'JPY'].includes(item.cc));
      } else if (bank === 'PrivatBank') {
        const res = await axios.get('https://api.allorigins.win/raw?url=https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        data = res.data.filter(item => ['USD', 'EUR', 'PLN', 'GBP', 'CHF', 'JPY'].includes(item.ccy));
      } else if (bank === 'MonoBank') {
        const cache = localStorage.getItem('monobankRates');
        const timestamp = localStorage.getItem('monobankRatesTimestamp');
        const now = Date.now();

        if (cache && timestamp && now - Number(timestamp) < 60 * 1000) {
          data = JSON.parse(cache);
        } else {
          const res = await axios.get('https://api.monobank.ua/bank/currency');
          data = res.data;
          localStorage.setItem('monobankRates', JSON.stringify(data));
          localStorage.setItem('monobankRatesTimestamp', now.toString());
        }

        data = data.filter(rate => allowedMonoCurrencies.includes(rate.currencyCodeA) && rate.currencyCodeB === 980);
      }

      setCurrencyRates(data);
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };

  const fetchCryptoRates = async () => {
    try {
      const now = Date.now();
      const cache = localStorage.getItem('cryptoRates');
      const cacheTimestamp = localStorage.getItem('cryptoRatesTimestamp');

      if (cache && cacheTimestamp && now - Number(cacheTimestamp) < CACHE_DURATION) {
        setCryptoRates(JSON.parse(cache));
        return;
      }

      const allSymbols = [...defaultCryptos, ...customCryptoSymbols];
      const responses = await Promise.all(
        allSymbols.map(symbol =>
          axios.get(`https://corsproxy.io/?https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
        )
      );

      const data = responses.map(res => res.data);
      setCryptoRates(data);
      localStorage.setItem('cryptoRates', JSON.stringify(data));
      localStorage.setItem('cryptoRatesTimestamp', now.toString());
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
    }
  };

  const fetchStockRates = async () => {
    try {
      const now = Date.now();
      const cache = localStorage.getItem('stockRates');
      const cacheTimestamp = localStorage.getItem('stockRatesTimestamp');

      if (cache && cacheTimestamp && now - Number(cacheTimestamp) < CACHE_DURATION) {
        setStockRates(JSON.parse(cache));
        return;
      }

      const allStocks = [...defaultStocks, ...customStockSymbols];
      const responses = await Promise.all(
        allStocks.map(symbol =>
          axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d0ktcf1r01qhb02502p0d0ktcf1r01qhb02502pg`)
        )
      );

      const data = responses.map((res, i) => ({
        symbol: allStocks[i],
        price: res.data.c
      }));

      setStockRates(data);
      localStorage.setItem('stockRates', JSON.stringify(data));
      localStorage.setItem('stockRatesTimestamp', now.toString());
    } catch (error) {
      console.error('Error fetching stock rates:', error);
    }
  };

  return (
    <div className={`container py-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h1>{t('exchange_rates_title') || 'Курси валют, криптовалют і акцій'}</h1>
        </div>
      </div>

      <div className="mb-4">
        <h3>{t('currency_rates') || 'Курси валют'}</h3>
        <label className="form-label">{t('bank') || 'Банк'}:</label>
        <select className="form-select mb-3" value={bank} onChange={(e) => setBank(e.target.value)}>
          {banks.map(b => <option key={b}>{b}</option>)}
        </select>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>{t('currency') || 'Валюта'}</th>
                <th>{t('buy') || 'Купівля'}</th>
                <th>{t('sell') || 'Продаж'}</th>
              </tr>
            </thead>
            <tbody>
              {currencyRates.map((rate, i) => (
                <tr key={i}>
                  <td>{bank === 'NBU' ? rate.cc : bank === 'PrivatBank' ? rate.ccy : currencyCodeMap[rate.currencyCodeA]}</td>
                  <td>{bank === 'NBU' ? rate.rate?.toFixed(2) : bank === 'PrivatBank' ? rate.buy : (rate.rateBuy || rate.rateCross)?.toFixed(2)}</td>
                  <td>{bank === 'NBU' ? rate.rate?.toFixed(2) : bank === 'PrivatBank' ? rate.sale : (rate.rateSell || rate.rateCross)?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <h3>{t('crypto_rates') || 'Криптовалюти (Binance)'}</h3>
        <label className="form-label">{t('add_crypto') || 'Додати криптовалюту'}:</label>
        <div className="input-group mb-3">
          <input
            className="form-control"
            value={newCrypto}
            onChange={e => setNewCrypto(e.target.value.toUpperCase())}
            placeholder="BTC, ETH..."
          />
          <button className="btn btn-primary" onClick={() => {
            if (newCrypto) {
              const symbol = newCrypto.endsWith('USDT') ? newCrypto : newCrypto + 'USDT';
              if (!customCryptoSymbols.includes(symbol)) {
                setCustomCryptoSymbols([...customCryptoSymbols, symbol]);
                setNewCrypto('');
              }
            }
          }}>{t('add') || 'Додати'}</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>{t('crypto') || 'Криптовалюта'}</th>
                <th>{t('price') || 'Ціна'}</th>
              </tr>
            </thead>
            <tbody>
              {cryptoRates.map((rate, i) => (
                <tr key={i}>
                  <td>{rate.symbol.replace(/USDT$/, '')}</td>
                  <td>{rate.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <h3>{t('stocks') || 'Акції'}</h3>
        <label className="form-label">{t('add_stock') || 'Додати акцію'}:</label>
        <div className="input-group mb-3">
          <input
            className="form-control"
            value={newStock}
            onChange={e => setNewStock(e.target.value.toUpperCase())}
            placeholder="AAPL, TSLA..."
          />
          <button className="btn btn-primary" onClick={() => {
            if (newStock && !customStockSymbols.includes(newStock)) {
              setCustomStockSymbols([...customStockSymbols, newStock]);
              setNewStock('');
            }
          }}>{t('add') || 'Додати'}</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>{t('stock') || 'Акція'}</th>
                <th>{t('price') || 'Ціна'}</th>
              </tr>
            </thead>
            <tbody>
              {stockRates.map(stock => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
