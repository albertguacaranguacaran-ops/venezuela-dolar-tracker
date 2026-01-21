import { Controller, Get } from '@nestjs/common';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
    constructor(private readonly ratesService: RatesService) { }

    @Get()
    async getRates() {
        return this.ratesService.getAllRates();
    }

    @Get('bcv')
    async getBcv() {
        return this.ratesService.getBcvRate();
    }
}
