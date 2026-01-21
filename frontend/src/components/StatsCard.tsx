import React from 'react';

interface StatsCardProps {
    bcvRate: number;
    binanceBuy: number;
    binanceSell: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ bcvRate, binanceBuy, binanceSell }) => {
    const spreadBcvBinance = bcvRate > 0 ? ((binanceBuy - bcvRate) / bcvRate * 100).toFixed(2) : '0';
    const spreadBuySell = binanceBuy > 0 ? ((binanceSell - binanceBuy) / binanceBuy * 100).toFixed(2) : '0';

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📊 Estadísticas
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">{spreadBcvBinance}%</div>
                    <div className="text-sm text-gray-400 mt-1">Spread BCV vs Binance</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="text-3xl font-bold text-cyan-400">{spreadBuySell}%</div>
                    <div className="text-sm text-gray-400 mt-1">Spread Compra/Venta</div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-slate-700/20 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">💡 Consejo</div>
                <p className="text-gray-300 text-sm">
                    {parseFloat(spreadBcvBinance) > 5
                        ? 'El paralelo está significativamente más alto que el BCV. Considera comprar al oficial si tienes acceso.'
                        : 'Las tasas están relativamente alineadas. Buen momento para cualquier operación.'}
                </p>
            </div>
        </div>
    );
};
