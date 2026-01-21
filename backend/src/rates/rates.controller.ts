import { Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { HistoryService } from './history.service';

@Controller('rates')
export class RatesController {
    constructor(
        private readonly ratesService: RatesService,
        private readonly historyService: HistoryService,
    ) { }

    @Get()
    async getRates() {
        return this.ratesService.getAllRates();
    }

    @Get('bcv')
    async getBcv() {
        return this.ratesService.getBcvRate();
    }

    @Get('history')
    async getHistory(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : undefined;
        return this.historyService.getHistory(limitNum);
    }

    @Get('history/daily')
    async getDailyHistory() {
        return this.historyService.getDailyHistory();
    }
}
