import React, { useState } from 'react';

interface CalculatorProps {
    bcvRate: number;
    binanceBuy: number;
    binanceSell: number;
    paraleloRate: number;
}

export const Calculator: React.FC<CalculatorProps> = ({ bcvRate, binanceBuy, binanceSell, paraleloRate }) => {
    const [amount, setAmount] = useState<string>('100');
    const [currency, setCurrency] = useState<'USD' | 'VES'>('USD');

    const numAmount = parseFloat(amount) || 0;

    const results = currency === 'USD'
        ? {
            bcv: numAmount * bcvRate,
            binanceBuy: numAmount * binanceBuy,
            binanceSell: numAmount * binanceSell,
            paralelo: numAmount * paraleloRate,
        }
        : {
            bcv: bcvRate > 0 ? numAmount / bcvRate : 0,
            binanceBuy: binanceBuy > 0 ? numAmount / binanceBuy : 0,
            binanceSell: binanceSell > 0 ? numAmount / binanceSell : 0,
            paralelo: paraleloRate > 0 ? numAmount / paraleloRate : 0,
        };

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🔢 Calculadora de Divisas
            </h3>

            <div className="flex gap-3 mb-6">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monto"
                />
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'VES')}
                    className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="USD">USD $</option>
                    <option value="VES">VES Bs.</option>
                </select>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <span className="text-gray-300">Tasa BCV</span>
                    <span className="text-xl font-bold text-blue-400">
                        {currency === 'USD' ? `Bs. ${results.bcv.toFixed(2)}` : `$ ${results.bcv.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <div>
                        <span className="text-gray-300">Paralelo</span>
                        <span className="text-gray-500 text-xs ml-2">(Compra Físico)</span>
                    </div>
                    <span className="text-xl font-bold text-cyan-400">
                        {currency === 'USD' ? `Bs. ${results.paralelo.toFixed(2)}` : `$ ${results.paralelo.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-gray-300">Binance Compra</span>
                    <span className="text-xl font-bold text-emerald-400">
                        {currency === 'USD' ? `Bs. ${results.binanceBuy.toFixed(2)}` : `$ ${results.binanceBuy.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <span className="text-gray-300">Binance Venta</span>
                    <span className="text-xl font-bold text-orange-400">
                        {currency === 'USD' ? `Bs. ${results.binanceSell.toFixed(2)}` : `$ ${results.binanceSell.toFixed(2)}`}
                    </span>
                </div>
            </div>
        </div>
    );
};
