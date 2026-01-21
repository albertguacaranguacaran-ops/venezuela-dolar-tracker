import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface HistoryEntry {
    timestamp: string;
    bcvUsd: number;
    bcvEur: number;
    binanceBuy: number;
    binanceSell: number;
}

interface HistoryChartProps {
    apiUrl: string;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ apiUrl }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'all' | 'bcv' | 'binance'>('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // 336 entries = 7 days * 48 half-hour intervals
                const response = await fetch(`${apiUrl}/rates/history?limit=336`);
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        // Refresh every 5 minutes
        const interval = setInterval(fetchHistory, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [apiUrl]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' });
    };

    const chartData = history.map(entry => ({
        ...entry,
        time: formatTime(entry.timestamp),
        date: formatDate(entry.timestamp),
        label: `${formatDate(entry.timestamp)} ${formatTime(entry.timestamp)}`,
    }));

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin text-4xl">⏳</div>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📈 Historial Semanal
                </h3>
                <div className="flex items-center justify-center h-48 text-gray-400">
                    <p>Aún no hay datos históricos. Los datos se guardan cada 30 minutos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    📈 Historial Semanal (7 días)
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'all'
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setView('bcv')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'bcv'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                            }`}
                    >
                        BCV
                    </button>
                    <button
                        onClick={() => setView('binance')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'binance'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                            }`}
                    >
                        Binance
                    </button>
                </div>
            </div>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#F3F4F6' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelFormatter={(_, payload) => {
                                if (payload && payload[0]) {
                                    return payload[0].payload.label;
                                }
                                return '';
                            }}
                        />
                        <Legend />
                        {(view === 'all' || view === 'bcv') && (
                            <>
                                <Line
                                    type="monotone"
                                    dataKey="bcvUsd"
                                    name="BCV USD"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="bcvEur"
                                    name="BCV EUR"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </>
                        )}
                        {(view === 'all' || view === 'binance') && (
                            <>
                                <Line
                                    type="monotone"
                                    dataKey="binanceBuy"
                                    name="Binance Compra"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="binanceSell"
                                    name="Binance Venta"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
