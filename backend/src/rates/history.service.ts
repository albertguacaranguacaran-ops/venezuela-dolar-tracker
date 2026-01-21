import { Injectable, OnModuleInit } from '@nestjs/common';
import { RatesService, RatesResponse } from './rates.service';
import * as fs from 'fs';
import * as path from 'path';

export interface HistoryEntry {
    timestamp: string;
    bcvUsd: number;
    bcvEur: number;
    binanceBuy: number;
    binanceSell: number;
}

@Injectable()
export class HistoryService implements OnModuleInit {
    private history: HistoryEntry[] = [];
    private readonly historyFile = path.join(process.cwd(), 'rates-history.json');
    private readonly maxEntries = 168; // 7 days * 24 hours = 168 entries (hourly)

    constructor(private readonly ratesService: RatesService) { }

    async onModuleInit() {
        this.loadHistory();
        // Save initial rates on startup
        await this.saveCurrentRates();
        // Schedule saving rates every 30 minutes
        setInterval(() => this.saveCurrentRates(), 30 * 60 * 1000);
    }

    private loadHistory() {
        try {
            if (fs.existsSync(this.historyFile)) {
                const data = fs.readFileSync(this.historyFile, 'utf-8');
                this.history = JSON.parse(data);
                console.log(`Loaded ${this.history.length} history entries`);
            }
        } catch (error) {
            console.error('Error loading history:', error.message);
            this.history = [];
        }
    }

    private saveHistoryToFile() {
        try {
            fs.writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
        } catch (error) {
            console.error('Error saving history:', error.message);
        }
    }

    async saveCurrentRates(): Promise<void> {
        try {
            const rates = await this.ratesService.getAllRates();

            const entry: HistoryEntry = {
                timestamp: new Date().toISOString(),
                bcvUsd: rates.bcv.usd,
                bcvEur: rates.bcv.eur,
                binanceBuy: rates.binance.buy,
                binanceSell: rates.binance.sell,
            };

            this.history.push(entry);

            // Keep only the last maxEntries
            if (this.history.length > this.maxEntries) {
                this.history = this.history.slice(-this.maxEntries);
            }

            this.saveHistoryToFile();
            console.log(`Saved rates at ${entry.timestamp}`);
        } catch (error) {
            console.error('Error saving current rates:', error.message);
        }
    }

    getHistory(limit?: number): HistoryEntry[] {
        const entries = limit ? this.history.slice(-limit) : this.history;
        return entries;
    }

    // Get history grouped by day for weekly view
    getDailyHistory(): HistoryEntry[] {
        const dailyMap = new Map<string, HistoryEntry>();

        for (const entry of this.history) {
            const date = entry.timestamp.split('T')[0];
            // Keep the latest entry for each day
            dailyMap.set(date, entry);
        }

        return Array.from(dailyMap.values()).slice(-7);
    }
}
