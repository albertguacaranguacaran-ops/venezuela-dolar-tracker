import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
        source: string;
    };
    binance: {
        buy: number;
        sell: number;
        avgBuy: number;
        avgSell: number;
    };
    paralelo: {
        rate: number; // (EUR + Binance Avg) / 2
        formula: string;
    };
    spread: {
        bcvVsBinanceBuy: number;
        bcvVsBinanceSell: number;
        bcvVsParalelo: number;
        binanceSellVsBuy: number;
    };
    timestamp: string;
}

@Injectable()
export class RatesService {

    async getBcvRate(): Promise<{ usd: number; eur: number; date: string; source: string }> {
        try {
            // Try direct scraping from BCV website first
            const bcvData = await this.scrapeBcvWebsite();
            if (bcvData.usd > 0) {
                return bcvData;
            }
            // Fallback to API if scraping fails
            return await this.getBcvFromApi();
        } catch (error) {
            console.error('Error fetching BCV rate:', error.message);
            // Try API as fallback
            try {
                return await this.getBcvFromApi();
            } catch {
                return { usd: 0, eur: 0, date: new Date().toISOString().split('T')[0], source: 'error' };
            }
        }
    }

    private async scrapeBcvWebsite(): Promise<{ usd: number; eur: number; date: string; source: string }> {
        // BCV website has SSL certificate issues, need to bypass verification
        const https = require('https');
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        const response = await axios.get('https://www.bcv.org.ve/', {
            timeout: 15000,
            httpsAgent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            },
        });

        const $ = cheerio.load(response.data);

        let usdRate = 0;
        let eurRate = 0;

        // The BCV site structure: rates appear in order EUR, CNY, TRY, RUB, USD
        // USD is the last one and appears with format: $  USD   347,26310000

        // Get all text and search for patterns
        const html = response.data;

        // Search for USD pattern: USD followed by whitespace and number
        // Format in HTML: USD</span>...</strong>347,26310000</strong>
        const usdRegex = /USD[\s\S]*?<strong[^>]*>(\d{2,3}),(\d{2,10})<\/strong>/i;
        const usdHtmlMatch = html.match(usdRegex);
        if (usdHtmlMatch) {
            const value = parseFloat(`${usdHtmlMatch[1]}.${usdHtmlMatch[2].substring(0, 2)}`);
            if (value > 100 && value < 500) {
                usdRate = Math.round(value * 100) / 100;
            }
        }

        // Search for EUR pattern
        const eurRegex = /EUR[\s\S]*?<strong[^>]*>(\d{2,3}),(\d{2,10})<\/strong>/i;
        const eurHtmlMatch = html.match(eurRegex);
        if (eurHtmlMatch) {
            const value = parseFloat(`${eurHtmlMatch[1]}.${eurHtmlMatch[2].substring(0, 2)}`);
            if (value > 100 && value < 600) {
                eurRate = Math.round(value * 100) / 100;
            }
        }

        // Fallback: Try extracting from text content if HTML parsing failed
        if (!usdRate || !eurRate) {
            const bodyText = $('body').text();

            // Match USD: USD followed by spaces and number
            if (!usdRate) {
                const usdMatch = bodyText.match(/USD\s+(\d{2,3})[,.](\d{2,10})/i);
                if (usdMatch) {
                    const value = parseFloat(`${usdMatch[1]}.${usdMatch[2].substring(0, 2)}`);
                    if (value > 100 && value < 500) {
                        usdRate = Math.round(value * 100) / 100;
                    }
                }
            }

            // Match EUR: EUR followed by spaces and number
            if (!eurRate) {
                const eurMatch = bodyText.match(/EUR\s+(\d{2,3})[,.](\d{2,10})/i);
                if (eurMatch) {
                    const value = parseFloat(`${eurMatch[1]}.${eurMatch[2].substring(0, 2)}`);
                    if (value > 100 && value < 600) {
                        eurRate = Math.round(value * 100) / 100;
                    }
                }
            }
        }

        console.log(`BCV Scraping - USD=${usdRate}, EUR=${eurRate}, HTML match: ${!!usdHtmlMatch}`);

        // Try to extract date
        let dateStr = new Date().toISOString().split('T')[0];
        const dateMatch = response.data.match(/Fecha Valor[:\s]*([^<]+)/i);
        if (dateMatch) {
            dateStr = new Date().toISOString().split('T')[0];
        }

        console.log(`BCV Scraping result: USD=${usdRate}, EUR=${eurRate}`);

        return {
            usd: usdRate,
            eur: eurRate,
            date: dateStr,
            source: 'bcv-scraping',
        };
    }

    private async getBcvFromApi(): Promise<{ usd: number; eur: number; date: string; source: string }> {
        const [bcvResponse, eurResponse] = await Promise.all([
            axios.get('https://ve.dolarapi.com/v1/dolares/oficial', { timeout: 10000 }),
            axios.get('https://api.exchangerate-api.com/v4/latest/EUR', { timeout: 10000 }),
        ]);

        const bcvData = bcvResponse.data;
        const eurData = eurResponse.data;

        const usdRate = bcvData.promedio || 0;
        const eurUsdRate = eurData.rates?.USD || 1.17;
        const eurRate = usdRate * eurUsdRate;

        const dateStr = bcvData.fechaActualizacion
            ? new Date(bcvData.fechaActualizacion).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

        return {
            usd: usdRate,
            eur: Math.round(eurRate * 100) / 100,
            date: dateStr,
            source: 've.dolarapi.com',
        };
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
        const binanceAvg = (avgBuy + avgSell) / 2;

        // Tasa Paralelo / Compra Físico = (EUR + Promedio Binance) / 2
        const paraleloRate = bcv.eur > 0 && binanceAvg > 0
            ? Math.round(((bcv.eur + binanceAvg) / 2) * 100) / 100
            : 0;

        return {
            bcv: bcv,
            binance: {
                buy: binanceBuy,
                sell: binanceSell,
                avgBuy: Math.round(avgBuy * 100) / 100,
                avgSell: Math.round(avgSell * 100) / 100,
            },
            paralelo: {
                rate: paraleloRate,
                formula: '(EUR + Promedio Binance) / 2',
            },
            spread: {
                bcvVsBinanceBuy: bcv.usd > 0 ? Math.round(((binanceBuy - bcv.usd) / bcv.usd) * 10000) / 100 : 0,
                bcvVsBinanceSell: bcv.usd > 0 ? Math.round(((binanceSell - bcv.usd) / bcv.usd) * 10000) / 100 : 0,
                bcvVsParalelo: bcv.usd > 0 ? Math.round(((paraleloRate - bcv.usd) / bcv.usd) * 10000) / 100 : 0,
                binanceSellVsBuy: binanceBuy > 0 ? Math.round(((binanceSell - binanceBuy) / binanceBuy) * 10000) / 100 : 0,
            },
            timestamp: new Date().toISOString(),
        };
    }
}

