import { useState, useEffect } from 'react';
import { api } from './services/api';
import type { RatesResponse } from './services/api';
import { RateCard } from './components/RateCard';
import { Calculator } from './components/Calculator';
import { StatsCard } from './components/StatsCard';
import { AdBanner } from './components/AdBanner';
import { HistoryChart } from './components/HistoryChart';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [visits, setVisits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchRates = async () => {
    try {
      const data = await api.getRates();
      setRates(data);
      setLastUpdate(new Date().toLocaleTimeString('es-VE'));
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async () => {
    try {
      const data = await api.incrementVisits();
      setVisits(data.count);
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  };

  useEffect(() => {
    fetchRates();
    trackVisit();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              <span className="text-4xl">💵</span>
              Venezuela Dolar Tracker
            </h1>
            <p className="text-gray-400 mt-1">
              Tasas del dólar y euro en tiempo real • BCV & Binance P2P
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
              <span className="text-emerald-400">👁️</span>
              <span>{visits.toLocaleString()} visitas</span>
            </div>
            {lastUpdate && (
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                <span>Actualizado: {lastUpdate}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Ad Banner Top */}
      <div className="max-w-7xl mx-auto mb-6">
        <AdBanner position="top" />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Rate Cards - 6 cards including Paralelo */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <RateCard
            title="BCV USD"
            rate={rates?.bcv.usd || 0}
            subtitle={`Fecha: ${rates?.bcv.date || '-'}`}
            icon="🏛️"
            color="blue"
          />
          <RateCard
            title="BCV EUR"
            rate={rates?.bcv.eur || 0}
            subtitle={`Fecha: ${rates?.bcv.date || '-'}`}
            icon="💶"
            color="purple"
          />
          <RateCard
            title="Compra Físico"
            rate={rates?.paralelo?.rate || 0}
            subtitle="(EUR + Promedio Binance) / 2"
            icon="💵"
            color="cyan"
          />
          <RateCard
            title="Binance Compra"
            rate={rates?.binance.buy || 0}
            subtitle="USDT/VES P2P"
            icon="💚"
            color="green"
          />
          <RateCard
            title="Binance Venta"
            rate={rates?.binance.sell || 0}
            subtitle="USDT/VES P2P"
            icon="🔶"
            color="orange"
          />
          <RateCard
            title="Promedio Binance"
            rate={rates?.binance.avgBuy || 0}
            subtitle="Top 10 ofertas"
            icon="📊"
            color="green"
          />
        </div>

        {/* Spread Statistics */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-4 mb-8">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            📈 Brecha Cambiaria (Spread)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700/30 rounded-xl">
              <p className="text-gray-400 text-xs mb-1">BCV vs Binance Compra</p>
              <p className={`text-xl font-bold ${(rates?.spread?.bcvVsBinanceBuy ?? 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {(rates?.spread?.bcvVsBinanceBuy ?? 0) >= 0 ? '+' : ''}{rates?.spread?.bcvVsBinanceBuy ?? 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-xl">
              <p className="text-gray-400 text-xs mb-1">BCV vs Binance Venta</p>
              <p className={`text-xl font-bold ${(rates?.spread?.bcvVsBinanceSell ?? 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {(rates?.spread?.bcvVsBinanceSell ?? 0) >= 0 ? '+' : ''}{rates?.spread?.bcvVsBinanceSell ?? 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-xl">
              <p className="text-gray-400 text-xs mb-1">BCV vs Compra Físico</p>
              <p className={`text-xl font-bold ${(rates?.spread?.bcvVsParalelo ?? 0) >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {(rates?.spread?.bcvVsParalelo ?? 0) >= 0 ? '+' : ''}{rates?.spread?.bcvVsParalelo ?? 0}%
              </p>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-xl">
              <p className="text-gray-400 text-xs mb-1">Binance Venta vs Compra</p>
              <p className={`text-xl font-bold ${(rates?.spread?.binanceSellVsBuy ?? 0) >= 0 ? 'text-amber-400' : 'text-green-400'}`}>
                {(rates?.spread?.binanceSellVsBuy ?? 0) >= 0 ? '+' : ''}{rates?.spread?.binanceSellVsBuy ?? 0}%
              </p>
            </div>
          </div>
        </div>

        {/* History Chart */}
        <div className="mb-8">
          <HistoryChart apiUrl={API_URL} />
        </div>

        {/* Calculator and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Calculator
            bcvRate={rates?.bcv.usd || 0}
            binanceBuy={rates?.binance.buy || 0}
            binanceSell={rates?.binance.sell || 0}
            paraleloRate={rates?.paralelo?.rate || 0}
          />
          <StatsCard
            bcvRate={rates?.bcv.usd || 0}
            binanceBuy={rates?.binance.buy || 0}
            binanceSell={rates?.binance.sell || 0}
          />
        </div>

        {/* Banks Info */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🏦 Bancos con Sistema de Divisas al Menudeo (BCV)
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Estos bancos participan en el sistema de venta de divisas al público a tasa BCV:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['Banesco', 'BBVA Provincial', 'BNC', 'Bancaribe', 'Banco Exterior', 'Banplus'].map((bank) => (
              <div key={bank} className="bg-slate-700/30 rounded-xl p-3 text-center">
                <span className="text-white font-medium text-sm">{bank}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">
            * La disponibilidad depende de cada banco. Consulta tu banca en línea para verificar.
          </p>
        </div>
      </main>

      {/* Ad Banner Bottom */}
      <div className="max-w-7xl mx-auto mt-8">
        <AdBanner position="bottom" />
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>
          Datos de <a href="https://ve.dolarapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">DolarAPI</a>,
          {' '}<a href="https://exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ExchangeRate-API</a> y Binance P2P
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} Venezuela Dolar Tracker • Para uso informativo
        </p>
      </footer>
    </div>
  );
}

export default App;

