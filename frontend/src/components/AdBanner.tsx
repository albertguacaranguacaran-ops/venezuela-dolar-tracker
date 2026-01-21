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
        <div className={`${sizeClasses[position]} bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30 flex items-center justify-center overflow-hidden`}>
            <div className="text-center">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Publicidad</div>
                <div className="text-gray-400 text-sm">
                    {/* Google AdSense placeholder - Replace with actual ad code */}
                    Espacio para tu anuncio
                </div>
                <div className="text-gray-600 text-xs mt-1">
                    {position === 'top' && '728x90'}
                    {position === 'bottom' && '970x90'}
                    {position === 'sidebar' && '300x250'}
                </div>
            </div>
        </div>
    );
};
