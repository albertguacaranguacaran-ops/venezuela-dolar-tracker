import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    paralelo: {
        rate: number;
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

export const api = {
    getRates: async (): Promise<RatesResponse> => {
        const response = await axios.get<RatesResponse>(`${API_URL}/rates`);
        return response.data;
    },

    getVisits: async (): Promise<{ count: number }> => {
        const response = await axios.get<{ count: number }>(`${API_URL}/visits`);
        return response.data;
    },

    incrementVisits: async (): Promise<{ count: number }> => {
        const response = await axios.post<{ count: number }>(`${API_URL}/visits/increment`);
        return response.data;
    },
};
