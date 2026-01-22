import React from 'react';

interface AdBannerProps {
    position: 'top' | 'bottom' | 'sidebar';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
    const sizeClasses = {
        top: 'h-20 w-full',
        bottom: 'h-24 w-full',
        sidebar: 'h-64 w-full',
    };

    return (
        <div className={`${sizeClasses[position]} bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 flex items-center justify-center overflow-hidden relative group cursor-default`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-gray-900 to-black"></div>

            <div className="text-center z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-emerald-400 text-lg">📢</span>
                    <span className="text-gray-300 font-medium tracking-wide">Espacio Disponible</span>
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-wider">
                    Tu publicidad aquí
                </div>
            </div>
        </div>
    );
};
