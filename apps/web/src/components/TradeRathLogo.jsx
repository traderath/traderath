import React from 'react';
import { cn } from '@/lib/utils';

const ASSETS = {
    color: '/traderath-logo.svg',
    light: '/traderath-logo-reversed.svg',
    reversed: '/traderath-logo-reversed.svg',
    monochrome: '/traderath-logo-monochrome.svg',
};

export const TradeRathMark = ({ className, variant = 'color' }) => (
    <img
        src={variant === 'light' || variant === 'reversed' ? '/traderath-icon-bg.svg' : '/traderath-icon.svg'}
        alt="TradeRath"
        className={cn('h-9 w-9 shrink-0 object-contain', className)}
    />
);

const TradeRathLogo = ({ className, variant = 'color', showTagline = false, size = 'md', compact = false }) => {
    const height = size === 'xl' ? 'h-[76px]' : size === 'lg' ? 'h-[62px]' : size === 'sticky' ? 'h-[48px]' : size === 'sm' ? 'h-[40px]' : 'h-[54px]';
    if (compact) return <TradeRathMark variant={variant} className={cn(height, 'w-auto')} />;
    const src = showTagline && variant === 'color' ? '/traderath-logo-tagline.svg' : ASSETS[variant] || ASSETS.color;
    return <img src={src} alt="TradeRath — From Supplier to Buyer." className={cn(height, 'w-auto max-w-[250px] object-contain', className)} />;
};

export default TradeRathLogo;

export const TRADE_RATH_BRAND_ASSETS = [
    { name: 'Standalone icon', file: '/traderath-icon.svg' },
    { name: 'Icon on brand blue', file: '/traderath-icon-bg.svg' },
    { name: 'Primary horizontal logo', file: '/traderath-logo.svg' },
    { name: 'Logo with tagline', file: '/traderath-logo-tagline.svg' },
    { name: 'Reversed logo', file: '/traderath-logo-reversed.svg' },
    { name: 'Monochrome logo', file: '/traderath-logo-monochrome.svg' },
    { name: 'Reversed logo on black', file: '/traderath-logo-reversed-black.svg' },
];
