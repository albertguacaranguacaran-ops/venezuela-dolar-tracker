import React from 'react';

interface RateCardProps {
    title: string;
    rate: number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    color: 'blue' | 'green' | 'purple' | 'orange';
}

export const RateCard: React.FC<RateCardProps> = ({ title, rate, subtitle, icon, color }) => {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
        green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
        orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    };

    const iconColorClasses = {
        blue: 'text-blue-400',
        green: 'text-emerald-400',
        purple: 'text-purple-400',
        orange: 'text-orange-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl`}>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-3xl ${iconColorClasses[color]}`}>{icon}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{title}</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
                {rate > 0 ? `Bs. ${rate.toFixed(2)}` : 'Cargando...'}
            </div>
            {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>
    );
};
