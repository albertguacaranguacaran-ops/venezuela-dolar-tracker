import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

interface BinanceP2PResponse {
    data: Array<{
        adv: {
            price: string;
            minSingleTransAmount: string;
            maxSingleTransAmount: string;
        };
        advertiser: {
            nickName: string;
        };
    }>;
}

export interface RatesResponse {
    bcv: {
        usd: number;
        eur: number;
        date: string;
    };
    binance: {
        buy: number;
        sell: number;
        avgBuy: number;
        avgSell: number;
    };
    spread: {
        bcvVsBinanceBuy: number;
        binanceSellVsBuy: number;
    };
    timestamp: string;
}

@Injectable()
export class RatesService {

    async getBcvRate(): Promise<{ usd: number; eur: number; date: string }> {
        try {
            // Using ve.dolarapi.com for BCV official rates
            const response = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial', {
                timeout: 10000,
            });

            const data = response.data;
            const dateStr = data.fechaActualizacion
                ? new Date(data.fechaActualizacion).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            return {
                usd: data.promedio || 0,
                eur: 0, // This API doesn't provide EUR rate
                date: dateStr,
            };
        } catch (error) {
            console.error('Error fetching BCV rate:', error.message);
            // Fallback values
            return { usd: 0, eur: 0, date: new Date().toISOString().split('T')[0] };
        }
    }

    async getBinanceP2P(tradeType: 'BUY' | 'SELL'): Promise<number[]> {
        try {
            const response = await axios.post<BinanceP2PResponse>(
                'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
                {
                    asset: 'USDT',
                    fiat: 'VES',
                    merchantCheck: false,
                    page: 1,
                    payTypes: [],
                    publisherType: null,
                    rows: 10,
                    tradeType: tradeType,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }
            );

            const prices = response.data.data.map(item => parseFloat(item.adv.price));
            return prices;
        } catch (error) {
            console.error(`Error fetching Binance P2P ${tradeType}:`, error.message);
            return [];
        }
    }

    async getAllRates(): Promise<RatesResponse> {
        const [bcv, buyPrices, sellPrices] = await Promise.all([
            this.getBcvRate(),
            this.getBinanceP2P('BUY'),
            this.getBinanceP2P('SELL'),
        ]);

        const avgBuy = buyPrices.length > 0
            ? buyPrices.reduce((a, b) => a + b, 0) / buyPrices.length
            : 0;
        const avgSell = sellPrices.length > 0
            ? sellPrices.reduce((a, b) => a + b, 0) / sellPrices.length
            : 0;

        const binanceBuy = buyPrices[0] || 0;
        const binanceSell = sellPrices[0] || 0;

        return {
            bcv: bcv,
            binance: {
                buy: binanceBuy,
                sell: binanceSell,
                avgBuy: Math.round(avgBuy * 100) / 100,
                avgSell: Math.round(avgSell * 100) / 100,
            },
            spread: {
                bcvVsBinanceBuy: bcv.usd > 0 ? Math.round(((binanceBuy - bcv.usd) / bcv.usd) * 10000) / 100 : 0,
                binanceSellVsBuy: binanceBuy > 0 ? Math.round(((binanceSell - binanceBuy) / binanceBuy) * 10000) / 100 : 0,
            },
            timestamp: new Date().toISOString(),
        };
    }
}
